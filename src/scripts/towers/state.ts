import { makeSeed, mulberry32, shuffle } from "./prng";
import {
  SIZE,
  computeClues,
  countSolutions,
  generateLatinSquare,
  makeCandidates,
  makeGrid,
  visibleCount,
  type Clues,
  type Side,
} from "./puzzle";

export type Difficulty = "easy" | "medium" | "hard";

interface CellSnapshot {
  value: number;
  candidates: Set<number>;
  removed: Set<number>;
}

interface CellChange {
  r: number;
  c: number;
  prev: CellSnapshot;
  next: CellSnapshot;
}

type Batch = Map<string, { r: number; c: number; prev: CellSnapshot }>;

export class TowersGame {
  grid: number[][] = makeGrid();
  candidates: Set<number>[][] = makeCandidates();
  // Pencil-marks the user has explicitly suppressed in auto mode. The
  // displayed set is computed - removedCandidates.
  removedCandidates: Set<number>[][] = makeCandidates();
  givens: boolean[][] = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(false),
  );
  solution: number[][] | null = null;
  clues: Clues = { top: [], bottom: [], left: [], right: [] };
  active: { r: number; c: number } | null = null;
  won = false;
  autoClues = false;
  autoAnswer = true;
  currentSeed = 0;
  editing = false;
  puzzleIsCustom = false;
  undoStack: CellChange[][] = [];
  redoStack: CellChange[][] = [];

  // ---------- Cell snapshots (used by undo/redo) ----------

  private snapshotCell(r: number, c: number): CellSnapshot {
    return {
      value: this.grid[r][c],
      candidates: new Set(this.candidates[r][c]),
      removed: new Set(this.removedCandidates[r][c]),
    };
  }

  private applyCell(r: number, c: number, snap: CellSnapshot): void {
    this.grid[r][c] = snap.value;
    this.candidates[r][c] = new Set(snap.candidates);
    this.removedCandidates[r][c] = new Set(snap.removed);
  }

  private sameSnap(a: CellSnapshot, b: CellSnapshot): boolean {
    if (a.value !== b.value) return false;
    if (a.candidates.size !== b.candidates.size) return false;
    for (const v of a.candidates) if (!b.candidates.has(v)) return false;
    if (a.removed.size !== b.removed.size) return false;
    for (const v of a.removed) if (!b.removed.has(v)) return false;
    return true;
  }

  // ---------- Multi-cell batches ----------

  private startBatch(): Batch {
    return new Map();
  }

  private recordCell(batch: Batch, r: number, c: number): void {
    const key = r + "," + c;
    if (!batch.has(key)) {
      batch.set(key, { r, c, prev: this.snapshotCell(r, c) });
    }
  }

  private commitBatch(batch: Batch): boolean {
    const cells: CellChange[] = [];
    for (const entry of batch.values()) {
      const next = this.snapshotCell(entry.r, entry.c);
      if (this.sameSnap(entry.prev, next)) continue;
      cells.push({ r: entry.r, c: entry.c, prev: entry.prev, next });
    }
    if (cells.length === 0) return false;
    this.undoStack.push(cells);
    this.redoStack.length = 0;
    return true;
  }

  // ---------- Queries ----------

  computedCandidates(r: number, c: number): Set<number> {
    const result = new Set([1, 2, 3, 4, 5]);
    for (let i = 0; i < SIZE; i++) {
      if (this.grid[r][i]) result.delete(this.grid[r][i]);
      if (this.grid[i][c]) result.delete(this.grid[i][c]);
    }
    return result;
  }

  displayCandidates(r: number, c: number): Set<number> {
    if (this.autoClues && this.grid[r][c] === 0) {
      const cands = this.computedCandidates(r, c);
      for (const x of this.removedCandidates[r][c]) cands.delete(x);
      return cands;
    }
    return this.candidates[r][c];
  }

  isClueSatisfied(side: Side, i: number): boolean {
    if (!this.clues[side] || this.clues[side][i] === 0) return false;
    let arr: number[];
    if (side === "top") arr = this.grid.map((row) => row[i]);
    else if (side === "bottom")
      arr = this.grid.map((row) => row[i]).reverse();
    else if (side === "left") arr = this.grid[i].slice();
    else arr = this.grid[i].slice().reverse();
    if (arr.includes(0)) return false;
    if (new Set(arr).size !== SIZE) return false;
    return visibleCount(arr) === this.clues[side][i];
  }

  // ---------- Mutations ----------

  private placeValue(batch: Batch, r: number, c: number, v: number): void {
    this.recordCell(batch, r, c);
    this.grid[r][c] = v;
    this.candidates[r][c].clear();
    for (let i = 0; i < SIZE; i++) {
      if (i !== c && this.candidates[r][i].has(v)) {
        this.recordCell(batch, r, i);
        this.candidates[r][i].delete(v);
      }
      if (i !== r && this.candidates[i][c].has(v)) {
        this.recordCell(batch, i, c);
        this.candidates[i][c].delete(v);
      }
    }
  }

  // Naked-single propagation: any empty cell with exactly one possible value
  // (given current row/column placements) is filled in. Iterates until no
  // more deductions are available, all within `batch`.
  private runAutoAnswer(batch: Batch): void {
    let changed = true;
    while (changed) {
      changed = false;
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (this.grid[r][c] !== 0 || this.givens[r][c]) continue;
          const possible = this.computedCandidates(r, c);
          if (possible.size === 1) {
            this.placeValue(batch, r, c, [...possible][0]);
            changed = true;
          }
        }
      }
    }
  }

  setActive(r: number, c: number): boolean {
    if (this.givens[r][c]) return false;
    this.active = { r, c };
    return true;
  }

  setAnswer(r: number, c: number, v: number): boolean {
    if (this.givens[r][c]) return false;
    const batch = this.startBatch();
    if (v === 0) {
      this.recordCell(batch, r, c);
      this.grid[r][c] = 0;
    } else {
      this.placeValue(batch, r, c, v);
      if (this.autoAnswer && !this.editing) this.runAutoAnswer(batch);
    }
    if (this.commitBatch(batch)) {
      if (!this.editing) this.checkWin();
      return true;
    }
    return false;
  }

  setClue(side: Side, i: number, v: number): boolean {
    if (!this.editing) return false;
    if (v < 0 || v > SIZE) return false;
    if (this.clues[side][i] === v) return false;
    this.clues[side][i] = v;
    return true;
  }

  toggleCandidate(r: number, c: number, v: number): boolean {
    if (this.givens[r][c]) return false;
    if (this.grid[r][c] !== 0) return false;
    if (this.autoClues) {
      // In auto mode the user can only subtract from auto's set: hide a mark
      // that's currently shown, or restore one they previously hid. They
      // can't add a candidate that auto already ruled out.
      if (!this.computedCandidates(r, c).has(v)) return false;
      const batch = this.startBatch();
      this.recordCell(batch, r, c);
      if (this.removedCandidates[r][c].has(v)) {
        this.removedCandidates[r][c].delete(v);
      } else {
        this.removedCandidates[r][c].add(v);
      }
      return this.commitBatch(batch);
    }
    const batch = this.startBatch();
    this.recordCell(batch, r, c);
    if (this.candidates[r][c].has(v)) this.candidates[r][c].delete(v);
    else this.candidates[r][c].add(v);
    return this.commitBatch(batch);
  }

  eraseCell(r: number, c: number): boolean {
    if (this.givens[r][c]) return false;
    const batch = this.startBatch();
    this.recordCell(batch, r, c);
    if (this.grid[r][c] !== 0) {
      this.grid[r][c] = 0;
    } else {
      this.candidates[r][c].clear();
    }
    if (this.commitBatch(batch)) {
      this.checkWin();
      return true;
    }
    return false;
  }

  undo(): boolean {
    const cells = this.undoStack.pop();
    if (!cells) return false;
    for (const { r, c, prev } of cells) this.applyCell(r, c, prev);
    this.redoStack.push(cells);
    this.active = { r: cells[0].r, c: cells[0].c };
    this.checkWin();
    return true;
  }

  redo(): boolean {
    const cells = this.redoStack.pop();
    if (!cells) return false;
    for (const { r, c, next } of cells) this.applyCell(r, c, next);
    this.undoStack.push(cells);
    this.active = { r: cells[0].r, c: cells[0].c };
    this.checkWin();
    return true;
  }

  clearEntries(): boolean {
    const batch = this.startBatch();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.givens[r][c]) continue;
        this.recordCell(batch, r, c);
        this.grid[r][c] = 0;
        this.candidates[r][c].clear();
      }
    }
    if (this.commitBatch(batch)) {
      this.checkWin();
      return true;
    }
    return false;
  }

  // ---------- Custom puzzle entry ----------

  startCustom(): void {
    this.editing = true;
    this.puzzleIsCustom = false;
    this.currentSeed = 0;
    this.solution = null;
    this.clues = {
      top: Array(SIZE).fill(0),
      bottom: Array(SIZE).fill(0),
      left: Array(SIZE).fill(0),
      right: Array(SIZE).fill(0),
    };
    this.grid = makeGrid();
    this.candidates = makeCandidates();
    this.removedCandidates = makeCandidates();
    this.givens = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.active = null;
    this.won = false;
  }

  // Re-enter edit mode on an already-finalized custom puzzle, preserving the
  // clues and the original givens but clearing any in-progress solving.
  editCustom(): void {
    this.editing = true;
    this.puzzleIsCustom = false;
    this.solution = null;
    this.removedCandidates = makeCandidates();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!this.givens[r][c]) this.grid[r][c] = 0;
        this.candidates[r][c].clear();
        this.givens[r][c] = false;
      }
    }
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.active = null;
    this.won = false;
  }

  // Lock the entered clues + filled cells as the puzzle. Returns the number
  // of valid completions (capped at 2). The caller can warn if it's not 1.
  finalizeCustom(): number {
    this.editing = false;
    this.puzzleIsCustom = true;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.grid[r][c] !== 0) {
          this.givens[r][c] = true;
          this.candidates[r][c].clear();
        }
      }
    }
    const solutions = countSolutions(this.grid, this.clues, 2);
    if (solutions === 1) {
      const solved = this.grid.map((row) => row.slice());
      const rowUsed = Array.from({ length: SIZE }, () => new Set<number>());
      const colUsed = Array.from({ length: SIZE }, () => new Set<number>());
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (solved[r][c]) {
            rowUsed[r].add(solved[r][c]);
            colUsed[c].add(solved[r][c]);
          }
        }
      }
      const fill = (idx: number): boolean => {
        if (idx === SIZE * SIZE) return true;
        const r = Math.floor(idx / SIZE);
        const c = idx % SIZE;
        if (solved[r][c] !== 0) return fill(idx + 1);
        for (let v = 1; v <= SIZE; v++) {
          if (rowUsed[r].has(v) || colUsed[c].has(v)) continue;
          solved[r][c] = v;
          rowUsed[r].add(v);
          colUsed[c].add(v);
          // Validate edge clues only when we finish a row/col.
          let ok = true;
          if (c === SIZE - 1) {
            if (
              (this.clues.left[r] &&
                visibleCount(solved[r]) !== this.clues.left[r]) ||
              (this.clues.right[r] &&
                visibleCount(solved[r].slice().reverse()) !==
                  this.clues.right[r])
            ) {
              ok = false;
            }
          }
          if (ok && r === SIZE - 1) {
            const col = solved.map((row) => row[c]);
            if (
              (this.clues.top[c] && visibleCount(col) !== this.clues.top[c]) ||
              (this.clues.bottom[c] &&
                visibleCount(col.slice().reverse()) !== this.clues.bottom[c])
            ) {
              ok = false;
            }
          }
          if (ok && fill(idx + 1)) return true;
          solved[r][c] = 0;
          rowUsed[r].delete(v);
          colUsed[c].delete(v);
        }
        return false;
      };
      fill(0);
      this.solution = solved;
    } else {
      this.solution = null;
    }
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.checkWin();
    return solutions;
  }

  loadCustom(clues: Clues, grid: number[][]): number {
    this.startCustom();
    this.clues = {
      top: clues.top.slice(),
      bottom: clues.bottom.slice(),
      left: clues.left.slice(),
      right: clues.right.slice(),
    };
    this.grid = grid.map((row) => row.slice());
    return this.finalizeCustom();
  }

  // ---------- Generator ----------

  newGame(difficulty: Difficulty, seedOverride?: number): number {
    const seed =
      typeof seedOverride === "number" ? seedOverride >>> 0 : makeSeed();
    this.currentSeed = seed;
    this.editing = false;
    this.puzzleIsCustom = false;
    const rng = mulberry32(seed);

    let targetHide: number;
    let targetGivens: number;
    if (difficulty === "easy") {
      targetHide = 0;
      targetGivens = 4;
    } else if (difficulty === "medium") {
      targetHide = 10;
      targetGivens = 0;
    } else {
      targetHide = 20;
      targetGivens = 0;
    }

    this.solution = generateLatinSquare(rng);
    this.clues = computeClues(this.solution);

    this.grid = makeGrid();
    this.candidates = makeCandidates();
    this.removedCandidates = makeCandidates();
    this.givens = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

    const positions: [number, number][] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) positions.push([r, c]);
    }
    shuffle(positions, rng);

    for (let k = 0; k < targetGivens; k++) {
      const [r, c] = positions[k];
      this.grid[r][c] = this.solution[r][c];
      this.givens[r][c] = true;
    }

    // Greedily hide clues, keeping each hide only if uniqueness survives.
    if (targetHide > 0) {
      const sides: [Side, number][] = [];
      for (let i = 0; i < SIZE; i++) {
        sides.push(["top", i]);
        sides.push(["bottom", i]);
        sides.push(["left", i]);
        sides.push(["right", i]);
      }
      shuffle(sides, rng);
      let hidden = 0;
      for (const [side, i] of sides) {
        if (hidden >= targetHide) break;
        if (this.clues[side][i] === 0) continue;
        const orig = this.clues[side][i];
        this.clues[side][i] = 0;
        if (countSolutions(this.grid, this.clues, 2) === 1) {
          hidden++;
        } else {
          this.clues[side][i] = orig;
        }
      }
    }

    // Safety net: if the puzzle still isn't unique (rare with all clues
    // visible), promote cells to givens until it is.
    let safety = 0;
    while (
      countSolutions(this.grid, this.clues, 2) > 1 &&
      safety < SIZE * SIZE
    ) {
      safety++;
      const free = positions.find(
        ([r, c]) => !this.givens[r][c] && this.grid[r][c] === 0,
      );
      if (!free) break;
      const [r, c] = free;
      this.grid[r][c] = this.solution[r][c];
      this.givens[r][c] = true;
    }

    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.active = null;
    this.won = false;
    return seed;
  }

  checkWin(): void {
    if (this.editing) {
      this.won = false;
      return;
    }
    for (let r = 0; r < SIZE; r++) {
      const seen = new Set<number>();
      for (let c = 0; c < SIZE; c++) {
        const v = this.grid[r][c];
        if (v === 0 || seen.has(v)) {
          this.won = false;
          return;
        }
        seen.add(v);
      }
    }
    for (let c = 0; c < SIZE; c++) {
      const seen = new Set<number>();
      for (let r = 0; r < SIZE; r++) {
        const v = this.grid[r][c];
        if (seen.has(v)) {
          this.won = false;
          return;
        }
        seen.add(v);
      }
    }
    const got = computeClues(this.grid);
    for (const side of ["top", "bottom", "left", "right"] as const) {
      for (let i = 0; i < SIZE; i++) {
        if (this.clues[side][i] !== 0 && this.clues[side][i] !== got[side][i]) {
          this.won = false;
          return;
        }
      }
    }
    this.won = true;
  }
}
