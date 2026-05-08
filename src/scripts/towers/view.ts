import { SIZE, type Side } from "./puzzle";
import type { TowersGame } from "./state";

export interface BoardRefs {
  cellEls: HTMLElement[][];
  answerEls: HTMLElement[][];
  candEls: HTMLElement[][][];
  clueEls: Record<Side, HTMLElement[]>;
}

export interface RenderTargets {
  board: HTMLElement;
  status: HTMLElement;
  undoBtn: HTMLButtonElement;
  redoBtn: HTMLButtonElement;
}

function makeClueEl(): HTMLElement {
  const el = document.createElement("div");
  el.className = "towers-clue";
  return el;
}

function makeCornerEl(): HTMLElement {
  const el = document.createElement("div");
  el.className = "towers-corner";
  return el;
}

export function buildBoard(
  board: HTMLElement,
  onCellClick: (r: number, c: number) => void,
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

  board.appendChild(makeCornerEl());
  for (let c = 0; c < SIZE; c++) {
    const el = makeClueEl();
    clueEls.top.push(el);
    board.appendChild(el);
  }
  board.appendChild(makeCornerEl());

  for (let r = 0; r < SIZE; r++) {
    const left = makeClueEl();
    clueEls.left.push(left);
    board.appendChild(left);

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

    const right = makeClueEl();
    clueEls.right.push(right);
    board.appendChild(right);
  }

  board.appendChild(makeCornerEl());
  for (let c = 0; c < SIZE; c++) {
    const el = makeClueEl();
    clueEls.bottom.push(el);
    board.appendChild(el);
  }
  board.appendChild(makeCornerEl());

  return { cellEls, answerEls, candEls, clueEls };
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
      const el = refs.clueEls[side][i];
      el.textContent = String(game.clues[side][i] || "");
      el.classList.toggle("satisfied", game.isClueSatisfied(side, i));
    }
  }
  targets.board.classList.toggle("won", game.won);
  targets.status.classList.toggle("won", game.won);
  targets.status.textContent = game.won ? "Solved!" : "";
  targets.undoBtn.disabled = game.undoStack.length === 0;
  targets.redoBtn.disabled = game.redoStack.length === 0;
}
