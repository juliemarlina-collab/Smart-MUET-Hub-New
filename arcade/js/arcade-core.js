/* Smart MUET · Arcade core (SMHArcade).
   Shared by every Arcade game: one input layer (tap/mouse/keyboard OR hand tracking),
   camera consent + preview, HUD, sounds, results screen, saving rounds and sending
   missed items to Review again.
   Storage: smh.arcade.v1 { rounds: [{ game, date, score, correct, total, ts }], best: { game: score } }
   XP is derived in shared/js/app.js: 10 XP per finished round, up to 3 rounds a day. */
(() => {
  "use strict";
  if (window.SMHArcade) return;
  const KEY = "smh.arcade.v1",
    REVIEW = "smh.review.queue.v1",
    DAY = 86400000,
    DAILY_XP_ROUNDS = 3,
    XP_PER_ROUND = 10;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const getJSON = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  };
  const setJSON = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  };
  const dayKey = (d = new Date()) =>
    d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const shuffle = (a) => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };

  /* ---------- Motion ---------- */
  const reduced = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("no-motion") ||
    getJSON("smh.rebuild.motionPaused", false) === true;
  function motionButton(btn) {
    if (!btn) return;
    const ui = () => {
      const off = getJSON("smh.rebuild.motionPaused", false) === true;
      document.documentElement.classList.toggle("no-motion", off);
      btn.setAttribute("aria-pressed", String(off));
      btn.textContent = off ? "Play motion" : "Pause motion";
    };
    btn.onclick = () => {
      setJSON("smh.rebuild.motionPaused", !(getJSON("smh.rebuild.motionPaused", false) === true));
      ui();
      document.dispatchEvent(new CustomEvent("smh:motion"));
    };
    ui();
  }

  /* ---------- Sound (tiny WebAudio blips, no files) ---------- */
  let actx = null;
  const soundOn = () => getJSON("smh.arcade.sound", true) !== false;
  function tone(freq, dur = 0.12, type = "sine", vol = 0.08, slide = 0) {
    if (!soundOn()) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(),
        g = actx.createGain(),
        t = actx.currentTime;
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch {}
  }
  const sfx = {
    good: () => {
      tone(660, 0.09, "triangle");
      setTimeout(() => tone(990, 0.12, "triangle"), 80);
    },
    bad: () => tone(220, 0.22, "sawtooth", 0.05, -90),
    slice: () => tone(1400, 0.08, "square", 0.03, -900),
    grab: () => tone(520, 0.06, "sine", 0.06),
    whoosh: () => tone(300, 0.18, "sine", 0.05, 500),
    punch: () => {
      tone(140, 0.16, "square", 0.09, -80);
      setTimeout(() => tone(90, 0.12, "sine", 0.1), 40);
    },
    roar: () => tone(180, 0.45, "sawtooth", 0.06, -120),
    win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.16, "triangle"), i * 110)),
  };
  function soundButton(btn) {
    if (!btn) return;
    const ui = () => {
      btn.setAttribute("aria-pressed", String(!soundOn()));
      btn.textContent = soundOn() ? "Sound on" : "Sound off";
    };
    btn.onclick = () => {
      setJSON("smh.arcade.sound", !soundOn());
      ui();
    };
    ui();
  }

  /* ---------- Records ---------- */
  function load() {
    const v = getJSON(KEY, {});
    return {
      rounds: Array.isArray(v && v.rounds) ? v.rounds : [],
      best: v && v.best && typeof v.best === "object" ? v.best : {},
    };
  }
  function roundsToday() {
    return load().rounds.filter((r) => r.date === dayKey()).length;
  }
  function record(game, score, correct, total) {
    const v = load(),
      today = v.rounds.filter((r) => r.date === dayKey()).length,
      best = !(v.best[game] >= score);
    v.rounds.push({ game, date: dayKey(), score, correct, total, ts: Date.now() });
    v.rounds = v.rounds.slice(-300);
    if (best) v.best[game] = score;
    const saved = setJSON(KEY, v);
    return { saved, best, xp: today < DAILY_XP_ROUNDS ? XP_PER_ROUND : 0, left: Math.max(0, DAILY_XP_ROUNDS - today - 1) };
  }

  /* Missed item → Review again (same format as the labs) */
  function miss(id, skill, label, source) {
    let q = getJSON(REVIEW, []);
    if (!Array.isArray(q)) q = [];
    const found = q.find((x) => x && x.id === id);
    if (found) {
      found.misses = (found.misses || 1) + 1;
      found.due = new Date(Date.now() + 7 * DAY).toISOString();
      found.last = new Date().toISOString();
    } else
      q.push({ id, skill, source, label, misses: 1, last: new Date().toISOString(), due: new Date(Date.now() + 3 * DAY).toISOString() });
    setJSON(REVIEW, q);
  }

  /* ---------- HUD ---------- */
  function hud(root) {
    const hearts = el("span", "hud-hearts"),
      score = el("span", "hud-score"),
      round = el("span", "hud-round"),
      time = el("span", "hud-time");
    hearts.setAttribute("aria-label", "Lives");
    root.replaceChildren(round, hearts, time, score);
    return {
      set(o) {
        if (o.hearts !== undefined) {
          hearts.textContent = "♥".repeat(Math.max(0, o.hearts)) + "♡".repeat(Math.max(0, (o.maxHearts || 3) - o.hearts));
          hearts.setAttribute("aria-label", o.hearts + " lives left");
        }
        if (o.score !== undefined) score.textContent = "Score " + o.score;
        if (o.round !== undefined) round.textContent = o.round;
        if (o.time !== undefined) {
          time.textContent = "⏱ " + o.time + "s";
          time.classList.toggle("urgent", o.time <= 10);
        }
      },
    };
  }

  /* ---------- Input: pointer + hand, one set of callbacks ----------
     mode "pinch": hand down = pinch; mode "point": hand down while visible (slicing);
     mode "fist": hand down = fist. Coordinates are stage pixels. */
  function input(stage, h) {
    const cursor = el("div", "hand-cursor");
    cursor.setAttribute("aria-hidden", "true");
    stage.append(cursor);
    let handDown = false,
      handOn = false;
    const local = (cx, cy) => {
      const r = stage.getBoundingClientRect();
      return [cx - r.left, cy - r.top];
    };
    stage.addEventListener("pointerdown", (e) => {
      if (handOn) return;
      if (e.target.closest("button,a,input,select,textarea") && !e.target.closest("[data-game-target]")) return;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {}
      h.onDown && h.onDown(...local(e.clientX, e.clientY), "pointer", e);
    });
    stage.addEventListener("pointermove", (e) => {
      if (handOn) return;
      h.onMove && h.onMove(...local(e.clientX, e.clientY), "pointer", e.buttons > 0 || e.pointerType === "touch");
    });
    const up = (e) => {
      if (handOn) return;
      h.onUp && h.onUp(...local(e.clientX, e.clientY), "pointer", e);
    };
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);

    function hand(s) {
      const r = stage.getBoundingClientRect();
      if (!s.present) {
        cursor.classList.remove("on", "down");
        if (handDown) {
          handDown = false;
          h.onUp && h.onUp(-1, -1, "hand");
        }
        return;
      }
      // Use the middle 76% of the camera view so students need not reach the edges
      const nx = Math.min(1, Math.max(0, (s.x - 0.12) / 0.76)),
        ny = Math.min(1, Math.max(0, (s.y - 0.1) / 0.75)),
        x = nx * r.width,
        y = ny * r.height;
      const want = h.mode === "pinch" ? s.pinch : h.mode === "fist" ? s.fist : true;
      cursor.classList.add("on");
      cursor.classList.toggle("down", want);
      cursor.classList.toggle("fist", !!s.fist);
      cursor.style.transform = "translate(" + x + "px," + y + "px)";
      h.onMove && h.onMove(x, y, "hand", want);
      if (want && !handDown) {
        handDown = true;
        h.onDown && h.onDown(x, y, "hand");
      } else if (!want && handDown) {
        handDown = false;
        h.onUp && h.onUp(x, y, "hand");
      }
    }
    return {
      hand,
      setHandOn(on) {
        handOn = on;
        stage.classList.toggle("hand-mode", on);
        if (!on) cursor.classList.remove("on", "down");
      },
      isHand: () => handOn,
      mode: h.mode,
    };
  }

  /* ---------- Camera mode (consent, preview, status) ---------- */
  function camera({ button, stage, inputCtl, status, howTo }) {
    const preview = el("div", "cam-preview"),
      video = el("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    const tag = el("span", "cam-tag", "● LIVE · stays on this device");
    preview.append(video, tag);
    preview.hidden = true;
    stage.append(preview);
    const say = (t) => status && (status.textContent = t);
    let on = false;
    const ui = () => {
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? "Turn camera off" : "Try camera mode 🎥";
    };
    ui();
    async function turnOn() {
      if (!getJSON("smh.arcade.cameraOk", false)) {
        const ok = await consent(howTo);
        if (!ok) return;
        setJSON("smh.arcade.cameraOk", true);
      }
      button.disabled = true;
      try {
        window.SMHGesture.cursor = inputCtl.mode === "fist" ? "palm" : "tip";
        await window.SMHGesture.start(video, inputCtl.hand, say);
        on = true;
        preview.hidden = false;
        inputCtl.setHandOn(true);
        (document.getElementById("play") || stage).scrollIntoView({ block: "start", behavior: reduced() ? "auto" : "smooth" });
        say("Camera mode on. " + howTo + " Tap “Turn camera off” any time.");
      } catch (e) {
        window.SMHGesture.stop();
        const m = (e && e.message) || "";
        say(
          (e && e.name === "NotAllowedError"
            ? "Camera permission was not given."
            : e && e.name === "NotFoundError"
              ? "No camera was found on this device."
              : /fetch|import|network|load/i.test(m)
                ? "The hand tracker could not download. Check your internet connection and try again."
                : "Camera mode could not start on this device.") + " You can keep playing by tapping.",
        );
      }
      button.disabled = false;
      ui();
    }
    function turnOff() {
      window.SMHGesture.stop();
      on = false;
      preview.hidden = true;
      inputCtl.setHandOn(false);
      say("Camera off. Tap or drag to play.");
      ui();
    }
    button.onclick = () => (on ? turnOff() : turnOn());
    addEventListener("pagehide", () => on && turnOff());
    document.addEventListener("visibilitychange", () => document.hidden && on && turnOff());
    return { off: turnOff, isOn: () => on };
  }
  function consent(howTo) {
    return new Promise((resolve) => {
      const d = el("dialog", "arcade-dialog");
      d.setAttribute("aria-labelledby", "cam-consent-title");
      const h = el("h2", "", "Play with your hand?");
      h.id = "cam-consent-title";
      const list = el("ul", "consent-list");
      [
        "Your camera picture is read on this device only. Nothing is recorded, saved or uploaded.",
        "The hand tracker downloads once (about 8 MB). Use Wi-Fi if you can.",
        howTo,
        "Prefer not to? Tapping works for every game.",
      ].forEach((t) => list.append(el("li", "", t)));
      const row = el("div", "actions"),
        yes = el("button", "primary", "Turn on camera"),
        no = el("button", "", "Not now");
      yes.type = no.type = "button";
      row.append(yes, no);
      d.append(h, list, row);
      document.body.append(d);
      const done = (v) => {
        d.close();
        d.remove();
        resolve(v);
      };
      yes.onclick = () => done(true);
      no.onclick = () => done(false);
      d.addEventListener("cancel", (e) => {
        e.preventDefault();
        done(false);
      });
      d.showModal();
      yes.focus();
    });
  }

  /* Hand "click": press whichever [data-hand-press] button is under the hand cursor */
  function handPress(stage, x, y) {
    const r = stage.getBoundingClientRect(),
      b = [...stage.querySelectorAll("[data-hand-press]")].find((n) => {
        if (n.disabled || !n.offsetParent) return false;
        const q = n.getBoundingClientRect();
        return r.left + x >= q.left - 8 && r.left + x <= q.right + 8 && r.top + y >= q.top - 8 && r.top + y <= q.bottom + 8;
      });
    if (b) b.click();
    return !!b;
  }

  /* ---------- Feedback bubble on the stage ---------- */
  function pop(stage, x, y, text, kind) {
    const b = el("div", "pop " + (kind || ""), text);
    b.style.left = x + "px";
    b.style.top = y + "px";
    stage.append(b);
    setTimeout(() => b.remove(), reduced() ? 900 : 1100);
  }

  /* ---------- Results screen ---------- */
  function results({ game, title, score, correct, total, missed, again, other }) {
    const rec = record(game, score, correct, total),
      pct = total ? correct / total : 0,
      stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    if (stars >= 2) sfx.win();
    const d = el("dialog", "arcade-dialog results");
    d.setAttribute("aria-labelledby", "res-title");
    const h = el("h2", "", stars >= 2 ? "Nice work!" : stars === 1 ? "Good effort!" : "Keep practising!");
    h.id = "res-title";
    const st = el("p", "res-stars", "★".repeat(stars) + "☆".repeat(3 - stars));
    st.setAttribute("aria-label", stars + " of 3 stars");
    const grid = el("div", "res-grid");
    [
      [score, "score" + (rec.best ? " · new best!" : "")],
      [correct + "/" + total, "correct"],
      [rec.xp ? "+" + rec.xp + " XP" : "0 XP", rec.xp ? rec.left + " XP rounds left today" : "daily Arcade XP reached"],
    ].forEach(([b, s]) => {
      const c = el("div", "res-cell");
      c.append(el("b", "", String(b)), el("span", "", s));
      grid.append(c);
    });
    d.append(el("span", "eyebrow", title.toUpperCase()), h, st, grid);
    if (missed.length) {
      const m = el("div", "res-missed");
      m.append(el("b", "", "Saved to Review again (back in 3 days):"));
      const ul = el("ul");
      missed.slice(0, 6).forEach((t) => ul.append(el("li", "", t)));
      if (missed.length > 6) ul.append(el("li", "", "… and " + (missed.length - 6) + " more"));
      m.append(ul);
      d.append(m);
    } else d.append(el("p", "small", "No misses. Nothing added to Review again."));
    if (!rec.saved) d.append(el("p", "small", "This browser is not saving progress (private mode or storage blocked)."));
    const row = el("div", "actions"),
      a = el("button", "primary", "Play again"),
      o = el("a", "button", other[0]),
      back = el("a", "button", "Arcade home");
    a.type = "button";
    o.href = other[1];
    back.href = "index.html";
    row.append(a, o, back);
    d.append(row);
    document.body.append(d);
    a.onclick = () => {
      d.close();
      d.remove();
      again();
    };
    d.addEventListener("cancel", () => setTimeout(() => d.remove(), 0));
    d.showModal();
    a.focus();
  }

  /* ---------- Challenge level: Warm-up · Diploma (default) · Exam mode ----------
     time = share of the normal timer, speed = how fast targets move, hard = MUET-level bank,
     strict = one chance per question (Exam mode). Saved on this device. */
  const TIER_KEY = "smh.arcade.tier",
    TIERS = {
      warm: { id: "warm", name: "Warm-up", note: "Short clues, more time. Good for your first game.", time: 1, speed: 1, hard: false, strict: false },
      diploma: { id: "diploma", name: "Diploma", note: "MUET-level questions, closer traps, less time.", time: 0.72, speed: 1.3, hard: true, strict: false },
      exam: { id: "exam", name: "Exam mode", note: "Hardest questions at exam pace. One chance each.", time: 0.55, speed: 1.6, hard: true, strict: true },
    };
  function tier() {
    const t = getJSON(TIER_KEY, "diploma");
    return TIERS[t] || TIERS.diploma;
  }
  function tierPicker(onPick) {
    const box = el("div", "tier-pick"),
      note = el("p", "tier-note", tier().note);
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Challenge level");
    const row = el("div", "tier-row");
    Object.values(TIERS).forEach((t) => {
      const b = el("button", "tier", t.name);
      b.type = "button";
      b.dataset.handPress = "";
      b.setAttribute("aria-pressed", String(t.id === tier().id));
      b.onclick = () => {
        setJSON(TIER_KEY, t.id);
        row.querySelectorAll(".tier").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        note.textContent = t.note;
        onPick && onPick(t);
      };
      row.append(b);
    });
    box.append(row, note);
    return box;
  }
  /* combo: 3 clean answers in a row = ×2, 6 in a row = ×3 */
  function combo() {
    let n = 0;
    return {
      hit() {
        n++;
        return n >= 6 ? 3 : n >= 3 ? 2 : 1;
      },
      miss() {
        n = 0;
      },
      get streak() {
        return n;
      },
    };
  }

  window.SMHArcade = { el, shuffle, handPress, reduced, motionButton, soundButton, sfx, hud, input, camera, pop, results, miss, load, roundsToday, tier, tierPicker, combo, TIERS, DAILY_XP_ROUNDS, XP_PER_ROUND };
})();
