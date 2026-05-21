import { SIZE, type Side } from "./puzzle";
import type { TowersGame } from "./state";

export interface BoardRefs {
  cellEls: HTMLElement[][];
  answerEls: HTMLElement[][];
  candEls: HTMLElement[][][];
  clueEls: Record<Side, HTMLElement[]>;
  clueDisplayEls: Record<Side, HTMLElement[]>;
  clueInputEls: Record<Side, HTMLInputElement[]>;
}

export interface RenderTargets {
  board: HTMLElement;
  status: HTMLElement;
  undoBtn: HTMLButtonElement;
  redoBtn: HTMLButtonElement;
}

function makeClueEl(): {
  wrap: HTMLElement;
  display: HTMLElement;
  input: HTMLInputElement;
} {
  const wrap = document.createElement("div");
  wrap.className = "towers-clue";
  const display = document.createElement("span");
  display.className = "towers-clue-display";
  wrap.appendChild(display);
  const input = document.createElement("input");
  input.className = "towers-clue-input";
  input.type = "text";
  input.maxLength = 1;
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.spellcheck = false;
  wrap.appendChild(input);
  return { wrap, display, input };
}

function makeCornerEl(): HTMLElement {
  const el = document.createElement("div");
  el.className = "towers-corner";
  return el;
}

export function buildBoard(
  board: HTMLElement,
  onCellClick: (r: number, c: number) => void,
  onClueInput: (side: Side, i: number, raw: string) => void,
): BoardRefs {
  const cellEls: HTMLElement[][] = [];
  const answerEls: HTMLElement[][] = [];
  const candEls: HTMLElement[][][] = [];
  const clueEls: Record<Side, HTMLElement[]> = {
    top: [],
    bottom: [],
    left: [],
    right: [],
  };
  const clueDisplayEls: Record<Side, HTMLElement[]> = {
    top: [],
    bottom: [],
    left: [],
    right: [],
  };
  const clueInputEls: Record<Side, HTMLInputElement[]> = {
    top: [],
    bottom: [],
    left: [],
    right: [],
  };

  function addClue(side: Side, i: number): HTMLElement {
    const { wrap, display, input } = makeClueEl();
    clueEls[side].push(wrap);
    clueDisplayEls[side].push(display);
    clueInputEls[side].push(input);
    input.addEventListener("input", () => onClueInput(side, i, input.value));
    return wrap;
  }

  board.appendChild(makeCornerEl());
  for (let c = 0; c < SIZE; c++) {
    board.appendChild(addClue("top", c));
  }
  board.appendChild(makeCornerEl());

  for (let r = 0; r < SIZE; r++) {
    board.appendChild(addClue("left", r));

    cellEls.push([]);
    answerEls.push([]);
    candEls.push([]);
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "towers-cell";
      cell.tabIndex = 0;
      cell.setAttribute("role", "gridcell");
      cell.addEventListener("click", () => onCellClick(r, c));

      const answer = document.createElement("div");
      answer.className = "towers-answer";
      cell.appendChild(answer);

      const cands = document.createElement("div");
      cands.className = "towers-candidates";
      const spans: HTMLElement[] = [];
      for (let v = 1; v <= SIZE; v++) {
        const s = document.createElement("span");
        s.className = "towers-cand";
        s.textContent = String(v);
        cands.appendChild(s);
        spans.push(s);
      }
      cell.appendChild(cands);

      board.appendChild(cell);
      cellEls[r].push(cell);
      answerEls[r].push(answer);
      candEls[r].push(spans);
    }

    board.appendChild(addClue("right", r));
  }

  board.appendChild(makeCornerEl());
  for (let c = 0; c < SIZE; c++) {
    board.appendChild(addClue("bottom", c));
  }
  board.appendChild(makeCornerEl());

  return { cellEls, answerEls, candEls, clueEls, clueDisplayEls, clueInputEls };
}

export function render(
  game: TowersGame,
  refs: BoardRefs,
  targets: RenderTargets,
): void {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = refs.cellEls[r][c];
      const v = game.grid[r][c];
      cell.classList.toggle("has-answer", v !== 0);
      cell.classList.toggle("given", game.givens[r][c]);
      const isActive =
        !!game.active && game.active.r === r && game.active.c === c;
      cell.classList.toggle("active", isActive);

      refs.answerEls[r][c].textContent = v === 0 ? "" : String(v);

      const cands = game.displayCandidates(r, c);
      for (let i = 0; i < SIZE; i++) {
        refs.candEls[r][c][i].classList.toggle("on", cands.has(i + 1));
      }
    }
  }
  for (let i = 0; i < SIZE; i++) {
    for (const side of ["top", "bottom", "left", "right"] as const) {
      const wrap = refs.clueEls[side][i];
      const display = refs.clueDisplayEls[side][i];
      const input = refs.clueInputEls[side][i];
      const v = game.clues[side][i];
      const text = v ? String(v) : "";
      display.textContent = text;
      // Avoid clobbering the user's mid-edit cursor by only updating the input
      // value when it actually differs.
      if (input.value !== text) input.value = text;
      wrap.classList.toggle("satisfied", !game.editing && game.isClueSatisfied(side, i));
      wrap.classList.toggle("empty", !v);
    }
  }
  targets.board.classList.toggle("won", game.won);
  targets.board.classList.toggle("editing", game.editing);
  targets.status.classList.toggle("won", game.won);
  if (game.editing) {
    targets.status.textContent = "Enter clues and any starting numbers from your puzzle.";
  } else {
    targets.status.textContent = game.won ? "Solved!" : "";
  }
  targets.undoBtn.disabled = game.undoStack.length === 0;
  targets.redoBtn.disabled = game.redoStack.length === 0;
}
