import { parseSeed } from "./prng";
import { SIZE, decodeCustom, encodeCustom } from "./puzzle";
import { TowersGame, type Difficulty } from "./state";
import { buildBoard, render, type BoardRefs, type RenderTargets } from "./view";

type EntryMode = "answer" | "pencil";

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
  const answerModeBtn = el<HTMLButtonElement>("towers-mode-answer");
  const pencilModeBtn = el<HTMLButtonElement>("towers-mode-pencil");
  const eraseBtn = el<HTMLButtonElement>("towers-erase");
  const valueBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-towers-value]"),
  );

  const game = new TowersGame();
  game.autoClues = autoCluesEl.checked;
  game.autoAnswer = autoAnswerEl.checked;

  let refs: BoardRefs;
  let entryMode: EntryMode = "answer";

  function syncEntryControls(): void {
    const hasActiveCell = game.active !== null;
    answerModeBtn.setAttribute("aria-pressed", String(entryMode === "answer"));
    pencilModeBtn.setAttribute("aria-pressed", String(entryMode === "pencil"));
    eraseBtn.disabled = !hasActiveCell;
    for (const btn of valueBtns) btn.disabled = !hasActiveCell;
  }

  const draw = () => {
    render(game, refs, targets);
    syncEntryControls();
  };

  function withActiveCell(fn: (r: number, c: number) => boolean): void {
    if (!game.active) return;
    const { r, c } = game.active;
    if (fn(r, c)) draw();
  }

  function enterValue(n: number, mode = entryMode): void {
    withActiveCell((r, c) =>
      mode === "pencil" ? game.toggleCandidate(r, c, n) : game.setAnswer(r, c, n),
    );
  }

  function eraseActiveCell(): void {
    withActiveCell((r, c) => game.eraseCell(r, c));
  }

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

  answerModeBtn.addEventListener("click", () => {
    entryMode = "answer";
    syncEntryControls();
  });
  pencilModeBtn.addEventListener("click", () => {
    entryMode = "pencil";
    syncEntryControls();
  });
  eraseBtn.addEventListener("click", eraseActiveCell);
  for (const btn of valueBtns) {
    btn.addEventListener("click", () => {
      const n = Number(btn.dataset.towersValue);
      if (n >= 1 && n <= SIZE) enterValue(n);
    });
  }

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

    // Shift + digit: toggle candidate. Use e.code so Shift+1 still reads as
    // "1" instead of "!" across keyboard layouts.
    if (e.shiftKey && e.code && e.code.startsWith("Digit")) {
      const n = Number(e.code.slice(5));
      if (n >= 1 && n <= SIZE) {
        enterValue(n, "pencil");
        e.preventDefault();
        return;
      }
    }

    if (!e.shiftKey && e.key >= "1" && e.key <= String(SIZE)) {
      enterValue(Number(e.key), "answer");
      e.preventDefault();
      return;
    }
    if (e.key === "0" || e.key === "Backspace" || e.key === "Delete") {
      eraseActiveCell();
      e.preventDefault();
      return;
    }

    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    if (moves[e.key] && game.active) {
      const [dr, dc] = moves[e.key];
      const { r, c } = game.active;
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
