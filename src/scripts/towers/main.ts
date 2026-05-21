import { parseSeed } from "./prng";
import { SIZE, decodeCustom, encodeCustom } from "./puzzle";
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
  const customBtn = el<HTMLButtonElement>("towers-custom");
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

  refs = buildBoard(
    board,
    (r, c) => {
      if (game.setActive(r, c)) {
        refs.cellEls[r][c].focus();
        draw();
      }
    },
    (side, i, raw) => {
      const digit = raw.replace(/[^1-5]/g, "").slice(-1);
      const v = digit ? Number(digit) : 0;
      if (game.setClue(side, i, v)) draw();
    },
  );

  function updateURL(): void {
    const params = new URLSearchParams();
    params.set("seed", String(game.currentSeed));
    params.set("d", difficultySel.value);
    history.replaceState(null, "", "?" + params.toString());
  }

  function clearURL(): void {
    history.replaceState(null, "", location.pathname);
  }

  function updateCustomURL(): void {
    const encoded = encodeCustom(game.clues, game.grid);
    history.replaceState(null, "", "?c=" + encoded);
  }

  function syncCustomButton(): void {
    if (game.editing) {
      customBtn.textContent = "Start Solving";
      customBtn.title = "Lock in clues and start solving";
    } else if (game.puzzleIsCustom) {
      customBtn.textContent = "Edit";
      customBtn.title = "Edit this custom puzzle";
    } else {
      customBtn.textContent = "Custom";
      customBtn.title = "Enter a puzzle from another source";
    }
  }

  function startNew(seed?: number): void {
    const used = game.newGame(difficultySel.value as Difficulty, seed);
    seedInputEl.value = String(used);
    updateURL();
    syncCustomButton();
    draw();
  }

  function enterCustomFresh(): void {
    game.startCustom();
    seedInputEl.value = "";
    clearURL();
    syncCustomButton();
    draw();
    refs.clueInputEls.top[0]?.focus();
  }

  function enterCustomEdit(): void {
    game.editCustom();
    seedInputEl.value = "";
    clearURL();
    syncCustomButton();
    draw();
    refs.clueInputEls.top[0]?.focus();
  }

  function finishCustom(): void {
    const solutions = game.finalizeCustom();
    updateCustomURL();
    syncCustomButton();
    draw();
    if (solutions === 0) {
      targets.status.textContent =
        "No solutions match these clues — double-check your entries.";
    } else if (solutions > 1) {
      targets.status.textContent =
        "Multiple solutions match — a clue or given may be missing.";
    }
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
  customBtn.addEventListener("click", () => {
    if (game.editing) finishCustom();
    else if (game.puzzleIsCustom) enterCustomEdit();
    else enterCustomFresh();
  });

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
  const customParam = params.get("c");
  if (customParam) {
    const parsed = decodeCustom(customParam);
    if (parsed) {
      game.loadCustom(parsed.clues, parsed.grid);
      seedInputEl.value = "";
      syncCustomButton();
      draw();
      return;
    }
  }
  const d = params.get("d");
  if (d === "easy" || d === "medium" || d === "hard") {
    difficultySel.value = d;
  }
  const seed = parseSeed(params.get("seed"));
  startNew(seed !== null ? seed : undefined);
}
