/* Smart MUET Arcade · Monster Punch (Vault boss battle).
   Quick-fire questions from all four papers. Three minions carry the answers:
   punch the right one to hit the boss. Wrong punch or time up = the boss hits back.
   Play by: tap a minion, keyboard (Tab + Enter), or camera (make a fist over the minion). */
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

  const BOSSES = {
    v1: { name: "Jerebu", title: "the Haze Beast", level: "Vault 1 boss", hp: 6, time: 25, body: "#8f84b8", dark: "#5b5185", horns: 2 },
    v2: { name: "Kalut", title: "the Deadline Golem", level: "Vault 2 boss", hp: 8, time: 20, body: "#ff8a45", dark: "#b6501a", horns: 3 },
    mock1: { name: "Gerhana", title: "the Exam Dragon", level: "Mock 1 boss", hp: 10, time: 15, body: "#c93aa8", dark: "#7a1466", horns: 4 },
  };
  const PAPER = { listening: "LISTENING", speaking: "SPEAKING", reading: "READING", writing: "WRITING" },
    MINION = [
      ["#3542e8", "#1e2690"],
      ["#00a88f", "#04685a"],
      ["#ffb703", "#a96d00"],
      ["#c90c9f", "#7a0a60"],
    ];
  const BOSS_KEY = "smh.arcade.boss.v1";
  const getBoss = () => {
    try {
      const v = JSON.parse(localStorage.getItem(BOSS_KEY) || "{}");
      return v && typeof v === "object" ? v : {};
    } catch {
      return {};
    }
  };

  /* ---------- Original monster art (inline SVG) ---------- */
  function monster(body, dark, horns, size, boss) {
    const hornPaths = [],
      n = Math.max(1, horns);
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 50 : 26 + (48 * i) / (n - 1);
      hornPaths.push('<path d="M' + (x - 7) + " 30 L" + x + " " + (boss ? 4 : 12) + " L" + (x + 7) + ' 30Z" fill="#fff4d6" stroke="' + dark + '" stroke-width="3" stroke-linejoin="round"/>');
    }
    return (
      '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" aria-hidden="true" class="mon">' +
      hornPaths.join("") +
      '<path d="M14 62 C10 34 30 22 50 22 C70 22 90 34 86 62 C84 82 70 92 50 92 C30 92 16 82 14 62Z" fill="' + body + '" stroke="' + dark + '" stroke-width="4"/>' +
      '<path d="M14 64 L5 58 M86 64 L95 58" stroke="' + dark + '" stroke-width="6" stroke-linecap="round"/>' +
      '<ellipse cx="37" cy="52" rx="10" ry="11" fill="#fff"/><ellipse cx="63" cy="52" rx="10" ry="11" fill="#fff"/>' +
      '<circle class="pupil" cx="39" cy="54" r="5" fill="#17151e"/><circle class="pupil" cx="61" cy="54" r="5" fill="#17151e"/>' +
      '<path d="M25 38 L45 45 M75 38 L55 45" stroke="#17151e" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M32 72 Q50 84 68 72 Q50 78 32 72Z" fill="#17151e"/>' +
      '<path d="M38 73 L41 79 L44 74 M56 74 L59 79 L62 73" fill="#fff"/>' +
      (boss ? '<path d="M30 30 Q50 18 70 30" stroke="#ffda16" stroke-width="4" fill="none"/>' : "") +
      "</svg>"
    );
  }

  let boss = BOSSES.v1,
    levelId = "v1",
    queue = [],
    qi = 0,
    hp = 0,
    hearts = 3,
    score = 0,
    correct = 0,
    asked = 0,
    missed = [],
    timeLeft = 0,
    timer = 0,
    live = false,
    T = A.tier(),
    combo = A.combo(),
    order = [];

  /* ---------- Stage skeleton ---------- */
  const top = el("div", "mp-top"),
    bossBox = el("div", "mp-boss"),
    bossInfo = el("div", "mp-boss-info"),
    hpBar = el("div", "mp-hp"),
    qCard = el("div", "mp-q"),
    minions = el("div", "mp-minions"),
    flash = el("div", "mp-flash"),
    overlay = el("div", "stage-overlay");
  hpBar.setAttribute("role", "img");
  top.append(bossBox, bossInfo);
  stage.append(top, qCard, minions, flash, overlay);

  const input = A.input(stage, {
    mode: "fist",
    onDown(x, y, src) {
      if (!live || !overlay.hidden) {
        if (src === "hand") A.handPress(stage, x, y);
        return;
      }
      const m = minionAt(x, y);
      if (m) punch(m);
      else if (src === "hand") A.handPress(stage, x, y);
    },
  });
  A.camera({
    button: $("#camera"),
    stage,
    inputCtl: input,
    status,
    howTo: "Move your open hand over the right monster, then make a fist to punch it. A fist on a button presses it.",
  });

  function minionAt(x, y) {
    const sr = stage.getBoundingClientRect();
    return [...minions.querySelectorAll(".minion:not(:disabled)")].find((n) => {
      const b = n.getBoundingClientRect();
      return x >= b.left - sr.left - 6 && x <= b.right - sr.left + 6 && y >= b.top - sr.top - 6 && y <= b.bottom - sr.top + 6;
    });
  }
  function showOverlay(nodes) {
    overlay.replaceChildren(...nodes);
    overlay.hidden = false;
    const b = overlay.querySelector("button.primary") || overlay.querySelector("button");
    b && b.focus({ preventScroll: true });
  }

  /* ---------- Choose a boss ---------- */
  function startScreen() {
    const won = getBoss(),
      pick = el("div", "boss-pick");
    Object.entries(BOSSES).forEach(([id, b]) => {
      const btn = el("button", "boss-choice");
      btn.type = "button";
      btn.dataset.handPress = "";
      btn.setAttribute("aria-pressed", String(id === levelId));
      btn.innerHTML = monster(b.body, b.dark, b.horns, 64, true);
      const sec = el("span", "", "");
      const paintSec = () => (sec.textContent = b.level + " · " + b.hp + " HP · " + Math.round(b.time * A.tier().time) + "s");
      paintSec();
      btn._paint = paintSec;
      btn.append(el("b", "", b.name), sec, el("span", "won", won[id] && won[id].won ? "Defeated ✓" : ""));
      btn.onclick = () => {
        levelId = id;
        pick.querySelectorAll(".boss-choice").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
      };
      pick.append(btn);
    });
    const go = el("button", "primary big", "Fight! ▸");
    go.type = "button";
    go.dataset.handPress = "";
    go.onclick = start;
    showOverlay([
      el("span", "eyebrow light", "BOSS BATTLE · ALL FOUR PAPERS · 3 LIVES"),
      el("h2", "", "Choose your boss."),
      el("p", "", "Each right answer lands a punch. Below half health the boss enrages: less time to answer. Clean hits in a row build a combo."),
      pick,
      A.tierPicker(() => pick.querySelectorAll(".boss-choice").forEach((x) => x._paint && x._paint())),
      go,
    ]);
  }

  function buildQueue() {
    const by = {};
    const easy = Bank.arcade.boss,
      hard = Bank.arcade.bossHard || [],
      pool = !T.hard ? easy : T.strict || levelId === "mock1" ? hard : levelId === "v2" ? hard.concat(A.shuffle(easy).slice(0, 8)) : A.shuffle(easy).slice(0, 12).concat(hard.slice(0, 8));
    A.shuffle(pool).forEach((q) => (by[q.skill] = by[q.skill] || []).push(q));
    const order = A.shuffle(Object.keys(by)),
      out = [];
    while (order.some((k) => by[k].length)) order.forEach((k) => by[k].length && out.push(by[k].shift()));
    return out;
  }
  function start() {
    boss = BOSSES[levelId];
    T = A.tier();
    combo = A.combo();
    queue = buildQueue();
    qi = 0;
    hp = boss.hp;
    hearts = 3;
    score = 0;
    correct = 0;
    asked = 0;
    missed = [];
    bossBox.innerHTML = monster(boss.body, boss.dark, boss.horns, 150, true);
    bossInfo.replaceChildren(el("span", "eyebrow light", boss.level.toUpperCase()), el("b", "mp-name", boss.name + ", " + boss.title), hpBar);
    drawHp();
    H.set({ hearts, score });
    overlay.hidden = true;
    loadQ();
  }
  function drawHp() {
    hpBar.replaceChildren(...Array.from({ length: boss.hp }, (_, i) => el("i", i < hp ? "on" : "")));
    hpBar.setAttribute("aria-label", boss.name + " health " + hp + " of " + boss.hp);
  }

  /* ---------- Questions ---------- */
  function speakClue(text, btn) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text),
      v = speechSynthesis.getVoices().find((x) => /en[-_](GB|AU|IN|SG|MY)/i.test(x.lang)) || speechSynthesis.getVoices().find((x) => /^en/i.test(x.lang));
    if (v) u.voice = v;
    u.rate = 0.95;
    btn.disabled = true;
    u.onend = u.onerror = () => (btn.disabled = false);
    speechSynthesis.speak(u);
  }
  function loadQ() {
    const q = queue[qi];
    asked++;
    const kind = el("span", "mp-kind " + q.skill, PAPER[q.skill] + (q.clue ? (q.skill === "listening" ? " · YOU HEAR" : " · YOU READ") : ""));
    const parts = [kind];
    if (q.clue) {
      const row = el("p", "mp-clue", "“" + q.clue + "”");
      if (q.skill === "listening" && "speechSynthesis" in window) {
        const hear = el("button", "hear", "▷ Hear it");
        hear.type = "button";
        hear.dataset.handPress = "";
        hear.onclick = () => speakClue(q.clue, hear);
        row.prepend(hear, " ");
      }
      parts.push(row);
    }
    parts.push(el("p", "mp-question", q.q));
    qCard.replaceChildren(...parts);
    order = A.shuffle(q.options.map((_, i) => i));
    minions.classList.toggle("four", q.options.length > 3);
    minions.replaceChildren(
      ...order.map((i, k) => {
        const t = q.options[i];
        const b = el("button", "minion");
        b.type = "button";
        b.dataset.opt = i;
        b.dataset.gameTarget = "";
        b.innerHTML = monster(MINION[k % 4][0], MINION[k % 4][1], (k % 2) + 1, 78, false);
        b.append(el("span", "m-label", t));
        b.setAttribute("aria-label", "Punch: " + t);
        b.onclick = (e) => {
          if (e.detail === 0) punch(b); // keyboard
        };
        return b;
      }),
    );
    const rage = hp <= boss.hp / 2;
    bossBox.classList.toggle("rage", rage);
    timeLeft = Math.max(6, Math.round(boss.time * T.time * (rage ? 0.75 : 1)));
    H.set({ round: "Q" + asked + " · " + boss.name + " " + hp + "/" + boss.hp, time: timeLeft });
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    live = true;
    status.textContent = q.q;
  }
  function tick() {
    if (!live) return;
    timeLeft--;
    H.set({ time: Math.max(0, timeLeft) });
    if (timeLeft <= 0) bossHits(null, "Time up! " + boss.name + " strikes first.");
  }

  /* ---------- Punch ---------- */
  function fx(node, cls, ms) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
    setTimeout(() => node.classList.remove(cls), ms);
  }
  function punch(m) {
    if (!live) return;
    const q = queue[qi],
      i = +m.dataset.opt,
      sr = stage.getBoundingClientRect(),
      b = m.getBoundingClientRect();
    A.sfx.punch();
    const pow = el("span", "pow", i === q.answer ? "POW!" : "OOF");
    pow.style.left = b.left - sr.left + b.width / 2 + "px";
    pow.style.top = b.top - sr.top + 30 + "px";
    stage.append(pow);
    setTimeout(() => pow.remove(), 650);
    fx(m, "hit", 450);
    if (i === q.answer) {
      live = false;
      clearInterval(timer);
      hp--;
      correct++;
      const mult = combo.hit(),
        pts = (10 + Math.floor(timeLeft / 2)) * mult;
      score += pts;
      H.set({ score, round: "Q" + asked + " · " + boss.name + " " + hp + "/" + boss.hp });
      drawHp();
      A.sfx.good();
      fx(bossBox, "hurt", 520);
      const br = bossBox.getBoundingClientRect();
      A.pop(stage, br.left - sr.left + br.width / 2, br.top - sr.top + 30, "−1 HP  +" + pts + (mult > 1 ? "  combo ×" + mult : ""), "good");
      if (hp === Math.floor(boss.hp / 2)) status.textContent = boss.name + " is enraged! Less time from now on.";
      m.classList.add("right");
      status.textContent = "Hit! " + q.why;
      setTimeout(next, A.reduced() ? 1400 : 1700);
    } else bossHits(m, "Wrong monster!");
  }
  function bossHits(m, msg) {
    if (!live) return;
    live = false;
    clearInterval(timer);
    const q = queue[qi];
    combo.miss();
    hearts--;
    H.set({ hearts });
    A.sfx.roar();
    fx(bossBox, "attack", 600);
    fx(flash, "on", 500);
    if (m) m.classList.add("wrong");
    minions.querySelector('[data-opt="' + q.answer + '"]').classList.add("right");
    missed.push(q.q + " → " + q.options[q.answer]);
    A.miss(q.skill + ":arcade-boss-" + q.id, q.skill, "Boss battle: " + q.q, "Arcade · Monster Punch");
    const go = el("button", "primary big", hearts <= 0 ? "See my results ▸" : "Keep fighting ▸");
    go.type = "button";
    go.dataset.handPress = "";
    go.onclick = () => (hearts <= 0 ? finish(false) : next());
    const why = el("div", "as-why");
    why.append(el("b", "", "Answer: " + q.options[q.answer]), el("p", "", q.why));
    setTimeout(
      () =>
        showOverlay([
          el("span", "eyebrow light", msg.toUpperCase()),
          el("h2", "", hearts <= 0 ? boss.name + " wins this time." : "Ouch! Learn it, then hit back."),
          why,
          go,
        ]),
      A.reduced() ? 300 : 700,
    );
  }
  function next() {
    overlay.hidden = true;
    if (hp <= 0) return victory();
    qi++;
    if (qi >= queue.length) return finish(false, true);
    loadQ();
  }
  function victory() {
    live = false;
    const bonus = hearts * 15;
    score += bonus;
    H.set({ score });
    const rec = getBoss();
    rec[levelId] = { won: true, date: new Date().toISOString(), best: Math.max(score, (rec[levelId] && rec[levelId].best) || 0) };
    try {
      localStorage.setItem(BOSS_KEY, JSON.stringify(rec));
    } catch {}
    fx(bossBox, "defeated", 1200);
    A.sfx.win();
    const go = el("button", "primary big", "See my results ▸");
    go.type = "button";
    go.dataset.handPress = "";
    go.onclick = () => finish(true);
    setTimeout(
      () =>
        showOverlay([
          el("span", "eyebrow light", boss.level.toUpperCase() + " · DEFEATED"),
          el("h2", "", boss.name + " is down!"),
          el("p", "", "You answered across all four papers. Lives left: " + hearts + " (+" + bonus + " bonus)."),
          go,
        ]),
      A.reduced() ? 200 : 900,
    );
  }
  function finish(won, ranOut) {
    live = false;
    clearInterval(timer);
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (ranOut) status.textContent = boss.name + " escaped: no more questions this round.";
    A.results({
      game: "monster-punch",
      title: "Monster Punch · " + boss.name + " · " + T.name + (won ? " · defeated" : ""),
      score,
      correct,
      total: asked,
      missed,
      again: () => start(),
      other: ["Back to " + (levelId === "mock1" ? "Mock 1" : levelId === "v2" ? "Vault 2" : "Vault 1"), "../vault/" + (levelId === "mock1" ? "mock1" : levelId === "v2" ? "vault2" : "vault1") + ".html"],
    });
    startScreen();
  }

  const want = new URLSearchParams(location.search).get("level");
  if (BOSSES[want]) levelId = want;
  bossBox.innerHTML = monster(BOSSES[levelId].body, BOSSES[levelId].dark, BOSSES[levelId].horns, 150, true);
  startScreen();
  H.set({ hearts, score: 0, round: "Ready", time: Math.round(BOSSES[levelId].time * A.tier().time) });
})();
