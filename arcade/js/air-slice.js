/* Smart MUET Arcade · Air Slice (trap slicer).
   Read the clue, then slice the RIGHT answer as the options fly past. Slicing a trap
   costs a life and names the trap (changed plan, word match, too far…).
   Play by: tap a card, swipe through it, keyboard (Tab + Enter), or camera (point and swipe). */
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

  const Q_TIME = 25,
    ORB_COL = ["#3542e8", "#00a88f", "#ff792f", "#c90c9f"];
  let qs = [],
    qi = 0,
    hearts = 3,
    score = 0,
    correct = 0,
    missed = [],
    first = true,
    timeLeft = Q_TIME,
    timer = 0,
    playing = false,
    live = false,
    orbs = [],
    raf = 0,
    lastT = 0,
    trail = [],
    prev = null,
    pointerDown = false,
    handMode = false,
    T = A.tier(),
    qTime = Q_TIME,
    combo = A.combo();

  /* ---------- Stage skeleton ---------- */
  const panel = el("div", "as-panel"),
    canvas = el("canvas", "as-trail"),
    field = el("div", "as-field"),
    overlay = el("div", "stage-overlay");
  canvas.setAttribute("aria-hidden", "true");
  stage.append(field, canvas, panel, overlay);
  const ctx = canvas.getContext("2d");

  const input = A.input(stage, {
    mode: "point",
    onDown(x, y, src) {
      handMode = src === "hand";
      if (src === "hand" && (!live || !overlay.hidden)) return handPress(x, y);
      pointerDown = true;
      prev = { x, y, t: performance.now() };
      if (src === "pointer") {
        const o = orbAt(x, y);
        if (o) slice(o);
      }
    },
    onMove(x, y, src, down) {
      const t = performance.now();
      if (src === "pointer" && !down) {
        prev = null;
        return;
      }
      trail.push({ x, y, t });
      if (prev && live) {
        const dist = Math.hypot(x - prev.x, y - prev.y),
          speed = dist / Math.max(1, t - prev.t),
          need = src === "hand" ? 0.45 : 0.25;
        if (speed > need) {
          const steps = Math.ceil(dist / 8);
          for (let i = 0; i <= steps; i++) {
            const o = orbAt(prev.x + ((x - prev.x) * i) / steps, prev.y + ((y - prev.y) * i) / steps);
            if (o) {
              slice(o);
              break;
            }
          }
        }
      }
      prev = { x, y, t };
    },
    onUp() {
      pointerDown = false;
      prev = null;
    },
  });
  A.camera({
    button: $("#camera"),
    stage,
    inputCtl: input,
    status,
    howTo: "Point with your first finger and swipe quickly through the right answer, like a ninja slice.",
  });
  const handPress = (x, y) => A.handPress(stage, x, y);

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
      paint = () => {
        const t = A.tier();
        info.textContent = "10 CLUES · 3 LIVES · " + Math.round(Q_TIME * t.time) + " SECONDS EACH" + (t.hard ? " · 4 OPTIONS" : "");
      };
    paint();
    showOverlay([
      info,
      el("h2", "", "Slice the answer. Dodge the traps."),
      el("p", "", "Read the clue first. The options fly up from below: slice only the right one. 3 clean slices in a row = combo ×2, 6 in a row = ×3."),
      A.tierPicker(paint),
      go,
    ]);
  }
  function start() {
    T = A.tier();
    qTime = Math.round(Q_TIME * T.time);
    combo = A.combo();
    qs = (T.hard ? A.shuffle(Bank.arcade.sliceHard) : A.shuffle(Bank.arcade.slice)).slice(0, 10);
    qi = 0;
    hearts = 3;
    score = 0;
    correct = 0;
    missed = [];
    playing = true;
    overlay.hidden = true;
    H.set({ hearts, score });
    loadQ();
  }

  /* ---------- Questions ---------- */
  function loadQ() {
    const q = qs[qi];
    first = true;
    panel.replaceChildren(
      el("span", "as-kind " + q.skill, q.skill === "listening" ? "LISTENING · YOU HEAR" : "READING · YOU READ"),
      el("p", "as-clue", "“" + q.clue + "”"),
      el("p", "as-q", q.q),
    );
    field.replaceChildren();
    orbs = A.shuffle(q.options.map((t, i) => i)).map((i, k) => {
      const node = el("button", "orb");
      node.type = "button";
      node.dataset.gameTarget = "";
      node.style.setProperty("--c", ORB_COL[k % 4]);
      node.append(el("span", "orb-text", q.options[i]));
      node.setAttribute("aria-label", "Option: " + q.options[i]);
      node.onclick = (e) => {
        if (e.detail === 0) slice(o); // keyboard
      };
      field.append(node);
      const o = { i, node, x: 0, y: 0, vx: 0, vy: 0, alive: true, wait: k * 0.55, lane: k };
      return o;
    });
    timeLeft = qTime;
    H.set({ round: "Clue " + (qi + 1) + "/" + qs.length + (combo.streak >= 3 ? " · ×" + (combo.streak >= 6 ? 3 : 2) : ""), time: timeLeft });
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    live = true;
    requestAnimationFrame(() => {
      layoutStatic();
      orbs.forEach(launch);
      lastT = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    });
    status.textContent = "Clue " + (qi + 1) + ": " + q.q;
  }
  function tick() {
    if (!live) return;
    timeLeft--;
    H.set({ time: Math.max(0, timeLeft) });
    if (timeLeft <= 0) {
      hearts--;
      H.set({ hearts });
      A.sfx.bad();
      first = false;
      combo.miss();
      endQ(false, "Time up.");
    }
  }

  /* ---------- Motion: floaty arcs (or a still row when motion is paused) ---------- */
  const dims = () => ({ W: field.clientWidth, Ht: field.clientHeight, top: panel.offsetTop + panel.offsetHeight + 14 });
  function layoutStatic() {
    const { W, Ht, top } = dims();
    orbs.forEach((o) => {
      o.w = o.node.offsetWidth;
      o.h = o.node.offsetHeight;
    });
    if (!A.reduced()) return;
    const gap = 12,
      total = orbs.reduce((n, o) => n + o.w, 0) + gap * (orbs.length - 1),
      wrap = total > W - 20;
    let x = Math.max(10, (W - total) / 2),
      y = top + Math.max(20, (Ht - top - 60) / 2 - (wrap ? 80 : 30));
    orbs.forEach((o) => {
      if (wrap) {
        o.x = (W - o.w) / 2;
        o.y = y;
        y += o.h + gap;
      } else {
        o.x = x;
        o.y = y;
        x += o.w + gap;
      }
      put(o);
    });
  }
  function launch(o) {
    const { W, Ht, top } = dims(),
      lanes = orbs.length,
      laneW = W / lanes,
      peak = top + 10 + Math.random() * Math.max(10, (Ht - top) * 0.28),
      T2 = ((input.isHand() ? 6.2 : 5.2) + Math.random() * 0.8) / (T.speed || 1),
      h = Ht + 10 - peak,
      g = (8 * h) / (T2 * T2);
    o.g = g;
    o.y = Ht + 10;
    o.vy = -Math.sqrt(2 * g * h);
    const cx = laneW * o.lane + laneW / 2 - o.w / 2;
    o.x = Math.min(Math.max(6, cx + (Math.random() - 0.5) * laneW * 0.3), W - o.w - 6);
    o.vx = (Math.random() - 0.5) * 30;
  }
  function put(o) {
    o.node.style.transform = "translate(" + o.x + "px," + o.y + "px)";
  }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    if (live && !A.reduced()) {
      const { W, Ht } = dims();
      orbs.forEach((o) => {
        if (!o.alive) return;
        if (o.wait > 0) {
          o.wait -= dt;
          o.node.style.opacity = 0;
          return;
        }
        o.node.style.opacity = 1;
        o.vy += o.g * dt;
        o.y += o.vy * dt;
        o.x = Math.min(Math.max(4, o.x + o.vx * dt), W - o.w - 4);
        if (o.vy > 0 && o.y > Ht + 10) {
          o.wait = 0.25 + Math.random() * 0.5;
          o.lane = (o.lane + 1 + Math.floor(Math.random() * (orbs.length - 1))) % orbs.length;
          launch(o);
        }
        put(o);
      });
    }
    drawTrail(t);
  }
  function drawTrail(t) {
    const r = stage.getBoundingClientRect(),
      dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(r.width * dpr)) {
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, r.width, r.height);
    trail = trail.filter((p) => t - p.t < 220);
    if (trail.length < 2) return;
    ctx.lineCap = "round";
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1],
        b = trail[i],
        life = 1 - (t - b.t) / 220;
      ctx.strokeStyle = "rgba(255,218,22," + life.toFixed(2) + ")";
      ctx.lineWidth = 2 + 8 * life;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  function orbAt(x, y) {
    const sr = stage.getBoundingClientRect();
    return orbs.find((o) => {
      if (!o.alive || o.wait > 0) return false;
      const b = o.node.getBoundingClientRect();
      return x >= b.left - sr.left - 6 && x <= b.right - sr.left + 6 && y >= b.top - sr.top - 6 && y <= b.bottom - sr.top + 6;
    });
  }

  /* ---------- Slicing ---------- */
  function slice(o) {
    if (!live || !o.alive) return;
    const q = qs[qi],
      sr = stage.getBoundingClientRect(),
      b = o.node.getBoundingClientRect(),
      px = b.left - sr.left + b.width / 2,
      py = b.top - sr.top + b.height / 2;
    o.alive = false;
    A.sfx.slice();
    splitFx(o, o.i === q.answer);
    if (o.i === q.answer) {
      const mult = first ? combo.hit() : 1,
        pts = (first ? 10 + Math.floor(timeLeft / 3) : 4) * mult;
      if (!first) combo.miss();
      score += pts;
      if (first) correct++;
      H.set({ score });
      A.sfx.good();
      A.pop(stage, px, py, "+" + pts + (mult > 1 ? "  combo ×" + mult : ""), "good");
      endQ(true, "");
    } else {
      first = false;
      combo.miss();
      hearts--;
      H.set({ hearts });
      A.sfx.bad();
      A.pop(stage, px, py, "Trap!", "bad");
      status.textContent = q.traps[o.i] || "That option is a trap.";
      if (hearts <= 0 || T.strict) endQ(false, q.traps[o.i] || "");
    }
  }
  function splitFx(o, good) {
    const r = o.node.getBoundingClientRect(),
      sr = stage.getBoundingClientRect();
    o.node.style.visibility = "hidden";
    if (A.reduced()) return;
    ["top", "bottom"].forEach((side) => {
      const half = o.node.cloneNode(true);
      half.className = "orb half " + side + (good ? " good" : " bad");
      half.removeAttribute("data-game-target");
      half.style.visibility = "visible";
      half.style.transform = "translate(" + (r.left - sr.left) + "px," + (r.top - sr.top) + "px)";
      half.setAttribute("aria-hidden", "true");
      half.tabIndex = -1;
      field.append(half);
      setTimeout(() => half.remove(), 700);
    });
  }
  function endQ(won, note) {
    if (!live) return;
    live = false;
    clearInterval(timer);
    const q = qs[qi];
    if (!(won && first)) {
      missed.push(q.q + " → " + q.options[q.answer]);
      A.miss(q.skill + ":arcade-slice-" + q.id, q.skill, "Trap slicer: " + q.q, "Arcade · Air Slice");
    }
    const last = hearts <= 0 || qi === qs.length - 1,
      next = el("button", "primary big", last ? "See my results ▸" : "Next clue ▸");
    next.type = "button";
    next.dataset.handPress = "";
    next.onclick = () => {
      if (last) finish();
      else {
        qi++;
        overlay.hidden = true;
        loadQ();
      }
    };
    const why = el("div", "as-why");
    why.append(el("b", "", "Answer: " + q.options[q.answer]), el("p", "", q.why));
    const traps = Object.entries(q.traps);
    if (traps.length) {
      const ul = el("ul");
      traps.forEach(([i, t]) => ul.append(el("li", "", q.options[i] + " · " + t)));
      why.append(ul);
    }
    setTimeout(
      () =>
        showOverlay([
          el("span", "eyebrow light", won ? (first ? "CLEAN SLICE" + (combo.streak >= 3 ? " · COMBO ×" + (combo.streak >= 6 ? 3 : 2) : "") : "GOT IT IN THE END") : hearts <= 0 ? "OUT OF LIVES" : timeLeft <= 0 ? "TIME UP" : "TRAP · ONE CHANCE IN EXAM MODE"),
          el("h2", "", won ? (first ? "Sharp eyes!" : "Found it.") : "Here’s the answer."),
          why,
          next,
        ]),
      won ? 450 : 200,
    );
    status.textContent = note || "";
  }
  function finish() {
    playing = false;
    cancelAnimationFrame(raf);
    A.results({
      game: "air-slice",
      title: "Air Slice · " + T.name,
      score,
      correct,
      total: qi + 1,
      missed,
      again: () => start(),
      other: ["Play Grab & Throw", "grab-throw.html"],
    });
    field.replaceChildren();
    startScreen();
  }

  document.addEventListener("smh:motion", () => live && layoutStatic());
  addEventListener("resize", () => live && A.reduced() && layoutStatic());
  startScreen();
  H.set({ hearts, score, round: "Ready", time: Math.round(Q_TIME * A.tier().time) });
})();
