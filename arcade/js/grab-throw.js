/* Smart MUET Arcade · Grab & Throw (PEEL / PREP sort, and Reading Trap sort).
   Paragraph builder: grab each sentence and throw it into the right bucket: Point, Explain, Example, Link
   (or PREP: Point, Reason, Example, Point again).
   Trap sort (Reading SCAN): each round is one SCAN Evidence Hunt question; throw every wrong option into
   the Word-Match, Own-Knowledge or Too-Far bucket. Content: SMHBank.reading.hunt.
   Play by: drag-and-throw, tap card then tap bucket, keyboard (Enter), or camera (pinch to grab). */
(() => {
  "use strict";
  const A = window.SMHArcade,
    Bank = window.SMHBank,
    { el } = A;
  const $ = (s) => document.querySelector(s);
  const stage = $("#stage"),
    status = $("#cam-status"),
    H = A.hud($("#hud"));
  A.motionButton($("#motion"));
  A.soundButton($("#sound"));

  const ROUND_TIME = 60,
    LETTER_COL = { PEEL: ["#5625dc", "#ffda16", "#00a88f", "#c90c9f"], PREP: ["#ffda16", "#ff792f", "#00a88f", "#5625dc"] },
    WHAT = {
      PEEL: ["Point: the one main idea.", "Explain: why the point is true.", "Example: a specific case.", "Link: back to the question."],
      PREP: ["Point: your answer.", "Reason: why you think so.", "Example: a real case.", "Point again: close the answer."],
    };

  const MODE_KEY = "smh.arcade.gt.mode",
    TRAP_IDS = ["word", "own", "far"],
    TRAP_COL = ["#ff754a", "#3b5bff", "#e0a800"],
    TRAP_LETTER = ["W", "O", "F"];
  let mode = (() => { try { return localStorage.getItem(MODE_KEY) === "trap" ? "trap" : "build"; } catch { return "build"; } })();
  const TR = () => (Bank.reading && Bank.reading.huntTraps) || {};
  const trapText = (s) => { const x = s.replace(/^[^:]+:\s*/, ""); return x.charAt(0).toUpperCase() + x.slice(1); };
  /* one round per Evidence Hunt question: cards = its wrong options, ans = trap bucket index */
  function trapRounds(hard) {
    const out = [];
    Object.entries((Bank.reading && Bank.reading.hunt) || {}).forEach(([pid, p]) => {
      if (hard && p.stage === "start") return;
      const flat = p.paras.flat();
      p.questions.forEach((q, qi) => {
        const wrong = q.options.map((o, i) => i).filter((i) => i !== q.answer);
        out.push({
          kind: "trap", skill: "reading", tech: "TRAPS", id: "hunt-" + pid + "-q" + (qi + 1),
          topic: q.q, evidence: flat[q.ev[0]], right: q.options[q.answer], passage: p.title,
          parts: TRAP_IDS.map((k) => (TR()[k] || [k])[0]),
          lines: wrong.map((i) => q.options[i]),
          ans: wrong.map((i) => TRAP_IDS.indexOf(q.tags[i])),
          why: wrong.map((i) => trapText(q.traps[i])),
        });
      });
    });
    return out;
  }
  const slotOf = (r, line) => (r.ans ? r.ans[line] : line);

  let rounds = [],
    ri = 0,
    hearts = 3,
    score = 0,
    correct = 0,
    total = 0,
    missed = [],
    firstTry = {},
    timeLeft = ROUND_TIME,
    timer = 0,
    playing = false,
    held = null,
    selected = null,
    press = null,
    track = [],
    T = A.tier(),
    combo = A.combo();

  /* ---------- Stage skeleton ---------- */
  const banner = el("div", "gt-banner"),
    buckets = el("div", "gt-buckets"),
    tray = el("div", "gt-tray"),
    overlay = el("div", "stage-overlay");
  const hint = el("p", "gt-hint", "Grab a sentence below and throw it into its bucket ↑");
  stage.append(banner, buckets, hint, tray, overlay);

  const input = A.input(stage, {
    mode: "pinch",
    onDown,
    onMove,
    onUp,
  });
  A.camera({
    button: $("#camera"),
    stage,
    inputCtl: input,
    status,
    howTo: "Pinch your thumb and first finger to grab a sentence, move your hand, then open your fingers to throw it.",
  });

  function showOverlay(nodes) {
    overlay.replaceChildren(...nodes);
    overlay.hidden = false;
    const b = overlay.querySelector("button.primary") || overlay.querySelector("button");
    b && b.focus({ preventScroll: true });
  }
  function startScreen() {
    const go = el("button", "primary big", "Start game ▸");
    go.type = "button";
    go.dataset.handPress = "";
    go.onclick = start;
    const info = el("span", "eyebrow light"),
      h2 = el("h2", ""),
      tip = el("p", ""),
      modes = el("div", "tier-row gt-modes"),
      paint = () => {
        const t = A.tier();
        info.textContent = "5 ROUNDS · 3 LIVES · " + Math.round(ROUND_TIME * t.time) + " SECONDS A ROUND";
        h2.textContent = mode === "trap" ? "Name the trap." : "Build the paragraph.";
        tip.textContent = mode === "trap"
          ? "Reading SCAN: read the question, the evidence and the right answer, then throw each wrong option into its trap: Word-Match, Own-Knowledge or Too-Far." + (t.hard ? " MUET-level passages only." : "")
          : t.hard
            ? "Harder paragraphs with no easy signal words, plus one off-topic sentence in every round: throw it in the bin. Clean throws build a combo."
            : "Throw each sentence into the right bucket. First-try answers score 10, quick rounds earn a time bonus.";
      };
    modes.setAttribute("role", "group");
    modes.setAttribute("aria-label", "Game");
    [["build", "Paragraph builder · PEEL / PREP"], ["trap", "Trap sort · Reading SCAN"]].forEach(([m, label]) => {
      const b = el("button", "tier", label);
      b.type = "button";
      b.dataset.handPress = "";
      b.setAttribute("aria-pressed", String(mode === m));
      b.onclick = () => {
        mode = m;
        try { localStorage.setItem(MODE_KEY, m); } catch {}
        modes.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        paint();
      };
      modes.append(b);
    });
    paint();
    showOverlay([info, modes, h2, tip, A.tierPicker(paint), go]);
  }

  function start() {
    T = A.tier();
    combo = A.combo();
    rounds = (mode === "trap" ? A.shuffle(trapRounds(T.hard)) : T.hard ? A.shuffle(Bank.arcade.sortHard) : A.shuffle(Bank.arcade.sort)).slice(0, 5);
    ri = 0;
    hearts = 3;
    score = 0;
    correct = 0;
    total = 0;
    missed = [];
    playing = true;
    H.set({ hearts, score });
    overlay.hidden = true;
    loadRound();
  }

  function loadRound() {
    const r = rounds[ri];
    firstTry = {};
    selected = null;
    const trap = r.kind === "trap";
    if (trap) {
      const ev = el("p", "gt-ev"), ok = el("p", "gt-ok");
      ev.append(el("b", "", "Text: "), "“" + r.evidence + "”");
      ok.append(el("b", "", "Right answer: "), r.right);
      banner.replaceChildren(el("span", "gt-tech", "READING · SCAN TRAPS"), el("b", "", r.topic), ev, ok);
    } else
      banner.replaceChildren(
        el("span", "gt-tech", r.tech + (r.skill === "writing" ? " · WRITING" : " · SPEAKING")),
        el("b", "", r.topic),
      );
    banner.classList.toggle("is-trap", trap);
    hint.textContent = trap ? "Grab a wrong option below and throw it into its trap ↑" : "Grab a sentence below and throw it into its bucket ↑";
    const slots = trap ? r.parts : T.hard ? r.parts.concat(["Off-topic"]) : r.parts;
    buckets.classList.toggle("has-bin", !trap && T.hard);
    buckets.classList.toggle("is-trap", trap);
    buckets.replaceChildren(
      ...slots.map((p, i) => {
        const b = el("button", "bucket");
        b.type = "button";
        b.dataset.slot = i;
        b.dataset.handPress = "";
        const bin = !trap && i === 4;
        if (bin) b.classList.add("bin");
        if (trap) {
          const d = TR()[TRAP_IDS[i]] || [p, ""];
          b.style.setProperty("--c", TRAP_COL[i]);
          b.append(el("span", "b-letter", TRAP_LETTER[i]), el("span", "b-name", p), el("span", "b-fill"));
          b.setAttribute("aria-label", p + " bucket. " + d[1]);
          b.title = d[1];
        } else {
          b.style.setProperty("--c", bin ? "#3a3550" : LETTER_COL[r.tech][i]);
          b.append(el("span", "b-letter", bin ? "✕" : p === "Point again" ? "P" : p[0]), el("span", "b-name", bin ? "Off-topic bin" : p), el("span", "b-fill"));
          b.setAttribute("aria-label", (bin ? "Off-topic bin. For a sentence that does not support this answer." : p + " bucket. " + WHAT[r.tech][i]));
        }
        b.onclick = () => {
          if (selected) drop(selected, i);
        };
        return b;
      }),
    );
    tray.replaceChildren(
      ...A.shuffle((trap || T.hard ? r.lines : r.lines.slice(0, 4)).map((t, i) => [t, i])).map(([t, i]) => {
        const c = el("button", "s-card", t);
        c.type = "button";
        c.dataset.line = i;
        c.dataset.gameTarget = "";
        c.setAttribute("aria-pressed", "false");
        c.onclick = (e) => {
          if (e.detail === 0) select(c); // keyboard
        };
        return c;
      }),
    );
    timeLeft = Math.round(ROUND_TIME * T.time);
    H.set({ round: "Round " + (ri + 1) + "/" + rounds.length, time: timeLeft });
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }
  function tick() {
    if (!playing || !overlay.hidden) return;
    timeLeft--;
    H.set({ time: Math.max(0, timeLeft) });
    if (timeLeft <= 0) {
      clearInterval(timer);
      hearts--;
      H.set({ hearts });
      A.sfx.bad();
      tray.querySelectorAll(".s-card").forEach((c) => noteMiss(+c.dataset.line));
      roundDone(true);
    }
  }

  function select(c) {
    if (!playing) return;
    if (selected === c) {
      selected = null;
      c.setAttribute("aria-pressed", "false");
      return;
    }
    tray.querySelectorAll(".s-card").forEach((x) => x.setAttribute("aria-pressed", "false"));
    selected = c;
    c.setAttribute("aria-pressed", "true");
    A.sfx.grab();
    status.textContent = "Selected. Now choose a bucket.";
  }

  /* ---------- Drag, throw, drop ---------- */
  const hit = (x, y, sel) => {
    const r = stage.getBoundingClientRect();
    return [...stage.querySelectorAll(sel)].find((n) => {
      const b = n.getBoundingClientRect();
      return x >= b.left - r.left && x <= b.right - r.left && y >= b.top - r.top && y <= b.bottom - r.top;
    });
  };
  function onDown(x, y, src) {
    if (!playing || !overlay.hidden) {
      if (src === "hand") handPress(x, y);
      return;
    }
    const card = hit(x, y, ".s-card:not(.placed)");
    if (card) {
      press = { card, x, y, src, moved: false };
      if (src === "hand") grab(card, x, y);
      return;
    }
    if (src === "hand") handPress(x, y);
  }
  const handPress = (x, y) => A.handPress(stage, x, y);
  function grab(card, x, y) {
    const r = stage.getBoundingClientRect(),
      b = card.getBoundingClientRect();
    const ph = el("div", "s-card ghost");
    ph.style.height = b.height + "px";
    card.after(ph);
    held = { card, ph, dx: x - (b.left - r.left), dy: y - (b.top - r.top), w: b.width };
    card.classList.add("held");
    card.style.width = b.width + "px";
    stage.append(card);
    place(x, y);
    track = [[x, y, performance.now()]];
    A.sfx.grab();
  }
  function place(x, y) {
    held.card.style.left = x - held.dx + "px";
    held.card.style.top = y - held.dy + "px";
  }
  function onMove(x, y) {
    if (press && !held && Math.hypot(x - press.x, y - press.y) > 8) {
      press.moved = true;
      grab(press.card, press.x, press.y);
    }
    if (!held) return;
    place(x, y);
    track.push([x, y, performance.now()]);
    if (track.length > 6) track.shift();
    buckets.querySelectorAll(".bucket").forEach((b) => b.classList.remove("hover"));
    const over = hit(x, y, ".bucket");
    over && over.classList.add("hover");
  }
  function onUp(x, y, src) {
    const p = press;
    press = null;
    buckets.querySelectorAll(".bucket").forEach((b) => b.classList.remove("hover"));
    if (!held) {
      if (p && !p.moved && src === "pointer") select(p.card);
      return;
    }
    const h = held;
    held = null;
    let target = x >= 0 ? hit(x, y, ".bucket") : null;
    // Throw: project the release velocity a short way forward
    if (!target && track.length > 1) {
      // aim assist: pick the open bucket closest to the flick direction (within 22°)
      const [x0, y0, t0] = track[0],
        [x1, y1, t1] = track[track.length - 1],
        dt = Math.max(16, t1 - t0),
        speed = Math.hypot(x1 - x0, y1 - y0) / dt,
        dir = Math.atan2(y1 - y0, x1 - x0),
        sr = stage.getBoundingClientRect();
      if (speed > 0.35) {
        let best = 22;
        buckets.querySelectorAll(".bucket:not(:disabled)").forEach((b) => {
          const q = b.getBoundingClientRect(),
            bx = q.left - sr.left + q.width / 2,
            by = q.top - sr.top + q.height / 2;
          let diff = Math.abs(((Math.atan2(by - y1, bx - x1) - dir) * 180) / Math.PI) % 360;
          if (diff > 180) diff = 360 - diff;
          if (diff < best) {
            best = diff;
            target = b;
          }
        });
      }
      if (target) A.sfx.whoosh();
    }
    if (target) {
      const r = stage.getBoundingClientRect(),
        b = target.getBoundingClientRect();
      h.card.classList.add("flying");
      h.card.style.left = b.left - r.left + b.width / 2 - h.w / 2 + "px";
      h.card.style.top = b.top - r.top + 10 + "px";
      setTimeout(() => {
        restore(h);
        drop(h.card, +target.dataset.slot);
      }, A.reduced() ? 0 : 260);
    } else restore(h);
  }
  function restore(h) {
    h.card.classList.remove("held", "flying");
    h.card.style.left = h.card.style.top = h.card.style.width = "";
    h.ph.replaceWith(h.card);
  }

  function noteMiss(line) {
    if (firstTry[line] === undefined) firstTry[line] = false;
  }
  function drop(card, slot) {
    if (!playing) return;
    const r = rounds[ri],
      line = +card.dataset.line,
      bucket = buckets.querySelector('[data-slot="' + slot + '"]'),
      br = bucket.getBoundingClientRect(),
      sr = stage.getBoundingClientRect(),
      px = br.left - sr.left + br.width / 2,
      py = br.top - sr.top + br.height + 10;
    selected = null;
    card.setAttribute("aria-pressed", "false");
    const trap = r.kind === "trap";
    if (slotOf(r, line) === slot) {
      const first = firstTry[line] === undefined;
      firstTry[line] = firstTry[line] ?? true;
      const mult = first ? combo.hit() : 1,
        pts = (first ? 10 : 5) * mult,
        name = !trap && slot === 4 ? "Off-topic" : r.parts[slot];
      if (!first) combo.miss();
      score += pts;
      H.set({ score });
      A.sfx.good();
      A.pop(stage, px, py, "+" + pts + " · " + name + (mult > 1 ? " · combo ×" + mult : ""), "good");
      card.classList.add("placed");
      card.disabled = true;
      if (trap) {
        const f = bucket.querySelector(".b-fill");
        f.textContent = (f.textContent || "") + "✓";
        status.textContent = "Correct, a " + r.parts[slot] + ". " + r.why[line] + ".";
      } else {
        bucket.classList.add("done");
        bucket.querySelector(".b-fill").textContent = "✓";
        bucket.disabled = true;
        status.textContent = slot === 4 ? "Correct: that sentence does not support the answer." : "Correct: " + WHAT[r.tech][slot];
      }
      if (!tray.querySelector(".s-card:not(.placed)")) roundDone(false);
    } else {
      noteMiss(line);
      combo.miss();
      hearts--;
      H.set({ hearts });
      A.sfx.bad();
      bucket.classList.remove("shake");
      void bucket.offsetWidth;
      bucket.classList.add("shake");
      if (trap) {
        const d = TR()[TRAP_IDS[slot]] || [r.parts[slot], ""];
        A.pop(stage, px, py, "Not a " + d[0], "bad");
        status.textContent = "Not a " + d[0] + ". That trap " + d[1].charAt(0).toLowerCase() + d[1].slice(1) + " Compare the option with the text, then try another bucket.";
      } else {
        const wrong = slot === 4 ? "bin" : r.parts[slot];
        A.pop(stage, px, py, slot === 4 ? "It belongs in the paragraph" : "Not the " + wrong, "bad");
        status.textContent = slot === 4 ? "That sentence supports the answer, so it is not off-topic. Try a bucket." : "Not the " + wrong + ". Remember: " + WHAT[r.tech][slot] + " Try another bucket.";
      }
      if (hearts <= 0) roundDone(true);
    }
  }

  function roundDone(failed) {
    clearInterval(timer);
    const r = rounds[ri], trap = r.kind === "trap";
    const used = trap || T.hard ? r.lines : r.lines.slice(0, 4);
    used.forEach((t, i) => {
      total++;
      if (firstTry[i] === true) correct++;
      else if (trap) {
        missed.push("“" + t.slice(0, 60) + (t.length > 60 ? "…" : "") + "” → " + r.parts[r.ans[i]]);
        A.miss("reading:" + r.id, "reading", "Trap sort: " + r.topic.slice(0, 50), "Arcade · Grab & Throw");
      } else {
        const part = i === 4 ? "Off-topic" : r.parts[i];
        missed.push("“" + t.slice(0, 60) + (t.length > 60 ? "…" : "") + "” → " + part);
        A.miss(r.skill + ":arcade-" + r.id + "-" + (i + 1), r.skill, r.tech + " sort: " + part, "Arcade · Grab & Throw");
      }
    });
    if (!failed) {
      const bonus = Math.floor(timeLeft / 3);
      score += bonus;
      H.set({ score });
      bonus && A.pop(stage, stage.clientWidth / 2, 70, "Time bonus +" + bonus, "good");
    }
    const ol = el("ol", "built");
    if (trap)
      r.lines.forEach((t, i) => {
        const li = el("li");
        li.append(el("b", "", "“" + t + "” · " + r.parts[r.ans[i]] + ". "), document.createTextNode(r.why[i] + "."));
        ol.append(li);
      });
    else
      r.lines.slice(0, 4).forEach((t, i) => {
        const li = el("li");
        li.append(el("b", "", r.parts[i] + ": "), document.createTextNode(t));
        ol.append(li);
      });
    const last = hearts <= 0 || ri === rounds.length - 1,
      next = el("button", "primary big", last ? "See my results ▸" : "Next round ▸");
    next.type = "button";
    next.dataset.handPress = "";
    next.onclick = () => {
      if (last) finish();
      else {
        ri++;
        overlay.hidden = true;
        loadRound();
      }
    };
    showOverlay([
      el("span", "eyebrow light", hearts <= 0 ? "OUT OF LIVES" : failed ? "TIME UP" : trap ? "TRAPS NAMED" : "PARAGRAPH BUILT"),
      el("h2", "", trap ? "Why each option is wrong." : r.tech === "PEEL" ? "Read your PEEL paragraph." : "Read your PREP answer aloud."),
      ol,
      next,
    ]);
  }
  function finish() {
    playing = false;
    // rounds not reached count as not attempted (not as misses)
    A.results({
      game: "grab-throw",
      title: "Grab & Throw · " + (mode === "trap" ? "Trap sort · " : "") + T.name,
      score,
      correct,
      total,
      missed,
      again: () => start(),
      other: ["Play Air Slice", "air-slice.html"],
    });
    startScreen();
  }

  startScreen();
  H.set({ hearts, score, round: "Ready", time: Math.round(ROUND_TIME * A.tier().time) });
})();
