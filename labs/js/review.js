/* Smart MUET · Review again. Reads smh.review.queue.v1 (written by the labs),
   serves 5-question sets of due items, clears correct items and
   reschedules missed ones (+7 days). Stats: smh.review.stats.v1 */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    QKEY = "smh.review.queue.v1",
    SKEY = "smh.review.stats.v1",
    DAY = 86400000,
    SET_SIZE = 5,
    Bank = window.SMHBank;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const skills = { all: "All skills", listening: "Listening", speaking: "Speaking", reading: "Reading", writing: "Writing" };
  const techniques = { listening: "CLUE", speaking: "PREP", reading: "SCAN", writing: "PEEL" };
  let memory = false;
  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v === null ? fallback : v;
    } catch {
      memory = true;
      return fallback;
    }
  }
  function store(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      memory = true;
    }
    if (memory) {
      $("#storage-warning").hidden = false;
      $("#storage-warning").textContent = "Browser storage is unavailable. Review progress lasts for this visit only.";
    }
  }
  let queue = load(QKEY, []);
  if (!Array.isArray(queue)) queue = [];
  queue = queue.filter((x) => x && typeof x.id === "string");
  let stats = load(SKEY, {});
  if (!stats || typeof stats !== "object" || Array.isArray(stats)) stats = {};
  stats.cleared = Number.isInteger(stats.cleared) ? stats.cleared : 0;
  stats.sets = Array.isArray(stats.sets) ? stats.sets : [];
  stats.reflections = Array.isArray(stats.reflections) ? stats.reflections : [];
  let filter = "all";

  /* Motion */
  const media = matchMedia("(prefers-reduced-motion:reduce)");
  let motion = load("smh.review.motion", false) === true;
  function motionUI() {
    const off = motion || media.matches;
    document.documentElement.classList.toggle("no-motion", off);
    $("#motion").setAttribute("aria-pressed", String(off));
    $("#motion").textContent = off ? "Motion paused" : "Pause motion";
  }
  $("#motion").onclick = () => {
    motion = !motion;
    store("smh.review.motion", motion);
    motionUI();
  };
  motionUI();

  const isDue = (x) => !(Date.parse(x.due) > Date.now());
  const known = (x) => Bank && Bank.item(x.id);
  const inFilter = (x) => filter === "all" || x.skill === filter;
  const fmt = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "soon" : d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  };

  function countUp(node, to) {
    const from = +node.textContent || 0;
    if (document.documentElement.classList.contains("no-motion") || from === to) {
      node.textContent = to;
      return;
    }
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 450);
      node.textContent = Math.round(from + (to - from) * k);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function renderStats() {
    const live = queue.filter(known);
    countUp($("#stat-due"), live.filter(isDue).length);
    countUp($("#stat-later"), live.filter((x) => !isDue(x)).length);
    countUp($("#stat-cleared"), stats.cleared);
    countUp($("#stat-sets"), stats.sets.length);
  }

  /* Start panel */
  Object.entries(skills).forEach(([k, label]) => {
    const b = el("button", "chip", label);
    b.type = "button";
    b.setAttribute("aria-pressed", String(k === filter));
    b.onclick = () => {
      filter = k;
      $$("#skill-filter .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      renderStart();
    };
    $("#skill-filter").append(b);
  });
  function renderStart() {
    renderStats();
    const live = queue.filter(known).filter(inFilter),
      due = live.filter(isDue),
      later = live.filter((x) => !isDue(x)).sort((a, b) => Date.parse(a.due) - Date.parse(b.due));
    $("#start-due").hidden = !due.length;
    $("#start-early").hidden = due.length > 0 || !later.length;
    $("#empty-links").hidden = live.length > 0;
    if (due.length) {
      $("#start-heading").textContent = due.length + " item" + (due.length === 1 ? " is" : "s are") + " ready for review.";
      $("#start-copy").textContent =
        "Your set will have " + Math.min(SET_SIZE, due.length) + " question" + (Math.min(SET_SIZE, due.length) === 1 ? "" : "s") + ", oldest first. Correct answers clear the item.";
      $("#start-due").textContent = "Start my review set (" + Math.min(SET_SIZE, due.length) + ") ↗";
    } else if (later.length) {
      $("#start-heading").textContent = "Nothing is due yet. Well done.";
      $("#start-copy").textContent =
        "Your next item returns on " + fmt(later[0].due) + ". Waiting helps memory, but you can practise early if you have a test coming.";
    } else {
      $("#start-heading").textContent = filter === "all" ? "Your queue is empty." : "No " + skills[filter] + " items saved.";
      $("#start-copy").textContent =
        "When you miss a question in a lab, it is saved here to come back later. Try a lab, then return in a few days.";
    }
    const list = $("#queue-list");
    list.replaceChildren();
    if (!live.length) {
      list.append(el("p", "small", "No saved items" + (filter === "all" ? "." : " for this skill.")));
      return;
    }
    live
      .slice()
      .sort((a, b) => Date.parse(a.due) - Date.parse(b.due))
      .forEach((x) => {
        const row = el("div", "queue-row"),
          info = el("div");
        info.append(el("span", "", String(x.label || x.id).replace(/^\d+\.\s*/, "")), el("small", "", (x.source || "") + " · missed " + (x.misses || 1) + "×"));
        row.append(el("span", "pill " + x.skill, x.skill), info, el("span", "pill" + (isDue(x) ? " due-now" : ""), isDue(x) ? "due now" : fmt(x.due)));
        list.append(row);
      });
  }

  /* Quiz */
  let set = [],
    pos = 0,
    results = [],
    early = false;
  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
  function speak(lines, btn) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      $("#item-feedback").textContent = "Device voice is unavailable. Read the transcript after you answer, or ask a partner to read it aloud.";
      $("#item-feedback").className = "feedback retry";
      return;
    }
    stopVoice();
    const voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)),
      who = [...new Set(lines.map((l) => l[0]))];
    btn.closest(".player").classList.add("playing");
    lines.forEach(([w, t], i) => {
      const u = new SpeechSynthesisUtterance(t.replace(/\[\[|\]\]/g, ""));
      const v = voices[who.indexOf(w) % Math.max(1, Math.min(voices.length, 3))];
      if (v) u.voice = v;
      u.lang = v?.lang || "en-GB";
      u.rate = 0.95;
      u.pitch = who.indexOf(w) % 2 ? 1.1 : 0.95;
      if (i === lines.length - 1) u.onend = u.onerror = () => btn.closest(".player")?.classList.remove("playing");
      speechSynthesis.speak(u);
    });
  }
  function transcript(lines, mount) {
    mount.replaceChildren();
    const box = el("div", "transcript");
    lines.forEach(([w, t]) => {
      const p = el("p");
      p.append(el("b", "", w + ": "));
      t.split(/(\[\[.*?\]\])/).forEach((part) => {
        if (part.startsWith("[[")) p.append(el("mark", "", part.slice(2, -2)));
        else if (part) p.append(document.createTextNode(part));
      });
      box.append(p);
    });
    mount.append(el("span", "label", "TRANSCRIPT / CLUES HIGHLIGHTED"), box);
  }
  function show(panel) {
    ["start", "quiz", "done"].forEach((p) => ($("#" + p + "-panel").hidden = p !== panel));
    $("#workspace").scrollIntoView({ behavior: document.documentElement.classList.contains("no-motion") ? "instant" : "smooth", block: "start" });
  }
  function startSet(useEarly) {
    early = useEarly;
    const pool = queue
      .filter(known)
      .filter(inFilter)
      .filter((x) => (useEarly ? !isDue(x) : isDue(x)))
      .sort((a, b) => Date.parse(a.due) - Date.parse(b.due));
    set = pool.slice(0, SET_SIZE).map((x) => x.id);
    if (!set.length) return;
    pos = 0;
    results = [];
    show("quiz");
    renderItem();
  }
  function renderItem() {
    stopVoice();
    const item = Bank.item(set[pos]),
      q = queue.find((x) => x.id === set[pos]) || {};
    $("#quiz-count").textContent = "QUESTION " + (pos + 1) + " OF " + set.length;
    $("#quiz-progress").max = set.length;
    $("#quiz-progress").value = pos;
    $("#item-source").textContent = ((skills[item.skill] || item.skill) + " / " + (q.source || "Lab")).toUpperCase() + " / MISSED " + (q.misses || 1) + "×";
    const ctx = $("#item-context");
    ctx.replaceChildren();
    $("#item-transcript").hidden = true;
    $("#item-transcript").replaceChildren();
    if (item.context?.type === "text") {
      const d = el("details");
      d.open = true;
      d.append(el("summary", "", "Read the text · " + item.context.title));
      const box = el("div", "passage");
      item.context.paras.forEach((t) => box.append(el("p", "", t)));
      d.append(box);
      ctx.append(d);
    } else if (item.context?.type === "audio") {
      const player = el("div", "player"),
        b = el("button", "", "▷ Play " + item.context.title.toLowerCase()),
        wave = el("span", "wave");
      wave.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 5; i++) wave.append(el("i"));
      b.type = "button";
      b.onclick = () => speak(item.context.lines, b);
      player.append(b, wave, el("span", "plays", "Device voice · the transcript opens after you answer"));
      ctx.append(player);
    }
    $("#quiz-title").textContent = item.q;
    const fs = $("#item-options");
    fs.replaceChildren(el("legend", "sr-only", "Choose your answer"));
    item.options.forEach((t, i) => {
      const l = el("label"),
        inp = el("input");
      inp.type = "radio";
      inp.name = "review-option";
      inp.value = i;
      l.append(inp, el("span", "", String.fromCharCode(65 + i) + "  " + t));
      fs.append(l);
    });
    $("#check-item").hidden = false;
    $("#check-item").disabled = false;
    $("#next-item").hidden = true;
    $("#item-feedback").textContent = "";
    $("#item-feedback").className = "feedback";
    $("#quiz-title").focus({ preventScroll: true });
  }
  $("#check-item").onclick = () => {
    const chosen = $("input[name=review-option]:checked");
    if (!chosen) {
      $("#item-feedback").textContent = "Choose an answer first.";
      $("#item-feedback").className = "feedback retry";
      return;
    }
    const id = set[pos],
      item = Bank.item(id),
      correct = +chosen.value === item.answer,
      labels = $$("#item-options label");
    $$("#item-options input").forEach((i) => (i.disabled = true));
    labels[item.answer].classList.add("is-right");
    if (!correct) chosen.parentElement.classList.add("is-wrong");
    const out = $("#item-feedback");
    out.textContent = (correct ? "Correct — cleared from your queue. " : "Not yet. The answer is " + String.fromCharCode(65 + item.answer) + ". It will come back in 7 days. ") + item.why;
    out.className = "feedback " + (correct ? "correct pulse" : "retry shake");
    if (correct) out.prepend(el("span", "xp-float", "✓ cleared "));
    if (item.context?.type === "audio") {
      transcript(item.context.lines, $("#item-transcript"));
      $("#item-transcript").hidden = false;
    }
    // update queue
    const idx = queue.findIndex((x) => x.id === id);
    if (correct) {
      if (idx >= 0) queue.splice(idx, 1);
      stats.cleared++;
    } else if (idx >= 0) {
      queue[idx].misses = (queue[idx].misses || 1) + 1;
      queue[idx].last = new Date().toISOString();
      queue[idx].due = new Date(Date.now() + 7 * DAY).toISOString();
    }
    store(QKEY, queue);
    store(SKEY, stats);
    results.push({ id, skill: item.skill, q: item.q, correct });
    $("#check-item").hidden = true;
    $("#next-item").hidden = false;
    $("#next-item").textContent = pos + 1 < set.length ? "Next question →" : "Finish the set →";
    $("#next-item").focus({ preventScroll: true });
    out.scrollIntoView({ behavior: document.documentElement.classList.contains("no-motion") ? "instant" : "smooth", block: "center" });
    $("#quiz-progress").value = pos + 1;
  };
  $("#next-item").onclick = () => {
    if (pos + 1 < set.length) {
      pos++;
      renderItem();
    } else finish();
  };
  $("#quit-set").onclick = () => {
    stopVoice();
    if (results.length) finish();
    else {
      show("start");
      renderStart();
    }
  };
  function finish() {
    stopVoice();
    const right = results.filter((r) => r.correct).length;
    stats.sets.push({ date: new Date().toISOString(), size: results.length, correct: right, early });
    store(SKEY, stats);
    $("#done-copy").textContent =
      "You cleared " + right + " of " + results.length + ". " +
      (right === results.length ? "A perfect set." : "The rest will return in 7 days, so you get another chance.") +
      " Sets completed: " + stats.sets.length + ".";
    const list = $("#done-list");
    list.replaceChildren();
    results.forEach((r) => {
      const row = el("div", "done-row");
      row.append(el("b", "", r.correct ? "✓" : "↻"), el("span", "pill " + r.skill, r.skill), document.createTextNode(" " + r.q));
      list.append(row);
    });
    const tech = $("#reflect-tech");
    tech.replaceChildren();
    [...new Set(results.map((r) => techniques[r.skill]).filter(Boolean)), "Not sure yet"].forEach((t) => {
      const b = el("button", "chip", t);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.onclick = () => $$("#reflect-tech .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      tech.append(b);
    });
    $("#reflect-text").value = "";
    $("#reflect-status").textContent = "";
    show("done");
    renderStats();
    $("#done-title").focus({ preventScroll: true });
  }
  $("#reflect-conf").oninput = (e) => ($("#reflect-conf-value").textContent = e.target.value);
  $("#reflect-form").onsubmit = (e) => {
    e.preventDefault();
    const t = $("#reflect-text").value.trim(),
      chosen = $("#reflect-tech [aria-pressed=true]");
    if (!chosen) {
      $("#reflect-status").textContent = "Tap the technique that helped most.";
      return;
    }
    if (!t) {
      $("#reflect-status").textContent = "Write one specific action.";
      $("#reflect-text").focus();
      return;
    }
    stats.reflections.push({
      date: new Date().toISOString(),
      topic: "Review set",
      technique: chosen.textContent,
      text: t,
      confidence: +$("#reflect-conf").value,
    });
    store(SKEY, stats);
    $("#reflect-status").textContent = "Reflection saved. It appears on your Me page.";
    $("#reflect-form button[type=submit]").disabled = true;
  };
  $("#again").onclick = () => {
    $("#reflect-form button[type=submit]").disabled = false;
    show("start");
    renderStart();
  };
  $("#start-due").onclick = () => startSet(false);
  $("#start-early").onclick = () => startSet(true);
  window.addEventListener("pagehide", stopVoice);
  if (!Bank) {
    $("#start-heading").textContent = "The question bank could not load.";
    $("#start-copy").textContent = "Reload the page. If it continues, check that shared/js/item-bank.js was uploaded.";
    return;
  }
  renderStart();
})();
