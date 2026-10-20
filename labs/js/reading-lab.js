/* Smart MUET · Reading SCAN Lab content and drills. Engine: lab-core.js */
(() => {
  "use strict";
  const { foodBank, passages } = window.SMHBank.reading;

  SMHLab({
    key: "smh.lab.reading.v1",
    skill: "reading",
    name: "Reading SCAN Lab",
    technique: "SCAN",
    drillCount: 3,
    parts: [
      [
        "Study",
        "The question asks WHY volunteers prepare packs. I need a reason or purpose, not just a description of what happens.",
        "Study the question type before reading. A ‘why’ question needs a cause or purpose.",
      ],
      [
        "Circle",
        "Key meaning: ‘prepare packs in advance’ and ‘now’. The answer will be near those words, probably expressed differently.",
        "Circle the central idea and small qualifiers such as now, only, most and partly.",
      ],
      [
        "Analyse",
        "The sentence before says some students thought the new room was ‘too public’. Then: ‘To protect privacy, volunteers now prepare packs… so visitors can collect them quickly.’",
        "Read the sentence before and after the key words. Pronouns, reasons and contrasts often sit there.",
      ],
      [
        "Nail",
        "B, ‘to help visitors feel comfortable’, paraphrases protecting privacy. A is tempting because more students came, but the text links packs to privacy, not numbers. C is never mentioned.",
        "Choose the option the text supports, then say why each other option is wrong.",
      ],
    ],
    techniques: ["SCAN · Study, Circle, Analyse, Nail", "I need to try SCAN again"],
    checks: [
      "I identified the question type before reading.",
      "I located the exact sentence(s) that answer each question.",
      "I recognised answers written as paraphrases.",
      "I read the sentence before and after the key words.",
      "I explained why each wrong option was wrong.",
    ],
    traps: [
      "Word-match trap: chose an option that repeated a word",
      "Answered from my own knowledge",
      "Stopped reading too early",
      "Inference went beyond the text",
      "Missed a small word like ‘partly’ or ‘not’",
      "Ran out of time",
    ],
    timerModes: {
      standard: ["Standard · 8 minutes", 480000],
      challenge: ["Challenge · 5 minutes", 300000],
    },
    setNames: { repair: "Learning to Repair", micro: "Micro-volunteering" },
    topicLabel: () => passages[document.querySelector("#passage-choice").value].title,
    exportExtra: (s) => ["EVIDENCE NOTES", typeof s.evidence === "string" ? s.evidence : "", ""],
    init(api) {
      const { $, el, state, save, feedback, drill, choiceDrill, questionSet } = api;
      /* Drill 1: evidence hunt */
      let picked = null;
      const box = $("#evidence-text");
      foodBank.forEach((t, i) => {
        const b = el("button", "", t + " ");
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.onclick = () => {
          picked = i;
          box.querySelectorAll("button").forEach((x, j) => {
            x.setAttribute("aria-pressed", String(j === i));
            x.classList.remove("is-right");
          });
        };
        box.append(b);
      });
      $("#check-evidence").onclick = () => {
        if (picked === null) {
          feedback("#evidence-feedback", "Tap a sentence first.", false);
          return;
        }
        const correct = picked === 1;
        if (correct) box.querySelectorAll("button")[1].classList.add("is-right");
        feedback(
          "#evidence-feedback",
          correct
            ? "Yes. Organisers expected about twenty a week, but nearly eighty came within a month. The contrast between the two numbers is the evidence."
            : "Look for a comparison with what organisers expected. Sentence 1 gives the expectation (twenty); the next sentence shows the reality (nearly eighty).",
          correct,
        );
        drill("evidence", correct, "Reading drill: evidence hunt");
      };
      /* Drills 2–3 */
      choiceDrill({
        id: "paraphrase",
        name: "para",
        answer: 1,
        button: "#check-para",
        out: "#para-feedback",
        label: "Reading drill: paraphrase",
        right: "Yes. moving = relocated; larger room = bigger space. The meaning matches even though the words are different.",
        wrong: "Look for the same meaning in different words: ‘moving’ = relocating and ‘a larger room’ = a bigger space. ‘Smaller’ is the opposite; the cafeteria is only the location.",
      });
      choiceDrill({
        id: "reference",
        name: "ref",
        answer: 1,
        button: "#check-ref",
        out: "#ref-feedback",
        label: "Reading drill: reference",
        right: "Yes. ‘The change’ points back to the previous sentence: the move to a larger room beside the cafeteria. The next sentence confirms it with ‘the new location’.",
        wrong: "Reference words usually point back to the sentence just before. That sentence describes the move. ‘The new location’ in the following sentence confirms it.",
      });
      /* You do: passage + questions */
      const choice = $("#passage-choice");
      choice.value = passages[state.passage] ? state.passage : "repair";
      const notes = $("#evidence-note");
      notes.value = typeof state.evidence === "string" ? state.evidence : "";
      notes.oninput = () => {
        state.evidence = notes.value;
        save();
      };
      function renderPassage() {
        const p = passages[choice.value],
          box = $("#passage");
        box.replaceChildren(el("h4", "", p.title));
        p.text.forEach((t, i) => {
          const para = el("p", "", t);
          para.prepend(el("b", "", i + 1 + "  "));
          box.append(para);
        });
        questionSet({
          mount: "#questions",
          setId: choice.value,
          questions: p.questions,
          check: "#check-set",
          retry: "#retry-set",
          out: "#set-feedback",
        });
        const show = state.hints !== false;
        document.querySelectorAll(".hint").forEach((h) => (h.hidden = !show));
        $("#set-feedback").textContent = "";
        $("#set-feedback").className = "feedback";
      }
      choice.onchange = () => {
        state.passage = choice.value;
        save();
        renderPassage();
      };
      renderPassage();
    },
  });
})();
