/* Smart MUET · Vault level page (vault1.html, vault2.html, mock1.html). Needs vault-bridge.js. */
(() => {
  "use strict";
  const V = window.SMHVault,
    stage = document.body.dataset.level;
  if (!V || !V.STAGES[stage]) return;
  const el = (t, c, x) => {
    const n = document.createElement(t);
    if (c) n.className = c;
    if (x !== undefined) n.textContent = x;
    return n;
  };
  const s = V.status(stage),
    rec = V.recommended();
  document.getElementById("level-ring").append(V.ring(s.done, 190), el("b", "", s.done === 4 ? s.name + " complete ✓" : s.done + " of 4 papers done"));
  document.getElementById("level-tag").textContent =
    rec === stage ? "★ Recommended next for you." : rec ? "Recommended next: " + V.STAGES[rec].name + ". You can still practise here." : "All levels complete.";
  const nextComp = s.comps.find((c) => !c.done);
  const colours = { listening: "f-listening", speaking: "f-speaking", reading: "f-reading", writing: "f-writing" };
  /* tips & tricks for each paper at each level: guided → less support → exam conditions */
  const TIPS = {
    v1: { listening: ["Read the questions and predict the answer type.", "Use CLUE: check, listen, understand, eliminate.", "Open the hint before you check, then read every explanation."],
          speaking: ["Plan four PREP keywords before you speak.", "Use the model answer as a guide, not a script.", "Record once, then improve one thing."],
          reading: ["Read the question first, then scan for its meaning.", "Underline the line that proves your answer.", "Check each Part before moving on."],
          writing: ["Plan with the PEEL frame on screen.", "Write Task 1 first: it is shorter and builds momentum.", "Use the checklist before you submit."] },
    v2: { listening: ["Predict without the prompt cards this time.", "Note keywords during the first play.", "Check only after the whole Part."],
          speaking: ["Give yourself 1 minute to plan, 2 minutes to speak.", "Add a counter-argument to show depth.", "Listen back and name one weakness."],
          reading: ["Time each Part: about 10 minutes.", "Mark paraphrases, not repeated words.", "Guess smartly: eliminate two options first."],
          writing: ["Plan in 5 minutes without the frame.", "Vary your linkers: however, as a result, in contrast.", "Keep 5 minutes to proofread."] },
    mock1: { listening: ["Exam timing: each recording plays twice.", "Answer everything; there is no penalty for guessing.", "Missed items go to Review again."],
          speaking: ["Real timing: plan, present, then discuss.", "Speak to the group, not to the screen.", "Reflect honestly on the four criteria."],
          reading: ["75 minutes for 40 questions: keep moving.", "Skip a hard question and come back.", "Note the paragraph each answer came from."],
          writing: ["75 minutes: about 25 for Task 1, 50 for Task 2.", "Meet the word counts: 100+ and 250+.", "Check task fulfilment first, then language."] }
  }[stage];
  const cards = document.getElementById("level-cards");
  s.comps.forEach((c, i) => {
    const card = el("details", "smh-folder comp-card " + colours[c.id] + (c.done ? " done" : ""));
    const sum = el("summary");
    if (rec === stage && nextComp && nextComp.id === c.id) { sum.append(el("span", "rec-tag", "RECOMMENDED NEXT")); card.classList.add("recommended"); }
    const h = el("h3", "", c.name);
    h.append(el("small", "", V.TECH[c.id] + " · " + V.PAPER[c.id]));
    const arrow = el("i", "", "↗"); arrow.setAttribute("aria-hidden", "true");
    sum.append(el("span", "ft", "0" + (i + 1) + " / " + s.name.toUpperCase()), h, el("span", "st", c.done ? "Done ✓" + (c.score90 !== null ? " · " + c.score90 + "/90" : "") : "Not yet"), arrow);
    const body = el("div", "fb");
    body.append(el("p", "", c.done ? "Completed. Open it again to see your feedback or try for a higher score." : "Use " + V.TECH[c.id] + " as you work. Your result ends with a short reflection."));
    if (c.score90 !== null) { const sc = el("p", "score", String(c.score90)); sc.append(el("small", "", " / 90 practice score")); body.append(sc); }
    const trick = el("div", "trick"), ol = el("ol");
    trick.append(el("b", "", "Tips & tricks"));
    (TIPS[c.id] || []).forEach((t) => ol.append(el("li", "", t)));
    trick.append(ol);
    const a = el("a", "button primary", (c.done ? "Review or retry " : "Start ") + c.name + " ↗");
    a.href = c.href;
    body.append(trick, a);
    card.append(sum, body);
    cards.append(card);
  });
  /* level habits: sticky notes */
  const NOTES = {
    v1: ["Guided practice", "Help is on. Use it.", [["01 / NOTICE", "Read the prompt first.", "Each paper opens with a technique reminder. Read it before you start."], ["02 / PRACTISE", "Hints are allowed.", "Open a hint when you are stuck. That is what Vault 1 is for."], ["03 / REFLECT", "Keep one lesson.", "Every paper ends with a reflection. Write one thing you will do next time."]]],
    v2: ["Less support", "Lean on yourself.", [["01 / NOTICE", "Fewer prompts.", "The technique is still there, but you decide when to use it."], ["02 / PRACTISE", "Time each Part.", "Set a timer so the real exam pace feels normal."], ["03 / REFLECT", "Compare with Vault 1.", "Which paper grew? Which one still needs a Lab visit?"]]],
    mock1: ["Exam conditions", "Treat it like the real day.", [["01 / PREPARE", "Full time, one sitting.", "Start a paper only when you have the full time free."], ["02 / PERFORM", "No pausing.", "Follow the real timing. Answer every question."], ["03 / REVIEW", "Learn from the score.", "Your missed questions are saved in Review again for later."]]]
  }[stage];
  if (NOTES) {
    const sec = el("section", "smh-tips"), board = el("div", "board"), left = el("div"), notes = el("div", "notes");
    left.append(el("span", "eyebrow", s.name.toUpperCase() + " / " + NOTES[0].toUpperCase()), el("h2", "", NOTES[1]), el("p", "", "Three habits for this level. They take a minute and make every paper count."));
    NOTES[2].forEach(([k, h, p]) => { const n = el("article", "smh-note"); n.append(el("span", "", k), el("h3", "", h), el("p", "", p)); notes.append(n); });
    board.append(left, notes); sec.append(board);
    document.getElementById("level-tips")?.replaceWith(sec);
  }
  /* Boss battle card (Arcade · Monster Punch) */
  {
    const BOSS = { v1: ["Jerebu", "the Haze Beast"], v2: ["Kalut", "the Deadline Golem"], mock1: ["Gerhana", "the Exam Dragon"] }[stage];
    let won = false;
    try {
      won = !!(JSON.parse(localStorage.getItem("smh.arcade.boss.v1") || "{}")[stage] || {}).won;
    } catch {}
    if (BOSS) {
      const card = el("article", "card boss-card" + (won ? " won" : ""));
      card.append(
        el("span", "status", won ? "BOSS DEFEATED ✓" : s.done === 4 ? "BOSS BATTLE · READY" : "BOSS BATTLE · BEST AFTER 4/4"),
        el("h3", "", "Beat " + BOSS[0] + ", " + BOSS[1]),
        el("p", "", "A quick-fire boss battle with questions from all four papers. Punch the monster holding the right answer. Tap to play, or use camera mode and make a fist."),
      );
      const a = el("a", "button primary", (won ? "Fight again" : "Fight the boss") + " ↗");
      a.href = "../arcade/monster-punch.html?level=" + stage;
      card.append(a);
      cards.closest("section").after(card);
    }
  }
  const list = document.getElementById("level-reflections"),
    refl = (Array.isArray(V.load().reflections) ? V.load().reflections : []).filter((r) => r && r.stage === stage);
  if (!refl.length) list.textContent = "Finish a component to add your first reflection.";
  refl
    .slice()
    .reverse()
    .forEach((r) => {
      const row = el("div", "ref-row");
      row.append(el("b", "", r.topic + " · " + r.technique), el("small", "", " · " + new Date(r.date).toLocaleDateString() + " · confidence " + r.confidence + "/5"), el("p", "", r.text));
      list.append(row);
    });
  if (s.done === 4) setTimeout(() => V.celebrate(stage), 500);
})();
