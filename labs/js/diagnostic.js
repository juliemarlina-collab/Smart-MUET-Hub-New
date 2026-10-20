/* Smart MUET · 10-minute check (diagnostic).
   Four short sets → skill shape (radar) → recommended start → personal 3-week plan.
   Saved in smh.diagnostic.v1; Home and Me read the plan from there. */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    KEY = "smh.diagnostic.v1",
    ROOT = "../";
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const SKILLS = {
    listening: { name: "Listening", tech: "CLUE", lab: "labs/listening-lab.html", guide: "guides/listening.html", page: 17 },
    speaking: { name: "Speaking", tech: "PREP", lab: "labs/speaking-lab.html", guide: "guides/speaking.html", page: 24 },
    reading: { name: "Reading", tech: "SCAN", lab: "labs/reading-lab.html", guide: "guides/reading.html", page: 31 },
    writing: { name: "Writing", tech: "PEEL", lab: "labs/writing-lab.html", guide: "guides/writing.html", page: 38 },
  };

  /* ---------- Items ---------- */
  const audio = {
    l1: [
      ["Aina", "Let’s meet at the library entrance at two."],
      ["Daniel", "The library’s closed for a talk today. How about the cafeteria?"],
      ["Aina", "Fine, the cafeteria then."],
    ],
    l2: [
      ["Man", "Could you help me move these chairs after class?"],
      ["Woman", "I’d love to, but I have a bus to catch at five."],
    ],
    l3: [["Woman", "I thought the new timetable would be a disaster, but actually it gives us longer lunch breaks."]],
  };
  const studyPods =
    "Last year, the polytechnic library replaced two rows of shelves with six glass study pods. Each pod seats four students and can be booked for up to two hours. At first, the pods were mostly used for group assignments. However, librarians soon noticed that many students booked them alone, simply to find a quiet space during busy exam weeks. To keep the pods available for groups, the library now allows individual bookings only after 5 p.m. Not everyone agrees with the rule. Some students say that evening slots are inconvenient because most buses leave campus at 6 p.m.";
  const sets = [
    {
      skill: "listening",
      title: "Listen and choose.",
      instructions: "Play each short recording (you can play it twice), then choose the best answer. The recordings use your device’s voice.",
      items: [
        { id: "l1", audio: "l1", q: "1. Where will the students meet?", options: ["At the library entrance", "In the cafeteria", "In the lecture hall"], answer: 1, why: "The library is closed, so Daniel suggests the cafeteria and Aina agrees: “Fine, the cafeteria then.” The library is the distractor.", skillTag: "Following a changed plan" },
        { id: "l2", audio: "l2", q: "2. What does the woman mean?", options: ["She will help him.", "She cannot help him.", "She will take the bus with him."], answer: 1, why: "“I’d love to, but…” is a polite refusal. The bus is her reason, not an invitation.", skillTag: "Implied meaning" },
        { id: "l3", audio: "l3", q: "3. How does the woman feel about the timetable now?", options: ["Worried", "Positive", "Angry"], answer: 1, why: "“I thought… disaster, but actually…” shows her view changed. Longer lunch breaks are a benefit.", skillTag: "Attitude after a contrast" },
      ],
    },
    {
      skill: "reading",
      title: "Read and choose.",
      instructions: "Read the short text, then answer four questions. Look for the evidence in the text.",
      context: studyPods,
      items: [
        { id: "r1", q: "1. How many students can use one pod at a time?", options: ["Two", "Four", "Six"], answer: 1, why: "“Each pod seats four students.” Six is the number of pods.", skillTag: "Scanning for detail" },
        { id: "r2", q: "2. Why did many students book the pods alone?", options: ["To work on group assignments", "To find a quiet place to study", "To avoid the librarians"], answer: 1, why: "“Simply to find a quiet space during busy exam weeks.” A is what the pods were first used for.", skillTag: "Paraphrase" },
        { id: "r3", q: "3. In the text, “the rule” refers to…", options: ["the two-hour booking limit", "individual bookings only after 5 p.m.", "replacing shelves with pods"], answer: 1, why: "“The rule” points back to the sentence before it: individual bookings are allowed only after 5 p.m.", skillTag: "Reference" },
        { id: "r4", q: "4. What can we infer about the students who object?", options: ["They depend on buses to get home.", "They prefer group work.", "They do not use the library."], answer: 0, why: "They find evening slots inconvenient because buses leave at 6 p.m., so they rely on buses. B and C are not supported.", skillTag: "Inference" },
      ],
    },
    {
      skill: "writing",
      title: "Choose the best fix.",
      instructions: "Each sentence has a problem. Choose the version that fixes it best.",
      items: [
        { id: "w1", q: "1. “She don’t like online classes.”", options: ["She doesn’t like online classes.", "She not like online classes.", "She didn’t likes online classes."], answer: 0, why: "With he, she or it, use “doesn’t” + base verb.", skillTag: "Grammar: subject–verb agreement" },
        { id: "w2", q: "2. In an email to your lecturer: “Hey, send me the notes ASAP.”", options: ["Send me the notes now, OK?", "Could you please send me the notes when you are free?", "Yo, notes please."], answer: 1, why: "A lecturer needs a polite, formal request. Task 1 is marked partly on appropriate register.", skillTag: "Register (Task 1)" },
        { id: "w3", q: "3. “I studied hard, I passed the test.”", options: ["I studied hard I passed the test.", "I studied hard, so I passed the test.", "I studied hard, passed I the test."], answer: 1, why: "Two full sentences need a linker or a full stop. “So” also shows the result.", skillTag: "Linking ideas" },
      ],
    },
    {
      skill: "speaking",
      title: "Rate yourself honestly.",
      instructions: "Tap the option that best describes you right now. There are no wrong answers.",
      rating: true,
      items: [
        { id: "s1", q: "I can speak for 2 minutes on a familiar topic without long pauses.", skillTag: "Fluency" },
        { id: "s2", q: "I can give a reason and a specific example for my opinion.", skillTag: "Developing ideas" },
        { id: "s3", q: "I can disagree politely and respond to what others say.", skillTag: "Interaction" },
        { id: "s4", q: "I can organise my ideas after 2 minutes of preparation.", skillTag: "Organisation" },
      ],
    },
  ];
  const RATINGS = ["Not yet", "Sometimes", "Usually", "Confidently"];

  /* ---------- Storage ---------- */
  let memory = false;
  function load() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null");
      return v && typeof v === "object" && !Array.isArray(v) ? v : null;
    } catch {
      memory = true;
      return null;
    }
  }
  function save(v) {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {
      memory = true;
      $("#storage-warning").hidden = false;
      $("#storage-warning").textContent = "Browser storage is unavailable. Your result and plan last for this visit only.";
    }
  }
  let record = load();
  let answers = {},
    current = 0;

  /* ---------- Motion ---------- */
  const media = matchMedia("(prefers-reduced-motion:reduce)");
  let motion = false;
  try {
    motion = localStorage.getItem("smh.review.motion") === "true";
  } catch {}
  function motionUI() {
    const off = motion || media.matches;
    document.documentElement.classList.toggle("no-motion", off);
    $("#motion").setAttribute("aria-pressed", String(off));
    $("#motion").textContent = off ? "Motion paused" : "Pause motion";
  }
  $("#motion").onclick = () => {
    motion = !motion;
    try {
      localStorage.setItem("smh.review.motion", String(motion));
    } catch {}
    motionUI();
  };
  motionUI();

  /* ---------- Voice ---------- */
  const plays = {};
  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    $$(".player").forEach((p) => p.classList.remove("playing"));
  }
  function speak(lines, player, done) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      $("#set-status").textContent = "Device voice is unavailable. Ask a partner to read the transcript under each player aloud, twice.";
      $("#set-status").className = "feedback retry";
      player.querySelector("details").hidden = false;
      return;
    }
    stopVoice();
    const voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)),
      who = [...new Set(lines.map((l) => l[0]))];
    player.classList.add("playing");
    lines.forEach(([w, t], i) => {
      const u = new SpeechSynthesisUtterance(t),
        v = voices[who.indexOf(w) % Math.max(1, Math.min(voices.length, 3))];
      if (v) u.voice = v;
      u.lang = v?.lang || "en-GB";
      u.rate = 0.95;
      u.pitch = who.indexOf(w) % 2 ? 1.1 : 0.95;
      if (i === lines.length - 1)
        u.onend = u.onerror = () => {
          player.classList.remove("playing");
          done && done();
        };
      speechSynthesis.speak(u);
    });
  }

  /* ---------- Panels ---------- */
  function show(id) {
    ["intro", "quiz", "result"].forEach((p) => ($("#" + p + "-panel").hidden = p !== id));
    $("#workspace").scrollIntoView({ behavior: document.documentElement.classList.contains("no-motion") ? "instant" : "smooth", block: "start" });
  }
  function mapUI() {
    $$("#set-map li").forEach((li, i) => {
      if (i === current && !$("#quiz-panel").hidden) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
      li.classList.toggle("done", isComplete(i) && (i < current || $("#quiz-panel").hidden));
    });
  }
  const isComplete = (i) => sets[i].items.every((it) => Number.isInteger(answers[it.id]));

  /* explanation straight after each answer, in a dialogue box; the first answer counts */
  function reveal(fs, it, fresh) {
    const chosen = answers[it.id], right = chosen === it.answer;
    fs.querySelectorAll("label").forEach((l, j) => {
      const inp = l.querySelector("input"); inp.disabled = true;
      l.classList.toggle("is-right", j === it.answer);
      l.classList.toggle("is-wrong", j === chosen && !right);
    });
    if (fs.querySelector(".qfb")) return;
    const box = el("div", "qfb " + (right ? "ok" : "no"));
    box.setAttribute("role", "status");
    const av = el("span", "cs-av", right ? "✓" : "✳"); av.setAttribute("aria-hidden", "true");
    const tx = el("div");
    tx.append(el("b", "", right ? "Correct! Here is why." : "Not quite. The answer is " + String.fromCharCode(65 + it.answer) + "."), el("p", "", it.why));
    const sk = SKILLS[sets[current].skill];
    if (sk) tx.append(el("span", "tag", "Technique · " + sk.tech + " · Learn it in the " + sk.name + " guide"));
    box.append(av, tx); fs.append(box);
    if (fresh) box.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function renderSet() {
    stopVoice();
    const s = sets[current];
    $("#set-count").textContent = "SET " + (current + 1) + " OF 4 · " + SKILLS[s.skill].name.toUpperCase();
    $("#set-progress").value = current;
    $("#set-label").textContent = SKILLS[s.skill].name.toUpperCase() + " / " + (s.rating ? "SELF-RATING" : s.items.length + " QUESTIONS");
    $("#set-title").textContent = s.title;
    $("#set-instructions").textContent = s.instructions;
    const ctx = $("#set-context");
    ctx.replaceChildren();
    if (s.context) {
      const box = el("div", "passage");
      box.append(el("h4", "", "Study pods"), el("p", "", s.context));
      ctx.append(box);
    }
    const mount = $("#set-items");
    mount.replaceChildren();
    s.items.forEach((it) => {
      if (s.rating) {
        const box = el("div", "rating"),
          group = el("div", "chips");
        group.setAttribute("role", "radiogroup");
        group.setAttribute("aria-label", it.q);
        box.append(el("p", "", it.q), group);
        RATINGS.forEach((r, i) => {
          const b = el("button", "chip", r);
          b.type = "button";
          b.setAttribute("role", "radio");
          b.setAttribute("aria-checked", String(answers[it.id] === i));
          b.setAttribute("aria-pressed", String(answers[it.id] === i));
          b.onclick = () => {
            answers[it.id] = i;
            group.querySelectorAll(".chip").forEach((c, j) => {
              c.setAttribute("aria-checked", String(j === i));
              c.setAttribute("aria-pressed", String(j === i));
            });
          };
          group.append(b);
        });
        mount.append(box);
        return;
      }
      const fs = el("fieldset", "question");
      fs.append(el("legend", "", it.q));
      if (it.audio) {
        plays[it.id] = plays[it.id] || 0;
        const player = el("div", "player"),
          b = el("button", "", "▷ Play recording"),
          wave = el("span", "wave"),
          count = el("span", "plays", plays[it.id] ? "Played " + plays[it.id] + " of 2" : "You can play it twice");
        wave.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 5; i++) wave.append(el("i"));
        b.type = "button";
        b.disabled = plays[it.id] >= 2;
        const t = el("details"),
          tr = el("div", "transcript");
        t.hidden = true;
        t.append(el("summary", "", "No sound? Show the transcript for a partner"));
        audio[it.audio].forEach(([w, x]) => {
          const p = el("p");
          p.append(el("b", "", w + ": "), document.createTextNode(x));
          tr.append(p);
        });
        t.append(tr);
        b.onclick = () => {
          const words = audio[it.audio].reduce((n, l) => n + l[1].split(" ").length, 0);
          setTimeout(() => {
            player.classList.remove("playing");
            b.disabled = plays[it.id] >= 2;
          }, words * 450 + 3000);
          plays[it.id]++;
          count.textContent = "Played " + plays[it.id] + " of 2";
          b.disabled = true;
          speak(audio[it.audio], player, () => (b.disabled = plays[it.id] >= 2));
        };
        player.append(b, wave, count, t);
        fs.append(player);
      }
      it.options.forEach((o, i) => {
        const l = el("label"),
          inp = el("input");
        inp.type = "radio";
        inp.name = "diag-" + it.id;
        inp.value = i;
        inp.checked = answers[it.id] === i;
        inp.onchange = () => { answers[it.id] = i; reveal(fs, it, true); };
        l.append(inp, el("span", "", String.fromCharCode(65 + i) + "  " + o));
        fs.append(l);
      });
      mount.append(fs);
      if (Number.isInteger(answers[it.id])) reveal(fs, it, false);
    });
    $("#set-back").disabled = current === 0;
    $("#set-next").textContent = current === 3 ? "See my result ✓" : "Next set →";
    $("#set-status").textContent = "";
    $("#set-status").className = "feedback";
    mapUI();
    $("#set-title").focus({ preventScroll: true });
  }
  $("#begin").onclick = () => {
    answers = {};
    current = 0;
    Object.keys(plays).forEach((k) => delete plays[k]);
    show("quiz");
    renderSet();
  };
  $("#set-back").onclick = () => {
    if (current > 0) {
      current--;
      renderSet();
    }
  };
  $("#set-next").onclick = () => {
    if (!isComplete(current)) {
      $("#set-status").textContent = "Answer every item in this set. If you are not sure, choose your best guess.";
      $("#set-status").className = "feedback retry shake";
      return;
    }
    if (current < 3) {
      current++;
      renderSet();
      $("#workspace").scrollIntoView({ behavior: "instant", block: "start" });
    } else finish();
  };

  /* ---------- Scoring and plan ---------- */
  function score() {
    const out = {};
    sets.forEach((s) => {
      if (s.rating) {
        const sum = s.items.reduce((a, it) => a + answers[it.id], 0);
        out[s.skill] = Math.round((sum / (s.items.length * 3)) * 100);
      } else {
        const right = s.items.filter((it) => answers[it.id] === it.answer).length;
        out[s.skill] = Math.round((right / s.items.length) * 100);
      }
    });
    return out;
  }
  function buildPlan(order) {
    const [a, b, c, d] = order.map((k) => ({ key: k, ...SKILLS[k] }));
    const step = (id, text, href) => ({ id, text, href });
    return [
      {
        title: "Week 1 · Learn it (I do → We do)",
        note: "Start with " + a.name + ".",
        items: [
          step("w1-book", "Read the " + a.name + " chapter in the Book", "book/index.html#page=" + a.page),
          step("w1-guide", "Learn " + a.tech + " in the " + a.name + " guide", a.guide),
          step("w1-lab", "Complete the " + a.name + " " + a.tech + " Lab, all six steps", a.lab),
          step("w1-next", "Read the " + b.name + " guide", b.guide),
        ],
      },
      {
        title: "Week 2 · Practise it (We do → You do)",
        note: "Add " + b.name + " and " + c.name + ".",
        items: [
          step("w2-lab-b", "Complete the " + b.name + " " + b.tech + " Lab", b.lab),
          step("w2-lab-c", "Complete the " + c.name + " " + c.tech + " Lab", c.lab),
          step("w2-review", "Clear one Review again set", "labs/review.html"),
          step("w2-vault", "Vault 1 · " + a.name + " (guided practice)", "vault/vault1-" + a.key + ".html"),
        ],
      },
      {
        title: "Week 3 · Apply it (You do alone)",
        note: "Round out with " + d.name + ", then check again.",
        items: [
          step("w3-lab-d", "Complete the " + d.name + " " + d.tech + " Lab", d.lab),
          step("w3-vault", "Vault 2 · " + b.name + " (less support)", "vault/vault2-" + b.key + ".html"),
          step("w3-mock", "Mock 1 · " + a.name + " under exam conditions", "vault/mock1-" + a.key + ".html"),
          step("w3-retake", "Retake this 10-minute check and compare", "labs/diagnostic.html"),
        ],
      },
    ];
  }
  function finish() {
    stopVoice();
    const scores = score(),
      priority = ["reading", "listening", "writing", "speaking"],
      order = Object.keys(SKILLS).sort((x, y) => scores[x] - scores[y] || priority.indexOf(x) - priority.indexOf(y));
    const prev = record;
    record = {
      date: new Date().toISOString(),
      scores,
      answers,
      order,
      start: order[0],
      plan: buildPlan(order),
      done: [],
      history: [...(prev?.history || []), ...(prev?.scores ? [{ date: prev.date, scores: prev.scores }] : [])].slice(-5),
    };
    save(record);
    $("#set-progress").value = 4;
    renderResult();
    show("result");
    mapUI();
    $("#result-title").focus({ preventScroll: true });
  }

  /* ---------- Result ---------- */
  function radar(scores) {
    const svg = $("#radar"),
      ns = "http://www.w3.org/2000/svg",
      cx = 160,
      cy = 160,
      R = 110,
      axes = [
        ["listening", -90],
        ["speaking", 0],
        ["reading", 90],
        ["writing", 180],
      ];
    [...svg.querySelectorAll("g")].forEach((g) => g.remove());
    const g = document.createElementNS(ns, "g");
    const pt = (deg, r) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
    [0.25, 0.5, 0.75, 1].forEach((k) => {
      const poly = document.createElementNS(ns, "polygon");
      poly.setAttribute("points", axes.map(([, d]) => pt(d, R * k).join(",")).join(" "));
      poly.setAttribute("class", "grid-line");
      g.append(poly);
    });
    axes.forEach(([key, d]) => {
      const line = document.createElementNS(ns, "line"),
        [x, y] = pt(d, R);
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      line.setAttribute("class", "axis");
      g.append(line);
      const t = document.createElementNS(ns, "text"),
        side = d === 0 || d === 180,
        [tx, ty] = pt(d, side ? R + 10 : R + 22);
      t.setAttribute("x", tx);
      t.setAttribute("y", side ? ty - 4 : d < 0 ? ty - 6 : ty + 2);
      t.setAttribute("text-anchor", d === 0 ? "start" : d === 180 ? "end" : "middle");
      const n1 = document.createElementNS(ns, "tspan"),
        n2 = document.createElementNS(ns, "tspan");
      n1.textContent = SKILLS[key].name;
      n2.textContent = scores[key] + "%";
      n2.setAttribute("x", tx);
      n2.setAttribute("dy", "15");
      n2.setAttribute("class", "pct");
      t.append(n1, n2);
      g.append(t);
    });
    const shape = document.createElementNS(ns, "polygon");
    shape.setAttribute("points", axes.map(([k, d]) => pt(d, Math.max(6, (R * scores[k]) / 100)).join(",")).join(" "));
    shape.setAttribute("class", "shape");
    g.append(shape);
    svg.append(g);
    $("#radar-desc").textContent = axes.map(([k]) => SKILLS[k].name + " " + scores[k] + " percent").join(", ");
  }
  function planUI() {
    const mount = $("#plan");
    mount.replaceChildren();
    const done = new Set(record.done || []);
    let total = 0;
    record.plan.forEach((w) => {
      const box = el("div", "week");
      box.append(el("h4", "", w.title), el("small", "", w.note));
      w.items.forEach((it) => {
        total++;
        const row = el("label", "plan-item" + (done.has(it.id) ? " done" : "")),
          cb = el("input"),
          a = el("a", "", it.text);
        cb.type = "checkbox";
        cb.checked = done.has(it.id);
        cb.setAttribute("aria-label", "Mark done: " + it.text);
        cb.onchange = () => {
          const d = new Set(record.done || []);
          cb.checked ? d.add(it.id) : d.delete(it.id);
          record.done = [...d];
          save(record);
          row.classList.toggle("done", cb.checked);
          $("#plan-progress").textContent = record.done.length + " of " + total + " steps done";
        };
        a.href = ROOT + it.href;
        row.append(cb, a);
        box.append(row);
      });
      mount.append(box);
    });
    $("#plan-progress").textContent = (record.done || []).length + " of " + total + " steps done";
  }
  function renderResult() {
    const s = record.scores,
      start = SKILLS[record.start];
    radar(s);
    const list = $("#score-list");
    list.replaceChildren();
    ["listening", "speaking", "reading", "writing"].forEach((k) => {
      const li = el("li", k === record.start ? "start" : ""),
        b = el("b"),
        p = el("progress");
      b.append(el("span", "", SKILLS[k].name + (k === "speaking" ? " (self-rated)" : "")), el("span", "", s[k] + "%"));
      p.max = 100;
      p.value = s[k];
      p.setAttribute("aria-label", SKILLS[k].name + " " + s[k] + " percent");
      li.append(b, p);
      list.append(li);
    });
    $("#start-skill").textContent = "Start with " + start.name + ".";
    const prev = record.history?.at(-1);
    $("#start-why").textContent =
      start.name +
      " had your lowest result in this check (" +
      s[record.start] +
      "%). Begin with the " +
      start.tech +
      " technique, then build up the other skills over three weeks." +
      (prev ? " Last check: " + ["listening", "speaking", "reading", "writing"].map((k) => SKILLS[k].name + " " + prev.scores[k] + "%").join(", ") + "." : "");
    $("#start-link").href = ROOT + start.guide;
    $("#start-link").textContent = "Open the " + start.name + " guide ↗";
    $("#result-date").textContent = "Checked " + new Date(record.date).toLocaleString() + ". Practice estimate only. It shows where to start, not your MUET band.";
    planUI();
    const ans = $("#answer-list");
    ans.replaceChildren();
    sets.filter((x) => !x.rating).forEach((set) =>
      set.items.forEach((it) => {
        const ok = record.answers?.[it.id] === it.answer,
          row = el("div", "answer-row");
        row.append(
          el("b", "", (ok ? "✓ " : "✗ ") + SKILLS[set.skill].name + " · " + it.q),
          el("p", "", "Answer: " + String.fromCharCode(65 + it.answer) + " " + it.options[it.answer] + ". " + it.why),
        );
        ans.append(row);
      }),
    );
  }
  $("#retake").onclick = () => $("#begin").click();
  $("#view-previous").onclick = () => {
    renderResult();
    show("result");
  };
  if (record?.scores && record.plan) {
    $("#previous-card").hidden = false;
    $("#previous-title").textContent = "Start with " + SKILLS[record.start].name + ".";
    $("#previous-copy").textContent =
      "Checked " + new Date(record.date).toLocaleDateString() + ". " + (record.done || []).length + " of 12 plan steps done. You can view your plan or retake the check.";
    $("#begin").textContent = "Retake the check ↗";
  }
  if (location.hash === "#plan" && record?.plan) {
    renderResult();
    show("result");
  }
  window.addEventListener("pagehide", stopVoice);
})();
