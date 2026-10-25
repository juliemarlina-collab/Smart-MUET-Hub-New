/* Smart MUET · shared game layer (app.js): XP, levels, streaks and badges.
   XP is DERIVED from the learning records already saved by each module, so it is
   never double-counted and no XP is ever lost for a wrong answer.
   Own storage: smh.app.v1 { days[], seenBadges[], lastXP }.
   Exposes window.SMHApp = { summary(), refresh(), BADGES, LEVELS }. */
(() => {
  "use strict";
  if (window.SMHApp) return;
  const root = document.body?.dataset.appRoot || "./",
    KEY = "smh.app.v1";

  /* ---------- Settings (adjust after the pilot week) ---------- */
  const XP = { star: 2, arcade: 10, chapter: 30, drill: 20, practice: 50, vault: 50, level: 50, reflection: 10, review: 20, mock: 80, check: 30 };
  const STREAK_BONUS = [
    [3, 15],
    [7, 40],
    [14, 100],
  ];
  const LEVELS = [
    [0, "Starter"],
    [150, "Explorer"],
    [400, "Practitioner"],
    [800, "Band Chaser"],
    [1300, "MUET Ready"],
  ];
  const BADGES = [
    ["test-expert", "Test Expert", "Complete the 10-minute check", "#3b5bff"],
    ["sharp-ears", "Sharp Ears", "Listening CLUE Lab: check the practice set and save a reflection", "#3b5bff"],
    ["confident-speaker", "Confident Speaker", "Speaking PREP Lab: try all 3 drills and save a reflection", "#1b8f6f"],
    ["speed-reader", "Speed Reader", "Reading SCAN Lab: check a practice text and save a reflection", "#ff754a"],
    ["word-smith", "Word Smith", "Writing PEEL Lab: reach the minimum words on a draft and save a reflection", "#d9b100"],
    ["evidence-hunter", "Evidence Hunter", "SCAN Evidence Hunt: finish a MUET-level passage with at least 5 of 6 answers proved", "#ff754a"],
    ["quiz-champion", "Quiz Champion", "Finish the eBook Quiz Show (7, pages 46–47)", "#c98a00"],
    ["vault-1-clear", "Vault 1 Clear", "Complete all 4 Vault 1 components", "#2e9d57"],
    ["vault-2-clear", "Vault 2 Clear", "Complete all 4 Vault 2 components", "#1d6f3e"],
    ["mock-finisher", "Mock Finisher", "Complete all 4 Mock 1 components", "#d0392b"],
    ["reflective-learner", "Reflective Learner", "Save 10 reflections", "#e0479e"],
    ["comeback", "Comeback", "Complete 5 Review again sets", "#7fae1d"],
    ["seven-day-streak", "7-Day Streak", "Use the app 7 days in a row", "#e8501f"],
  ].map(([id, name, how, colour]) => ({ id, name, how, colour }));

  /* ---------- Storage helpers ---------- */
  const get = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  };
  const arr = (x) => (Array.isArray(x) ? x : []);
  const obj = (x) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});
  let app = obj(get(KEY, {}));
  const saveApp = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(app));
    } catch {}
  };
  const dayKey = (d = new Date()) =>
    d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  /* Record today as an active day */
  app.days = [...new Set(arr(app.days).filter((x) => /^\d{4}-\d\d-\d\d$/.test(x)))];
  if (!app.days.includes(dayKey())) app.days.push(dayKey());
  app.days.sort();
  app.days = app.days.slice(-400);
  saveApp();

  /* ---------- Streaks ---------- */
  function runs(days) {
    const out = [];
    let len = 0,
      prev = null;
    days.forEach((d) => {
      const t = Date.parse(d + "T12:00:00");
      len = prev !== null && Math.round((t - prev) / 86400000) === 1 ? len + 1 : 1;
      if (len === 1) out.push(1);
      else out[out.length - 1] = len;
      prev = t;
    });
    return out;
  }
  function currentStreak(days) {
    let n = 0;
    const d = new Date();
    if (!days.includes(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.includes(dayKey(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* ---------- Derive progress from module records ---------- */
  const PDF_CHAPTERS = [
    [4, 16],
    [17, 23],
    [24, 30],
    [31, 37],
    [38, 44],
    [45, 47],
  ];
  function compute() {
    const labs = ["speaking", "listening", "reading", "writing"].map((s) => [s, obj(get("smh.lab." + s + ".v1", {}))]),
      lab = Object.fromEntries(labs),
      actRead = arr(get("smh.rebuild.book.read", [])),
      pdfRead = arr(get("smh.pdfbook.v1.read", [])),
      review = obj(get("smh.review.stats.v1", {})),
      diag = obj(get("smh.diagnostic.v1", {})),
      vaultRec = obj(get("smh.vault.v1", {})),
      comps = ["listening", "speaking", "reading", "writing"],
      flag = (k) => {
        try {
          return localStorage.getItem(k) === "true";
        } catch {
          return false;
        }
      },
      stageDone = (st) => comps.filter((c) => flag("muet_" + st + "_" + c)).length;
    const v1 = stageDone("v1"),
      v2 = stageDone("v2"),
      m1 = stageDone("mock1"),
      levelsDone = [v1, v2, m1].filter((n) => n === 4).length;
    const chapters = [1, 2, 3, 4, 5, 6].filter((c) => {
      const act = [1, 2, 3, 4, 5].every((p) => actRead.includes(c + "-" + p));
      const [a, b] = PDF_CHAPTERS[c - 1];
      let pdf = true;
      for (let p = a; p <= b; p++) if (!pdfRead.includes(p)) pdf = false;
      return act || pdf;
    });
    const drills = labs.reduce((n, [, d]) => n + Object.values(obj(d.drills)).filter((x) => x?.checked).length, 0);
    const practiceSets =
      labs.reduce((n, [s, d]) => n + (s === "speaking" ? 0 : Object.keys(obj(d.results)).length), 0) +
      (Object.values(obj(lab.speaking.plans)).some((t) => typeof t === "string" && t.trim().length > 20) ? 1 : 0);
    const guideReflections = ["listening", "reading", "writing"].filter((s) => {
      try {
        return (localStorage.getItem("smh.rebuild.guide." + s + ".reflection") || "").trim().length > 0;
      } catch {
        return false;
      }
    }).length;
    const reflections =
      labs.reduce((n, [, d]) => n + arr(d.reflections).length, 0) +
      arr(review.reflections).length +
      arr(vaultRec.reflections).length +
      guideReflections;
    const reviewSets = arr(review.sets).length;
    const checkDone = !!diag.scores;
    const arcadePerDay = {};
    arr(obj(get("smh.arcade.v1", {})).rounds).forEach((r) => {
      if (r && /^\d{4}-\d\d-\d\d$/.test(r.date)) arcadePerDay[r.date] = (arcadePerDay[r.date] || 0) + 1;
    });
    const ebookQuiz = obj(get("smh.ebook.quiz.v1", {})),
      ebookStars = Object.values(ebookQuiz).reduce((n, r) => n + (r && Number.isFinite(r.best) ? Math.max(0, Math.min(14, r.best)) : 0), 0);
    const hunt = obj(obj(get("smh.lab.scanhunt.v1", {})).passages);
    const huntDone = Object.values(hunt).filter((r) => r && r.done).length;
    const trapStars = Object.values(obj(get("smh.learn.trap.v1", {}))).reduce((n, r) => n + (r && Number.isFinite(r.best) ? Math.max(0, Math.min(3, r.best)) : 0), 0);
    const arcadeRounds = Object.values(arcadePerDay).reduce((n, c) => n + Math.min(3, c), 0);
    const streakRuns = runs(app.days);
    const streakBonus = streakRuns.reduce((n, len) => n + STREAK_BONUS.filter(([d]) => len >= d).reduce((a, [, x]) => a + x, 0), 0);
    const breakdown = [
      ["Book chapters finished", chapters.length, XP.chapter],
      ["Technique drills tried", drills, XP.drill],
      ["Practice sets submitted", practiceSets, XP.practice],
      ["Vault components completed", v1 + v2, XP.vault],
      ["Mock components completed", m1, XP.mock],
      ["Vault levels completed", levelsDone, XP.level],
      ["Reflections written", reflections, XP.reflection],
      ["Review sets completed", reviewSets, XP.review],
      ["10-minute check", checkDone ? 1 : 0, XP.check],
      ["Arcade rounds (up to 3 a day)", arcadeRounds, XP.arcade],
      ["eBook game stars (best score)", ebookStars, XP.star],
      ["Trap spotter stars (best score)", trapStars, XP.star],
      ["SCAN Evidence Hunt passages finished", huntDone, XP.practice],
    ].map(([label, count, each]) => ({ label, count, each, xp: count * each }));
    breakdown.push({ label: "Streak bonuses", count: streakRuns.filter((r) => r >= 3).length, each: null, xp: streakBonus });
    const total = breakdown.reduce((n, b) => n + b.xp, 0);
    const hasRefl = (s) => arr(lab[s].reflections).length > 0;
    const earned = {
      "test-expert": checkDone,
      "sharp-ears": !!obj(lab.listening.results).listening && hasRefl("listening"),
      "confident-speaker": Object.values(obj(lab.speaking.drills)).filter((x) => x?.checked).length >= 3 && hasRefl("speaking"),
      "speed-reader": Object.keys(obj(lab.reading.results)).length > 0 && hasRefl("reading"),
      "word-smith": Object.values(obj(lab.writing.results)).some((r) => r && r.score >= r.total) && hasRefl("writing"),
      "evidence-hunter": Object.values(hunt).some((r) => r && r.best && r.best.answers >= 5),
      "quiz-champion": !!ebookQuiz["7"] || [1, 2, 3, 4, 5].every((p) => actRead.includes("6-" + p)),
      "vault-1-clear": v1 === 4,
      "vault-2-clear": v2 === 4,
      "mock-finisher": m1 === 4,
      "reflective-learner": reflections >= 10,
      comeback: reviewSets >= 5,
      "seven-day-streak": Math.max(0, ...streakRuns) >= 7,
    };
    let li = 0;
    LEVELS.forEach(([min], i) => {
      if (total >= min) li = i;
    });
    const next = LEVELS[li + 1];
    return {
      total,
      breakdown,
      level: { index: li, name: LEVELS[li][1], min: LEVELS[li][0], next: next ? { name: next[1], min: next[0] } : null },
      streak: currentStreak(app.days),
      bestStreak: Math.max(0, ...streakRuns),
      days: app.days.slice(),
      badges: BADGES.map((b) => ({ ...b, earned: !!earned[b.id] })),
    };
  }

  /* ---------- Styles ---------- */
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = root + "shared/styles/app.css";
  document.head.append(link);
  const reduced = () => {
    let paused = false;
    try {
      paused = localStorage.getItem("smh.rebuild.motionPaused") === "true";
    } catch {}
    return paused || matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("no-motion");
  };

  /* ---------- Badge artwork (your PNG, or a built-in medal) ---------- */
  function medal(b, size = 96) {
    const ns = "http://www.w3.org/2000/svg",
      svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("aria-hidden", "true");
    const initials = b.name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 2);
    svg.innerHTML =
      '<path d="M30 6h14l6 20-14 4zM70 6H56l-6 20 14 4z" fill="#ffcc33"/>' +
      '<circle cx="50" cy="58" r="36" fill="' + b.colour + '"/>' +
      '<circle cx="50" cy="58" r="28" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-dasharray="4 4"/>' +
      '<text x="50" y="68" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-weight="800" font-size="28" fill="#fff">' +
      initials +
      "</text>";
    return svg;
  }
  const missingArt = new Set(),
    loadedArt = new Set();
  function badgeArt(b, size = 96) {
    const wrap = document.createElement("span");
    wrap.className = "smh-badge-art";
    wrap.style.setProperty("--size", size + "px");
    if (missingArt.has(b.id)) {
      wrap.append(medal(b, size));
      return wrap;
    }
    const img = new Image(size, size);
    img.alt = "";
    img.decoding = "async";
    img.src = root + "shared/assets/badges/" + b.id + ".png";
    img.onload = () => loadedArt.add(b.id);
    img.onerror = () => {
      missingArt.add(b.id);
      img.replaceWith(medal(b, size));
    };
    wrap.append(img);
    return wrap;
  }

  /* ---------- Toasts ---------- */
  let stack;
  function toast(content, cls) {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "smh-toasts";
      stack.setAttribute("role", "status");
      stack.setAttribute("aria-live", "polite");
      document.body.append(stack);
    }
    const t = document.createElement("div");
    t.className = "smh-toast " + (cls || "") + (reduced() ? " still" : "");
    t.append(...content);
    stack.append(t);
    setTimeout(() => t.classList.add("out"), cls === "badge" ? 5200 : 2600);
    setTimeout(() => t.remove(), cls === "badge" ? 5700 : 3100);
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  /* ---------- Change detection ---------- */
  let last = null,
    lastSig = "";
  function check(initial) {
    const s = compute();
    const earnedIds = s.badges.filter((b) => b.earned).map((b) => b.id);
    if (typeof app.lastXP !== "number" || !Array.isArray(app.seenBadges)) {
      // First run: start quietly from existing records.
      app.lastXP = s.total;
      app.seenBadges = earnedIds;
      saveApp();
    }
    if (s.total > app.lastXP) {
      const gained = s.total - app.lastXP;
      let reason = "";
      const prevXP = last ? last.breakdown.map((b) => b.xp) : arr(app.lastBreakdown);
      const diff = s.breakdown.find((b, i) => typeof prevXP[i] === "number" && b.xp > prevXP[i]);
      if (diff) reason = diff.label.toLowerCase();
      toast([el("b", "xp", "+" + gained + " XP"), el("span", "", reason || "for your practice")], "xp");
      if (last && s.level.index > last.level.index)
        toast([el("b", "", "Level up!"), el("span", "", "You are now a " + s.level.name + ".")], "level");
      app.lastXP = s.total;
    }
    app.lastBreakdown = s.breakdown.map((b) => b.xp);
    const fresh = earnedIds.filter((id) => !app.seenBadges.includes(id));
    fresh.forEach((id) => {
      const b = s.badges.find((x) => x.id === id);
      toast([badgeArt(b, 64), el("b", "", "Badge earned"), el("span", "", b.name)], "badge");
    });
    if (fresh.length) app.seenBadges = [...app.seenBadges, ...fresh];
    saveApp();
    last = s;
    const sig = [s.total, s.streak, s.days.length, s.badges.filter((b) => b.earned).map((b) => b.id).join()].join("|");
    if (sig !== lastSig) render(s, !initial);
    lastSig = sig;
    return s;
  }

  /* ---------- Page widgets ---------- */
  function countUp(node, to) {
    const from = +node.dataset.value || 0;
    node.dataset.value = to;
    if (reduced() || from === to) {
      node.textContent = to;
      return;
    }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 500);
      node.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function flame(streak) {
    const f = el("span", "smh-flame" + (streak ? "" : " cold"));
    f.style.setProperty("--grow", Math.min(1.6, 0.8 + streak * 0.08));
    f.setAttribute("aria-hidden", "true");
    f.innerHTML =
      '<svg viewBox="0 0 40 52" width="40" height="52"><path class="outer" d="M20 2c3 9 14 15 14 29a14 14 0 0 1-28 0c0-7 4-11 6-15 1 5 3 7 5 8-1-8 0-15 3-22z"/><path class="inner" d="M20 22c2 6 8 9 8 17a8 8 0 0 1-16 0c0-4 2-6 3-8 1 3 2 4 3 4 0-5 0-9 2-13z"/></svg>';
    return f;
  }
  let stripBuilt = false;
  function render(s) {
    const strip = document.getElementById("xp-strip");
    if (strip) {
      if (!stripBuilt) {
        strip.replaceChildren();
        const left = el("div", "smh-streak"),
          mid = el("div", "smh-xp"),
          right = el("div", "smh-mini-badges");
        left.append(el("span", "smh-flame-slot"), el("b", "smh-streak-n", "0"), el("small", "", "day streak"));
        const top = el("div", "smh-xp-top");
        top.append(el("b", "smh-level", ""), el("span", "smh-xp-n", "0"), el("small", "", " XP"));
        const bar = el("div", "smh-bar"),
          fill = el("i");
        bar.append(fill);
        mid.append(top, bar, el("small", "smh-xp-next", ""));
        right.append(el("small", "", "Badges"), el("div", "smh-row"), Object.assign(el("a", "", "See all ↗"), { href: root + "me.html#badges" }));
        strip.append(left, mid, right);
        stripBuilt = true;
      }
      strip.querySelector(".smh-flame-slot").replaceChildren(flame(s.streak));
      countUp(strip.querySelector(".smh-streak-n"), s.streak);
      countUp(strip.querySelector(".smh-xp-n"), s.total);
      strip.querySelector(".smh-level").textContent = s.level.name;
      const span = s.level.next ? s.level.next.min - s.level.min : 1,
        pct = s.level.next ? ((s.total - s.level.min) / span) * 100 : 100;
      strip.querySelector(".smh-bar i").style.width = Math.max(3, Math.min(100, pct)) + "%";
      strip.querySelector(".smh-xp-next").textContent = s.level.next
        ? s.level.next.min - s.total + " XP to " + s.level.next.name
        : "Top level reached. Keep practising!";
      const row = strip.querySelector(".smh-row"),
        got = s.badges.filter((b) => b.earned);
      row.replaceChildren(...(got.length ? got.slice(-4).map((b) => badgeArt(b, 40)) : [el("small", "", "None yet: try a lab")]));
      row.setAttribute("aria-label", got.length + " of " + s.badges.length + " badges earned");
    }
    const shelf = document.getElementById("badge-shelf");
    if (shelf) {
      shelf.replaceChildren();
      s.badges.forEach((b) => {
        const card = el("article", "smh-badge-card" + (b.earned ? " earned" : " locked"));
        card.append(badgeArt(b, 88), el("b", "", b.name), el("small", "", b.earned ? "Earned ✓" : b.how));
        card.setAttribute("aria-label", b.name + (b.earned ? ", earned" : ", locked. " + b.how));
        shelf.append(card);
      });
      const n = document.getElementById("badge-count");
      if (n) n.textContent = s.badges.filter((b) => b.earned).length + " of " + s.badges.length + " earned";
    }
    const xpBox = document.getElementById("xp-breakdown");
    if (xpBox) {
      xpBox.replaceChildren();
      const head = el("p", "smh-xp-total");
      head.append(el("b", "", s.total + " XP"), el("span", "", " · Level: " + s.level.name + (s.level.next ? " · " + (s.level.next.min - s.total) + " XP to " + s.level.next.name : "")));
      const table = el("table", "smh-xp-table"),
        tb = el("tbody");
      s.breakdown.forEach((b) => {
        const tr = el("tr");
        tr.append(el("td", "", b.label), el("td", "", b.each ? b.count + " × " + b.each : b.count + " streak" + (b.count === 1 ? "" : "s")), el("td", "", b.xp + " XP"));
        tb.append(tr);
      });
      table.append(tb);
      const lv = el("p", "small", "Levels: " + LEVELS.map(([m, n]) => n + " " + m).join(" · ") + ". XP rewards practice and reflection; no XP is lost for wrong answers.");
      xpBox.append(head, table, lv);
    }
    const cal = document.getElementById("streak-calendar");
    if (cal) {
      cal.replaceChildren();
      const d = new Date();
      d.setDate(d.getDate() - 27);
      for (let i = 0; i < 28; i++) {
        const k = dayKey(d),
          cell = el("span", "smh-day" + (s.days.includes(k) ? " on" : "") + (i === 27 ? " today" : ""));
        cell.title = d.toLocaleDateString();
        cell.textContent = d.getDate();
        cell.setAttribute("aria-label", d.toLocaleDateString() + (s.days.includes(k) ? ", active" : ""));
        cal.append(cell);
        d.setDate(d.getDate() + 1);
      }
      const n = document.getElementById("streak-summary");
      if (n) n.textContent = "Current streak: " + s.streak + " day" + (s.streak === 1 ? "" : "s") + " · Best: " + s.bestStreak + " · Active days: " + s.days.length;
    }
  }

  window.SMHApp = {
    summary: () => {
      const s = compute();
      return { total: s.total, level: s.level.name, streak: s.streak, bestStreak: s.bestStreak, badges: s.badges.filter((b) => b.earned).map((b) => b.id), breakdown: s.breakdown };
    },
    refresh: () => check(false),
    BADGES,
    LEVELS,
    XP,
  };
  const start = () => {
    check(true);
    setInterval(() => {
      if (document.visibilityState === "visible") check(false);
    }, 2500);
    window.addEventListener("storage", () => check(false));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
