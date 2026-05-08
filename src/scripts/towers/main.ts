import { parseSeed } from "./prng";
import { SIZE } from "./puzzle";
import { TowersGame, type Difficulty } from "./state";
import { buildBoard, render, type BoardRefs, type RenderTargets } from "./view";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Towers: missing #${id}`);
  return node as T;
}

export function initTowers(): void {
  const board = document.getElementById("towers-board");
  if (!board) return;

  const targets: RenderTargets = {
    board,
    status: el<HTMLElement>("towers-status"),
    undoBtn: el<HTMLButtonElement>("towers-undo"),
    redoBtn: el<HTMLButtonElement>("towers-redo"),
  };
  const clearBtn = el<HTMLButtonElement>("towers-clear");
  const newgameBtn = el<HTMLButtonElement>("towers-newgame");
  const difficultySel = el<HTMLSelectElement>("towers-difficulty");
  const autoCluesEl = el<HTMLInputElement>("towers-auto-clues");
  const autoAnswerEl = el<HTMLInputElement>("towers-auto-answer");
  const seedInputEl = el<HTMLInputElement>("towers-seed-input");
  const shareBtn = el<HTMLButtonElement>("towers-share");

  const game = new TowersGame();
  game.autoClues = autoCluesEl.checked;
  game.autoAnswer = autoAnswerEl.checked;

  let refs: BoardRefs;
  const draw = () => render(game, refs, targets);

  refs = buildBoard(board, (r, c) => {
    if (game.setActive(r, c)) {
      refs.cellEls[r][c].focus();
      draw();
    }
  });

  function updateURL(): void {
    const params = new URLSearchParams();
    params.set("seed", String(game.currentSeed));
    params.set("d", difficultySel.value);
    history.replaceState(null, "", "?" + params.toString());
  }

  function startNew(seed?: number): void {
    const used = game.newGame(difficultySel.value as Difficulty, seed);
    seedInputEl.value = String(used);
    updateURL();
    draw();
  }

  targets.undoBtn.addEventListener("click", () => {
    if (game.undo()) draw();
  });
  targets.redoBtn.addEventListener("click", () => {
    if (game.redo()) draw();
  });
  clearBtn.addEventListener("click", () => {
    if (game.clearEntries()) draw();
  });
  newgameBtn.addEventListener("click", () => startNew());

  autoCluesEl.addEventListener("change", () => {
    game.autoClues = autoCluesEl.checked;
    draw();
  });
  autoAnswerEl.addEventListener("change", () => {
    game.autoAnswer = autoAnswerEl.checked;
  });

  seedInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const s = parseSeed(seedInputEl.value);
      if (s !== null) startNew(s);
    }
  });

  let shareTimer: number | null = null;
  function flashCopied(): void {
    shareBtn.textContent = "Copied!";
    if (shareTimer !== null) clearTimeout(shareTimer);
    shareTimer = window.setTimeout(() => {
      shareBtn.textContent = "Share";
      shareTimer = null;
    }, 1500);
  }

  shareBtn.addEventListener("click", async () => {
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      flashCopied();
      return;
    } catch {
      // Fall through to legacy fallback.
    }
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      flashCopied();
    } catch {
      /* clipboard unavailable */
    }
    document.body.removeChild(ta);
  });

  document.addEventListener("keydown", (e) => {
    const tag = (e.target as HTMLElement | null)?.tagName ?? "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        if (game.redo()) draw();
      } else {
        if (game.undo()) draw();
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      if (game.redo()) draw();
      return;
    }

    if (!game.active) return;
    const { r, c } = game.active;

    // Shift + digit: toggle candidate. Use e.code so Shift+1 still reads as
    // "1" instead of "!" across keyboard layouts.
    if (e.shiftKey && e.code && e.code.startsWith("Digit")) {
      const n = Number(e.code.slice(5));
      if (n >= 1 && n <= SIZE) {
        if (game.toggleCandidate(r, c, n)) draw();
        e.preventDefault();
        return;
      }
    }

    if (!e.shiftKey && e.key >= "1" && e.key <= String(SIZE)) {
      if (game.setAnswer(r, c, Number(e.key))) draw();
      e.preventDefault();
      return;
    }
    if (e.key === "0" || e.key === "Backspace" || e.key === "Delete") {
      if (game.eraseCell(r, c)) draw();
      e.preventDefault();
      return;
    }

    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    if (moves[e.key]) {
      const [dr, dc] = moves[e.key];
      const nr = Math.max(0, Math.min(SIZE - 1, r + dr));
      const nc = Math.max(0, Math.min(SIZE - 1, c + dc));
      if (game.setActive(nr, nc)) {
        refs.cellEls[nr][nc].focus();
        draw();
      }
      e.preventDefault();
    }
  });

  const params = new URL(location.href).searchParams;
  const d = params.get("d");
  if (d === "easy" || d === "medium" || d === "hard") {
    difficultySel.value = d;
  }
  const seed = parseSeed(params.get("seed"));
  startNew(seed !== null ? seed : undefined);
}
