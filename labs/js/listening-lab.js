/* Smart MUET · Listening CLUE Lab content and drills. Engine: lab-core.js
   Audio is produced by the device's built-in speech voice (Web Speech API).
   [[double brackets]] mark the clue words highlighted in transcripts. */
(() => {
  "use strict";
  const { model, extracts, matchOptions, matchItems, mcq } = window.SMHBank.listening;
  const plain = (lines) => lines.map(([w, t]) => [w, t.replace(/\[\[|\]\]/g, "")]);

  let api;
  const plays = { d3: 0, p3: 0, q4: 0, q5: 0 };
  let exam = false;

  SMHLab({
    key: "smh.lab.listening.v1",
    skill: "listening",
    name: "Listening CLUE Lab",
    technique: "CLUE",
    drillCount: 3,
    fullModel: model.map(([w, t]) => w + ": " + t).join("\n"),
    modelVoice: model,
    parts: [
      [
        "Check",
        "The question asks WHEN, so I predict a day and time. All three options will probably be mentioned, so I expect distractors.",
        "Read the question and options first. Decide what kind of answer you need before the audio starts.",
      ],
      [
        "Listen",
        "Signposts: “That was the plan, but…”, “Wednesday’s no good”, “What about…?”, “Let’s make it then.”",
        "Contrast words, refusals and confirmations tell you when an option is cancelled or chosen.",
      ],
      [
        "Understand",
        "The final agreement is Thursday afternoon. Ravi confirms it in the last line.",
        "Follow the whole exchange. The answer is the final decision, not the first thing you hear.",
      ],
      [
        "Eliminate",
        "Tuesday: cancelled because the lab is booked. Wednesday: rejected because Hana has a presentation. So C, Thursday afternoon.",
        "Reject each distractor with a reason from the audio. If you cannot say why it is wrong, listen again.",
      ],
    ],
    techniques: ["CLUE · Check, Listen, Understand, Eliminate", "I need to try CLUE again"],
    checks: [
      "I read the questions and predicted the answer type before listening.",
      "I noticed contrast signposts such as but, actually and in the end.",
      "I waited for each speaker’s final meaning before choosing.",
      "I could explain why each distractor was wrong.",
      "I used the second listening to confirm, not to start again.",
    ],
    traps: [
      "Chose an option just because I heard the word",
      "Missed a contrast signpost",
      "Confused one speaker with another",
      "Did not predict before listening",
      "Lost focus during the second play",
      "Answered from general knowledge",
    ],
    setNames: { listening: "Part-time jobs + dialogues" },
    topicLabel: () => "Part-time jobs and short dialogues",
    exportExtra: (s) => ["MY KEYWORDS", typeof s.keywords === "string" ? s.keywords : "", ""],
    init(a) {
      api = a;
      const { $, $$, el, state, save, feedback, drill, choiceDrill, speak, stopVoice, logResult } = api;

      /* Drill 1: predict answer type */
      const types = ["a time", "a place", "a reason", "a feeling or opinion"];
      const predict = [
        ["What time does the shuttle bus leave?", 0],
        ["Where will the careers talk take place?", 1],
        ["Why is Aina late for class?", 2],
        ["How does the speaker feel about the new timetable?", 3],
      ];
      predict.forEach(([q], i) => {
        const label = el("label", "", q),
          sel = el("select");
        label.htmlFor = "predict-" + i;
        sel.id = "predict-" + i;
        sel.append(el("option", "", "Choose the answer type"));
        sel.firstChild.value = "";
        types.forEach((t, j) => {
          const o = el("option", "", t);
          o.value = j;
          sel.append(o);
        });
        $("#predict-rows").append(label, sel);
      });
      $("#check-predict").onclick = () => {
        const vals = predict.map((_, i) => $("#predict-" + i).value);
        if (vals.includes("")) {
          feedback("#predict-feedback", "Choose an answer type for every question.", false);
          return;
        }
        const wrong = predict.filter(([, ans], i) => +vals[i] !== ans).length,
          correct = wrong === 0;
        feedback(
          "#predict-feedback",
          correct
            ? "All correct. What time → a time; Where → a place; Why → a reason; How does … feel → a feeling or opinion. Predicting tells your ears what to catch."
            : wrong + " not yet right. The question word decides the type: What time = time, Where = place, Why = reason, How does someone feel = feeling or opinion.",
          correct,
        );
        drill("predict", correct, "Listening drill: predict the answer type");
      };

      /* Drill 2: signpost tap */
      const phrases = ["I was going to", "take the bus,", "but in the end", "my brother", "drove me", "because it was raining."];
      let picked = null;
      phrases.forEach((t, i) => {
        const b = el("button", "", t);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.onclick = () => {
          picked = i;
          $$("#signpost-text button").forEach((x, j) => x.setAttribute("aria-pressed", String(j === i)));
        };
        $("#signpost-text").append(b);
      });
      $("#check-signpost").onclick = () => {
        if (picked === null) {
          feedback("#signpost-feedback", "Tap a phrase first.", false);
          return;
        }
        const correct = picked === 2;
        feedback(
          "#signpost-feedback",
          correct
            ? "Yes. “But in the end” cancels the bus plan and introduces what really happened: her brother drove her. The bus is the distractor."
            : "Look for the phrase that cancels the first plan. “But in the end” signals the real answer; “take the bus” is only what she intended.",
          correct,
        );
        drill("signpost", correct, "Listening drill: signpost");
      };

      /* Players */
      function setPlays(id) {
        const n = plays[id],
          out = $("#plays-" + id);
        if (!out) return;
        out.textContent = exam ? "Play " + Math.min(n, 2) + " of 2" : n ? "Played " + n + (n === 1 ? " time" : " times") : "Not played yet";
        const btn = $('[data-play="' + id + '"]');
        if (btn) btn.disabled = exam && n >= 2;
      }
      async function play(id) {
        if (exam && plays[id] >= 2) return;
        plays[id]++;
        setPlays(id);
        const player = $("#player-" + id);
        $$(".player").forEach((p) => p.classList.remove("playing"));
        player.classList.add("playing");
        const ok = await speak(plain(extracts[id]), { rate: +($("#voice-rate")?.value || 0.95) });
        player.classList.remove("playing");
        setPlays(id);
        if (!ok)
          $("#voice-help").textContent =
            "Device voice is unavailable or was stopped. Ask a partner to read the transcript twice, or try another browser.";
      }
      $$("[data-play]").forEach((b) => (b.onclick = () => play(b.dataset.play)));
      $("#stop-audio").onclick = () => {
        stopVoice();
        $$(".player").forEach((p) => p.classList.remove("playing"));
      };
      api.onLeave(() => {
        $$(".player").forEach((p) => p.classList.remove("playing"));
      });
      function transcript(lines, mount) {
        mount.replaceChildren();
        lines.forEach(([w, t]) => {
          const p = el("p");
          p.append(el("b", "", w + ": "));
          t.split(/(\[\[.*?\]\])/).forEach((part) => {
            if (part.startsWith("[[")) p.append(el("mark", "", part.slice(2, -2)));
            else if (part) p.append(document.createTextNode(part));
          });
          mount.append(p);
        });
      }
      transcript(extracts.d3, $("#transcript-d3"));

      /* Drill 3 */
      choiceDrill({
        id: "eliminate",
        name: "d3",
        answer: 1,
        button: "#check-d3",
        out: "#d3-feedback",
        label: "Listening drill: eliminate distractor",
        right: "Yes. She got “halfway” (so A is wrong) and will “read the rest on the train”. Her battery died; the laptop is not lost (C).",
        wrong: "Listen for what happens next: “I’ll read the rest on the train.” Halfway means she has not finished, and a flat battery is not a lost laptop.",
      });

      /* Mode toggle */
      function modeUI() {
        $("#mode-practice").setAttribute("aria-pressed", String(!exam));
        $("#mode-exam").setAttribute("aria-pressed", String(exam));
        Object.keys(plays).forEach(setPlays);
      }
      $("#mode-practice").onclick = () => {
        exam = false;
        modeUI();
      };
      $("#mode-exam").onclick = () => {
        exam = true;
        Object.keys(plays).forEach((k) => (plays[k] = 0));
        modeUI();
        $("#voice-help").textContent = "Exam-style: each extract plays twice, like the MUET Listening paper. Read the questions first.";
      };
      modeUI();

      /* You do: Part 3 match + Part 5 MCQs */
      matchOptions.forEach((t, i) => $("#match-key").append(el("li", "", String.fromCharCode(65 + i) + "  " + t)));
      const saved = state.answers.listening && typeof state.answers.listening === "object" ? state.answers.listening : {};
      const remember = (k, v) => {
        const a = state.answers.listening && typeof state.answers.listening === "object" ? state.answers.listening : {};
        a[k] = v;
        state.answers.listening = a;
        save();
      };
      matchItems.forEach((m, i) => {
        const wrap = el("div", "question-row"),
          label = el("label", "", i + 1 + ". " + m.speaker),
          sel = el("select", "match");
        label.htmlFor = "match-" + i;
        sel.id = "match-" + i;
        const first = el("option", "", "Choose A–E");
        first.value = "";
        sel.append(first);
        matchOptions.forEach((t, j) => {
          const o = el("option", "", String.fromCharCode(65 + j) + "  " + t);
          o.value = j;
          sel.append(o);
        });
        if (Number.isInteger(saved["m" + i])) sel.value = saved["m" + i];
        sel.onchange = () => remember("m" + i, sel.value === "" ? null : +sel.value);
        wrap.append(label, sel, el("p", "feedback", ""));
        $("#match-rows").append(wrap);
      });
      Object.entries(mcq).forEach(([id, item]) => {
        const fs = el("fieldset", "question");
        fs.append(el("legend", "", item.q), el("p", "hint small", "Hint: " + item.hint));
        item.options.forEach((t, j) => {
          const l = el("label"),
            inp = el("input");
          inp.type = "radio";
          inp.name = "ans-" + id;
          inp.value = j;
          inp.checked = saved[id] === j;
          inp.onchange = () => remember(id, j);
          l.append(inp, el("span", "", String.fromCharCode(65 + j) + "  " + t));
          fs.append(l);
        });
        fs.append(el("p", "feedback", ""));
        $("#" + id).append(fs);
      });
      const kw = $("#keywords");
      kw.value = typeof state.keywords === "string" ? state.keywords : "";
      kw.oninput = () => {
        state.keywords = kw.value;
        save();
      };

      function unlockTranscripts() {
        const box = $("#transcripts");
        box.replaceChildren();
        [
          ["Questions 1–3 · Part-time jobs", "p3"],
          ["Question 4", "q4"],
          ["Question 5", "q5"],
          ["Drill 3", "d3"],
        ].forEach(([title, id]) => {
          const t = el("div", "transcript");
          box.append(el("h3", "", title), t);
          transcript(extracts[id], t);
        });
        state.transcripts = true;
        save();
      }
      if (state.transcripts) unlockTranscripts();

      $("#check-set").onclick = () => {
        let score = 0,
          answered = 0;
        matchItems.forEach((m, i) => {
          const sel = $("#match-" + i),
            out = sel.parentElement.querySelector(".feedback");
          if (sel.value === "") {
            out.textContent = "Not answered yet.";
            out.className = "feedback retry";
            return;
          }
          answered++;
          const ok = +sel.value === m.answer;
          if (ok) score++;
          out.textContent = (ok ? "Correct. " : "Not quite: " + String.fromCharCode(65 + m.answer) + ". ") + m.why;
          out.className = "feedback " + (ok ? "correct" : "retry");
          logResult("p3-" + (i + 1), "Part-time jobs: " + m.speaker, ok);
        });
        Object.entries(mcq).forEach(([id, item]) => {
          const fs = $("#" + id + " fieldset"),
            chosen = fs.querySelector("input:checked"),
            out = fs.querySelector(".feedback");
          fs.querySelectorAll("label").forEach((l) => l.classList.remove("is-right", "is-wrong"));
          if (!chosen) {
            out.textContent = "Not answered yet.";
            out.className = "feedback retry";
            return;
          }
          answered++;
          const ok = +chosen.value === item.answer;
          if (ok) score++;
          fs.querySelectorAll("label")[item.answer].classList.add("is-right");
          if (!ok) chosen.parentElement.classList.add("is-wrong");
          out.textContent = (ok ? "Correct. " : "Not quite: " + String.fromCharCode(65 + item.answer) + ". ") + item.why;
          out.className = "feedback " + (ok ? "correct" : "retry");
          logResult(id, item.q, ok);
        });
        state.results.listening = { score, total: 5, date: new Date().toISOString() };
        save();
        feedback(
          "#set-feedback",
          answered < 5
            ? "You answered " + answered + " of 5. Answer every item, then check again."
            : "Practice score: " + score + " / 5. Transcripts are now open in Step 05. Find the clue for every item.",
          score === 5,
        );
        if (answered === 5) unlockTranscripts();
      };
      $("#retry-set").onclick = () => {
        state.answers.listening = {};
        save();
        $$("#match-rows select").forEach((s) => (s.value = ""));
        $$("#q4 input, #q5 input").forEach((i) => (i.checked = false));
        $$("#match-rows .feedback, #q4 .feedback, #q5 .feedback").forEach((f) => {
          f.textContent = "";
          f.className = "feedback";
        });
        $$("#q4 label, #q5 label").forEach((l) => l.classList.remove("is-right", "is-wrong"));
        Object.keys(plays).forEach((k) => (plays[k] = 0));
        modeUI();
        $("#set-feedback").textContent = "";
        $("#set-feedback").className = "feedback";
      };
    },
  });
})();
