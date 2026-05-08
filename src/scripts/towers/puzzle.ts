import { shuffle } from "./prng";

export const SIZE = 5;

export type Side = "top" | "bottom" | "left" | "right";
export type Clues = Record<Side, number[]>;

export function makeGrid(): number[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

export function makeCandidates(): Set<number>[][] {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => new Set<number>()),
  );
}

export function visibleCount(arr: number[]): number {
  let max = 0;
  let count = 0;
  for (const v of arr) {
    if (v > max) {
      max = v;
      count++;
    }
  }
  return count;
}

export function generateLatinSquare(rng: () => number): number[][] {
  const sol = makeGrid();
  const rowUsed = Array.from({ length: SIZE }, () => new Set<number>());
  const colUsed = Array.from({ length: SIZE }, () => new Set<number>());

  function backtrack(r: number, c: number): boolean {
    if (r === SIZE) return true;
    const nr = c === SIZE - 1 ? r + 1 : r;
    const nc = c === SIZE - 1 ? 0 : c + 1;
    const cands = shuffle([1, 2, 3, 4, 5], rng);
    for (const v of cands) {
      if (rowUsed[r].has(v) || colUsed[c].has(v)) continue;
      sol[r][c] = v;
      rowUsed[r].add(v);
      colUsed[c].add(v);
      if (backtrack(nr, nc)) return true;
      rowUsed[r].delete(v);
      colUsed[c].delete(v);
      sol[r][c] = 0;
    }
    return false;
  }

  backtrack(0, 0);
  return sol;
}

export function computeClues(sol: number[][]): Clues {
  const top: number[] = [];
  const bottom: number[] = [];
  const left: number[] = [];
  const right: number[] = [];
  for (let c = 0; c < SIZE; c++) {
    const col = sol.map((row) => row[c]);
    top.push(visibleCount(col));
    bottom.push(visibleCount(col.slice().reverse()));
  }
  for (let r = 0; r < SIZE; r++) {
    left.push(visibleCount(sol[r]));
    right.push(visibleCount(sol[r].slice().reverse()));
  }
  return { top, bottom, left, right };
}

// Backtracking solver. Returns the number of valid completions of the partial
// grid that satisfy the visible clues, capped at `limit`.
export function countSolutions(
  startGrid: number[][],
  clueState: Clues,
  limit: number,
): number {
  const g = startGrid.map((row) => row.slice());
  const rowUsed = Array.from({ length: SIZE }, () => new Set<number>());
  const colUsed = Array.from({ length: SIZE }, () => new Set<number>());
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = g[r][c];
      if (v !== 0) {
        rowUsed[r].add(v);
        colUsed[c].add(v);
      }
    }
  }

  let count = 0;

  function rowOk(r: number): boolean {
    if (clueState.left[r] && clueState.left[r] !== visibleCount(g[r])) {
      return false;
    }
    if (
      clueState.right[r] &&
      clueState.right[r] !== visibleCount(g[r].slice().reverse())
    ) {
      return false;
    }
    return true;
  }

  function colOk(c: number): boolean {
    const col = g.map((row) => row[c]);
    if (clueState.top[c] && clueState.top[c] !== visibleCount(col)) {
      return false;
    }
    if (
      clueState.bottom[c] &&
      clueState.bottom[c] !== visibleCount(col.slice().reverse())
    ) {
      return false;
    }
    return true;
  }

  function step(idx: number): void {
    if (count >= limit) return;
    if (idx === SIZE * SIZE) {
      count++;
      return;
    }
    const r = Math.floor(idx / SIZE);
    const c = idx % SIZE;

    if (g[r][c] !== 0) {
      if (c === SIZE - 1 && !rowOk(r)) return;
      if (r === SIZE - 1 && !colOk(c)) return;
      step(idx + 1);
      return;
    }
    for (let v = 1; v <= SIZE; v++) {
      if (count >= limit) return;
      if (rowUsed[r].has(v) || colUsed[c].has(v)) continue;
      g[r][c] = v;
      rowUsed[r].add(v);
      colUsed[c].add(v);
      let abort = false;
      if (c === SIZE - 1 && !rowOk(r)) abort = true;
      if (!abort && r === SIZE - 1 && !colOk(c)) abort = true;
      if (!abort) step(idx + 1);
      rowUsed[r].delete(v);
      colUsed[c].delete(v);
      g[r][c] = 0;
    }
  }

  step(0);
  return count;
}
