/* Smart MUET · Writing PEEL Lab content and drills. Engine: lab-core.js
   PEEL = Point, Explain, Example, Link (aligned with the hub's Writing guide). */
(() => {
  "use strict";
  const t2Planner = [
    ["position", "My position (introduction)", "Agree / disagree / partly agree, and why in one line"],
    ["p1", "Body 1 · Point", "Topic sentence"],
    ["e1", "Body 1 · Explain + Example", "Why or how? A specific case"],
    ["p2", "Body 2 · Point", "Topic sentence"],
    ["e2", "Body 2 · Explain + Example", "Why or how? A specific case"],
    ["link", "Link / conclusion", "Restate your position in new words"],
  ];
  const tasks = {
    t2a: {
      name: "Task 2 · Internships",
      target: 250,
      mode: "t2",
      prompt:
        "<p><b>Task 2 · Extended writing · at least 250 words</b></p><p>Some people believe that all diploma and degree students should complete an internship before they graduate.</p><p>To what extent do you agree with this view? Support your answer with reasons and examples.</p>",
      hint: "Plan 5 minutes first. Introduction with your position → two PEEL paragraphs (Point, Explain, Example, Link) → a conclusion that restates your view. Keep 3 minutes to reread.",
      planner: t2Planner,
    },
    t2b: {
      name: "Task 2 · Online learning",
      target: 250,
      mode: "t2",
      prompt:
        "<p><b>Task 2 · Extended writing · at least 250 words</b></p><p>“Online learning is just as effective as face-to-face learning.”</p><p>Discuss. Support your answer with reasons and examples.</p>",
      hint: "A balanced answer can work: one PEEL paragraph for each side, then a conclusion that weighs them. Make sure your final position is clear.",
      planner: t2Planner,
    },
    t1: {
      name: "Task 1 · Email to Puan Salmah",
      target: 100,
      mode: "t1",
      prompt:
        "<p><b>Task 1 · Guided writing · at least 100 words</b></p><p>You received this email from your club adviser.</p><p><i>Dear members, the Leadership Club will run a one-day leadership workshop on Saturday, 14 November, in the main hall. Please reply to confirm whether you can attend. — Puan Salmah</i></p><p>Using <b>all</b> the notes below, write a reply in an appropriate style:</p><ul><li>accept and thank her</li><li>ask what to bring</li><li>suggest one topic for a session</li><li>offer to help on the day</li></ul>",
      hint: "Cover all four notes, in a sensible order. Use a formal greeting and closing (Dear Puan Salmah … Yours sincerely). PEEL is for Task 2; here, answer each note clearly.",
      planner: [
        ["n1", "Note 1 · Accept and thank", "Thank you for… I would be glad to…"],
        ["n2", "Note 2 · What to bring", "Could you let me know whether…"],
        ["n3", "Note 3 · Suggest a topic", "I would like to suggest… because…"],
        ["n4", "Note 4 · Offer help", "I would be happy to help with…"],
      ],
    },
  };
  const linkers = [
    "however", "for example", "for instance", "therefore", "moreover", "furthermore",
    "in addition", "in conclusion", "as a result", "firstly", "secondly", "on the other hand",
    "nevertheless", "consequently", "to conclude", "although", "because",
  ];
  const countWords = (t) => (t.trim().match(/\S+/g) || []).length;

  SMHLab({
    key: "smh.lab.writing.v1",
    skill: "writing",
    name: "Writing PEEL Lab",
    technique: "PEEL",
    drillCount: 3,
    parts: [
      [
        "Point",
        "Compulsory community service can help students develop practical teamwork skills.",
        "The topic sentence answers the question with one focused idea.",
      ],
      [
        "Explain",
        "Many service projects require students to plan tasks, share responsibilities and solve problems with people from different backgrounds, which are skills employers value.",
        "Explain why or how the point is true. This is where most marks for development come from.",
      ],
      [
        "Example",
        "For instance, a group organising a beach clean-up in Port Dickson must arrange transport, divide the shoreline into sections and keep volunteers safe.",
        "A specific, realistic case proves the explanation. Name who, what and how.",
      ],
      [
        "Link",
        "Therefore, making community service part of the programme gives every student a real chance to practise the teamwork they will need at work.",
        "Return to the question so the reader sees how the paragraph supports your position.",
      ],
    ],
    techniques: ["PEEL · Point, Explain, Example, Link", "I need to try PEEL again"],
    checks: [
      "Task fulfilment: I answered the whole question (Task 1: every note).",
      "Organisation: my paragraphs follow a logical order with clear linkers.",
      "Development: each body paragraph has an explanation and a specific example.",
      "Structure: I checked sentence boundaries, verb forms and agreement.",
      "Lexis: I used precise words in an appropriate register and checked spelling.",
      "Length: I reached the minimum word count.",
    ],
    timerModes: {
      t2: ["Task 2 · 50 minutes", 3000000],
      t1: ["Task 1 · 25 minutes", 1500000],
      sprint: ["Paragraph sprint · 12 minutes", 720000],
    },
    topicLabel: () => tasks[document.querySelector("#task-choice").value].name,
    exportExtra: (s) =>
      Object.entries(tasks).flatMap(([id, t]) => [
        t.name.toUpperCase(),
        "PLAN",
        ...t.planner.map(([k, label]) => label + ": " + (s.plans[id]?.[k] || "")),
        "DRAFT (" + countWords(s.drafts[id] || "") + " words)",
        s.drafts[id] || "",
        "",
      ]).concat(["SENTENCE UPGRADE", "Before: " + (s.upgradeBefore || ""), "After: " + (s.upgradeAfter || ""), ""]),
    init(api) {
      const { $, el, state, save, feedback, sequenceDrill, choiceDrill, download } = api;

      /* Drill 1: order the paragraph */
      const peel = [
        "Allowing smartphones in class can support learning when their use is guided.",
        "Students can quickly check a definition or open digital materials, which keeps a lesson moving instead of waiting for shared resources.",
        "For example, in a reading lesson, a lecturer can ask groups to look up unfamiliar terms and post them on a shared class board.",
        "Thus, with clear rules, smartphones become learning tools rather than distractions.",
      ];
      const order = [2, 0, 3, 1]; // display order of cards
      sequenceDrill({
        id: "structure",
        label: "Writing drill: PEEL order",
        bank: "#sentence-bank",
        slots: "#peel-slots",
        status: "#selection-status",
        check: "#check-order",
        reset: "#reset-order",
        out: "#order-feedback",
        sentences: order.map((i) => peel[i]),
        answers: [1, 3, 0, 2],
        slotNames: ["P / Point", "E / Explain", "E / Example", "L / Link"],
        right: "Yes. The point states the position, the explanation shows how phones help, the reading-lesson example makes it concrete, and “Thus” links back to the argument.",
        wrong: "Start with the general claim (“Allowing smartphones…”). Explain with “Students can quickly…”, illustrate with “For example…”, and finish with “Thus…”. Tap a placed sentence to move it.",
      });
      choiceDrill({
        id: "explain",
        name: "explain",
        answer: 1,
        button: "#check-explain",
        out: "#explain-feedback",
        label: "Writing drill: develop the point",
        right: "Yes. It explains HOW a second language helps: employers serve regional customers, so multilingual staff can take on more. The other options are vague or personal.",
        wrong: "An explanation answers ‘why’ or ‘how’. “Very important nowadays” is vague, and personal enjoyment does not prove job prospects. Choose the sentence that shows the cause.",
      });
      choiceDrill({
        id: "tone",
        select: "#opening",
        answer: "b",
        button: "#check-opening",
        out: "#opening-feedback",
        label: "Writing drill: Task 1 tone",
        right: "Yes. A lecturer or adviser needs a formal greeting with her title, and the first line refers to the purpose of her email.",
        wrong: "Your reader is a club adviser, so use a formal register: “Dear Puan Salmah,” and a clear reference to her email. Save “Hey” and “Yo” for chatting with friends.",
      });

      /* You do: task, planner, draft */
      const choice = $("#task-choice"),
        draft = $("#draft");
      choice.value = tasks[state.task] ? state.task : "t2a";
      function wordUI() {
        const t = tasks[choice.value],
          n = countWords(draft.value);
        $("#word-count").textContent = n + (n === 1 ? " word" : " words");
        $("#word-bar").max = t.target;
        $("#word-bar").value = Math.min(n, t.target);
        $("#word-target").textContent = n >= t.target ? "✓ minimum reached" : "/ " + t.target + " minimum";
      }
      function renderTask() {
        const t = tasks[choice.value];
        $("#task-prompt").innerHTML = t.prompt; // static, authored content only
        $("#hint-box").textContent = t.hint;
        const planner = $("#planner");
        planner.replaceChildren();
        const plan = state.plans[choice.value] && typeof state.plans[choice.value] === "object" ? state.plans[choice.value] : {};
        t.planner.forEach(([k, label, ph]) => {
          const wrap = el("div"),
            l = el("label", "", label),
            ta = el("textarea");
          l.htmlFor = "plan-" + k;
          ta.id = "plan-" + k;
          ta.rows = 3;
          ta.maxLength = 1200;
          ta.placeholder = ph;
          ta.value = typeof plan[k] === "string" ? plan[k] : "";
          ta.oninput = () => {
            const p = state.plans[choice.value] && typeof state.plans[choice.value] === "object" ? state.plans[choice.value] : {};
            p[k] = ta.value;
            state.plans[choice.value] = p;
            save();
            $("#plan-status").textContent = api.isMemory() ? "Saved for this visit. Export before closing." : "Plan saved in this browser.";
          };
          wrap.append(l, ta);
          planner.append(wrap);
        });
        draft.value = typeof state.drafts[choice.value] === "string" ? state.drafts[choice.value] : "";
        const mode = $("#timer-mode");
        if (mode.value !== "sprint") {
          mode.value = t.mode;
          mode.dispatchEvent(new Event("change"));
        }
        $("#draft-feedback").textContent = "";
        $("#draft-feedback").className = "feedback";
        wordUI();
      }
      choice.onchange = () => {
        state.task = choice.value;
        save();
        renderTask();
      };
      draft.oninput = () => {
        state.drafts[choice.value] = draft.value;
        save();
        wordUI();
      };
      renderTask();

      $("#review-draft").onclick = () => {
        const t = tasks[choice.value],
          text = draft.value,
          n = countWords(text);
        if (!n) {
          feedback("#draft-feedback", "Write your draft first, then check it.", false);
          return;
        }
        const paras = text.split(/\n\s*\n/).filter((p) => p.trim()).length,
          lower = text.toLowerCase(),
          used = linkers.filter((w) => new RegExp("\\b" + w + "\\b").test(lower)),
          notes = [];
        notes.push(n + " words: " + (n >= t.target ? "minimum reached." : t.target - n + " more to reach the minimum."));
        if (choice.value === "t1") {
          notes.push(/\bdear\b/.test(lower) ? "Greeting found." : "No ‘Dear …’ greeting found.");
          notes.push(/(yours sincerely|yours faithfully|best regards|kind regards|regards)/.test(lower) ? "Formal closing found." : "Add a formal closing such as ‘Yours sincerely’.");
          notes.push("Now tick each note in your planner only if your email really covers it.");
        } else {
          notes.push(paras + " paragraph" + (paras === 1 ? "" : "s") + (paras >= 4 ? " — a clear structure." : " — aim for an introduction, two or more body paragraphs and a conclusion (leave a blank line between paragraphs)."));
          notes.push(used.length ? "Linkers used: " + used.join(", ") + "." : "No common linkers found. Add some to show how ideas connect.");
          notes.push("Find your Explain and Example sentences in each body paragraph. If one is missing, add it.");
        }
        notes.push("This quick check counts features only. It does not judge language or give a band.");
        feedback("#draft-feedback", notes.join(" "), n >= t.target);
        state.results[choice.value] = { score: Math.min(n, t.target), total: t.target, date: new Date().toISOString() };
        save();
      };
      $("#download-draft").onclick = () => {
        const t = tasks[choice.value];
        download(
          new Blob([t.name + "\n\n" + draft.value + "\n\n(" + countWords(draft.value) + " words)"], { type: "text/plain;charset=utf-8" }),
          "Smart-MUET-" + choice.value + "-draft.txt",
        );
      };
      api.onLeave((from) => {
        if (from === 3) state.drafts[choice.value] = draft.value;
      });

      /* Sentence upgrade */
      [["#upgrade-before", "upgradeBefore"], ["#upgrade-after", "upgradeAfter"]].forEach(([sel, k]) => {
        const ta = $(sel);
        ta.value = typeof state[k] === "string" ? state[k] : "";
        ta.oninput = () => {
          state[k] = ta.value;
          save();
        };
      });
    },
    setNames: { t2a: "Task 2 internships (words)", t2b: "Task 2 online learning (words)", t1: "Task 1 email (words)" },
  });
})();
