/* Smart MUET · shared engine for the Reading, Listening and Writing labs.
   Each lab page calls SMHLab({...}) with its own content and drill wiring.
   The Speaking PREP Lab keeps its original script (speaking-lab.js). */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    safeText = (v, d = "") => (typeof v === "string" ? v : d),
    REVIEW_KEY = "smh.review.queue.v1",
    DAY = 86400000;

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  window.SMHLab = function (cfg) {
    let state = {},
      memory = false;
    try {
      state = JSON.parse(localStorage.getItem(cfg.key) || "{}") || {};
    } catch {
      memory = true;
    }
    if (typeof state !== "object" || Array.isArray(state)) state = {};
    const obj = (x) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});
    state.plans = obj(state.plans);
    state.drafts = obj(state.drafts);
    state.drills = obj(state.drills);
    state.answers = obj(state.answers);
    state.results = obj(state.results);
    state.reflections = Array.isArray(state.reflections)
      ? state.reflections.filter((x) => x && typeof x.text === "string")
      : [];
    state.checks = Array.isArray(state.checks) ? state.checks : [];
    state.traps = Array.isArray(state.traps) ? state.traps : [];

    let step = 0;
    const leaveHandlers = [];

    function warning() {
      if (!memory) return;
      const w = $("#storage-warning");
      w.hidden = false;
      w.textContent =
        "Browser storage is unavailable. Your work lasts for this visit only. Export your record before closing.";
    }
    function save() {
      try {
        localStorage.setItem(cfg.key, JSON.stringify(state));
      } catch {
        memory = true;
      }
      warning();
    }
    warning();

    /* ---------- Review again queue (shared across labs) ---------- */
    function logResult(id, label, correct) {
      let q = [];
      try {
        q = JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
        if (!Array.isArray(q)) q = [];
      } catch {
        return;
      }
      const fullId = cfg.skill + ":" + id,
        found = q.find((x) => x && x.id === fullId);
      if (!correct) {
        if (found) {
          found.misses = (found.misses || 1) + 1;
          found.due = new Date(Date.now() + 7 * DAY).toISOString();
          found.last = new Date().toISOString();
        } else
          q.push({
            id: fullId,
            skill: cfg.skill,
            source: cfg.name,
            label,
            misses: 1,
            last: new Date().toISOString(),
            due: new Date(Date.now() + 3 * DAY).toISOString(),
          });
        try {
          localStorage.setItem(REVIEW_KEY, JSON.stringify(q));
        } catch {}
      }
    }

    /* ---------- Steps ---------- */
    function stopVoice() {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      $$("[data-voice-button]").forEach((b) => (b.disabled = false));
    }
    function showStep(n, focus = true) {
      if (n < 0 || n > 5) return;
      if (step !== n) {
        stopVoice();
        leaveHandlers.forEach((fn) => fn(step, n));
      }
      step = n;
      $$("[data-panel]").forEach((p) => (p.hidden = +p.dataset.panel !== n));
      $$("[data-step]").forEach((b) => {
        if (+b.dataset.step === n) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
      $("#previous").disabled = n === 0;
      $("#next").disabled = n === 5;
      $("#step-status").textContent = "Step " + (n + 1) + " of 6";
      if (n === 5) renderSummary();
      try {
        history.replaceState(null, "", "#step-" + (n + 1));
      } catch {}
      if (focus) {
        $("#workspace").scrollIntoView({
          behavior: document.documentElement.classList.contains("no-motion")
            ? "instant"
            : "smooth",
          block: "start",
        });
        const h = $('[data-panel="' + n + '"] h2');
        if (h) {
          h.tabIndex = -1;
          h.focus({ preventScroll: true });
        }
      }
    }
    $$("[data-step]").forEach((b) => (b.onclick = () => showStep(+b.dataset.step)));
    $$("[data-next]").forEach((b) => (b.onclick = () => showStep(+b.dataset.next)));
    $("#previous").onclick = () => showStep(step - 1);
    $("#next").onclick = () => showStep(step + 1);

    /* ---------- Motion + 2D ---------- */
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    let motion = state.motion === true || media.matches;
    function motionUI() {
      const off = motion || media.matches;
      document.documentElement.classList.toggle("no-motion", off);
      $("#motion").setAttribute("aria-pressed", String(off));
      $("#motion").textContent = off ? "Motion paused" : "Pause motion";
    }
    $("#motion").onclick = () => {
      motion = !motion;
      state.motion = motion;
      save();
      motionUI();
    };
    media.addEventListener("change", motionUI);
    motionUI();
    function flatUI() {
      document.documentElement.classList.toggle("flat", state.flat === true);
      $("#view-mode").setAttribute("aria-pressed", String(state.flat === true));
      $("#view-mode").textContent = state.flat ? "Use 3D view" : "Use 2D view";
    }
    $("#view-mode").onclick = () => {
      state.flat = !state.flat;
      save();
      flatUI();
    };
    flatUI();

    /* ---------- I do: model ---------- */
    const parts = cfg.parts;
    function renderModel(n) {
      const box = $("#model-card");
      box.replaceChildren();
      box.append(
        el("span", "label", cfg.technique + " / " + parts[n][0].toUpperCase()),
        el("p", "", parts[n][1]),
        el("p", "small", parts[n][2]),
      );
      $$("[data-model]").forEach((b) =>
        b.setAttribute("aria-pressed", String(+b.dataset.model === n)),
      );
    }
    $$("[data-model]").forEach(
      (b) =>
        (b.onclick = () => {
          showStep(1);
          renderModel(+b.dataset.model);
        }),
    );
    renderModel(0);

    /* ---------- Device voice ---------- */
    let voices = [];
    function loadVoices() {
      if (!("speechSynthesis" in window)) return;
      voices = speechSynthesis
        .getVoices()
        .filter((v) => /^en(-|_|$)/i.test(v.lang));
    }
    loadVoices();
    if ("speechSynthesis" in window)
      speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    function speak(lines, opts = {}) {
      return new Promise((resolve) => {
        if (
          !("speechSynthesis" in window) ||
          !("SpeechSynthesisUtterance" in window)
        ) {
          resolve(false);
          return;
        }
        stopVoice();
        const speakers = [...new Set(lines.map((l) => l[0]))];
        const gb = voices.filter((v) => /GB|AU|IN|IE/i.test(v.lang)),
          us = voices.filter((v) => /US|CA/i.test(v.lang)),
          pool = [gb[0] || voices[0], us[0] || voices[1] || voices[0], gb[1] || us[1] || voices[2] || voices[0]];
        let i = 0;
        const next = () => {
          if (i >= lines.length) {
            resolve(true);
            return;
          }
          const [who, text] = lines[i++],
            u = new SpeechSynthesisUtterance(text),
            v = pool[speakers.indexOf(who) % pool.length];
          if (v) u.voice = v;
          u.lang = v?.lang || "en-GB";
          u.rate = opts.rate || 0.92;
          u.pitch = speakers.indexOf(who) % 2 ? 1.1 : 0.95;
          u.onend = next;
          u.onerror = () => resolve(false);
          speechSynthesis.speak(u);
        };
        next();
      });
    }
    if ($("#full-model"))
      $("#full-model").textContent = cfg.fullModel || parts.map((p) => p[1]).join(" ");
    if ($("#narrate")) {
      $("#narrate").onclick = async () => {
        $("#voice-status").textContent = "Playing with your device voice…";
        $("#narrate").disabled = true;
        const ok = await speak(cfg.modelVoice || [["A", $("#full-model").textContent]]);
        $("#narrate").disabled = false;
        $("#voice-status").textContent = ok
          ? "Finished. Read the explanation for each letter."
          : "Device voice is unavailable or stopped. Use the written model instead.";
      };
      $("#stop-narration").onclick = () => {
        stopVoice();
        $("#voice-status").textContent = "Device narration stopped.";
      };
    }

    /* ---------- Start: goal ---------- */
    if ($("#goal")) {
      $("#goal").value = safeText(state.goal, $("#goal").options[0].value);
      $("#goal").onchange = (e) => {
        state.goal = e.target.value;
        save();
      };
    }

    /* ---------- Drill helpers ---------- */
    function feedback(id, text, correct) {
      const p = $(id);
      p.textContent = text;
      p.className = "feedback " + (correct ? "correct" : "retry");
      p.classList.remove("pulse", "shake");
      void p.offsetWidth;
      p.classList.add(correct ? "pulse" : "shake");
    }
    function drillProgress() {
      const d = Object.values(state.drills),
        checked = d.filter((x) => x?.checked).length,
        correct = d.filter((x) => x?.correct).length;
      if ($("#drill-progress"))
        $("#drill-progress").textContent =
          checked +
          " of " +
          cfg.drillCount +
          " drills checked · " +
          correct +
          " currently correct. Read each explanation and retry any drill.";
    }
    function drill(id, correct, label) {
      state.drills[id] = { checked: true, correct };
      save();
      drillProgress();
      logResult("drill-" + id, label || cfg.name + " drill", correct);
    }
    drillProgress();

    function choiceDrill(o) {
      // o: {id, name, answer, button, out, right, wrong, label}
      const btn = $(o.button);
      btn.onclick = () => {
        const v = o.select
          ? { value: $(o.select).value }
          : $("input[name=" + o.name + "]:checked");
        if (!v || v.value === "") {
          feedback(o.out, "Choose an answer first.", false);
          return;
        }
        const correct = String(v.value) === String(o.answer);
        feedback(o.out, correct ? o.right : o.wrong, correct);
        drill(o.id, correct, o.label);
      };
    }

    /* ---------- Sequencing drill (tap or drag cards into slots) ---------- */
    function sequenceDrill(o) {
      // o: {bank, slots, status, check, reset, out, sentences, answers(slot->sentence index), slotNames, id, right, wrong}
      let selected = null,
        slots = o.answers.map(() => null);
      const render = () => {
        const bank = $(o.bank),
          targets = $(o.slots);
        bank.replaceChildren();
        targets.replaceChildren();
        o.sentences.forEach((t, i) => {
          if (slots.includes(i)) return;
          const b = el("button", "sentence", t);
          b.type = "button";
          b.dataset.sentence = i;
          b.draggable = true;
          b.setAttribute("aria-pressed", String(selected === i));
          b.onclick = () => select(i);
          b.ondragstart = (e) => {
            select(i);
            e.dataTransfer.setData("text/plain", String(i));
          };
          bank.append(b);
        });
        o.slotNames.forEach((name, i) => {
          const box = el("div", "slot"),
            b = el(
              "button",
              slots[i] === null ? "empty" : "",
              slots[i] === null ? "Place selected sentence here" : o.sentences[slots[i]],
            );
          b.type = "button";
          b.setAttribute("aria-label", name + ": " + b.textContent);
          b.onclick = () => {
            if (selected !== null) {
              const prev = slots.indexOf(selected);
              if (prev >= 0) slots[prev] = null;
              slots[i] = selected;
              selected = null;
              $(o.status).textContent = "Sentence placed. Choose another card.";
              $(o.out).textContent = "";
              render();
              $$(o.slots + " .slot button")[i].focus({ preventScroll: true });
            } else if (slots[i] !== null) {
              const value = slots[i];
              slots[i] = null;
              selected = value;
              render();
              $(o.bank + ' [data-sentence="' + value + '"]').focus({ preventScroll: true });
              $(o.status).textContent =
                "Sentence returned and selected. Choose a destination.";
            } else $(o.status).textContent = "Choose a sentence card first.";
          };
          box.ondragover = (e) => e.preventDefault();
          box.ondrop = (e) => {
            e.preventDefault();
            const v = Number(e.dataTransfer.getData("text/plain"));
            if (Number.isInteger(v) && v >= 0 && v < o.sentences.length) {
              selected = v;
              b.click();
            }
          };
          box.append(el("b", "", name), b);
          targets.append(box);
        });
      };
      const select = (i) => {
        selected = i;
        render();
        $(o.bank + ' [data-sentence="' + i + '"]').focus({ preventScroll: true });
        $(o.status).textContent = "Selected. Now choose its place.";
      };
      render();
      $(o.check).onclick = () => {
        if (slots.includes(null)) {
          feedback(o.out, "Place every sentence before checking.", false);
          return;
        }
        const correct = slots.every((v, i) => v === o.answers[i]);
        feedback(o.out, correct ? o.right : o.wrong, correct);
        drill(o.id, correct, o.label);
      };
      $(o.reset).onclick = () => {
        slots = o.answers.map(() => null);
        selected = null;
        render();
        $(o.out).textContent = "";
        $(o.status).textContent = "Choose a sentence to place.";
      };
    }

    /* ---------- Multiple-choice question set (You do) ---------- */
    function questionSet(o) {
      // o: {mount, setId, questions:[{q, options[], answer, why, hint, label}], onCheck, check, retry, out}
      const mount = $(o.mount);
      mount.replaceChildren();
      const saved = obj(state.answers[o.setId]);
      o.questions.forEach((item, qi) => {
        const fs = el("fieldset", "question");
        fs.dataset.q = qi;
        const lg = el("legend", "", qi + 1 + ". " + item.q);
        fs.append(lg);
        if (item.hint) {
          const h = el("p", "hint small", "Hint: " + item.hint);
          fs.append(h);
        }
        item.options.forEach((t, oi) => {
          const label = el("label"),
            input = el("input");
          input.type = "radio";
          input.name = o.setId + "-q" + qi;
          input.value = oi;
          input.checked = saved[qi] === oi;
          input.onchange = () => {
            const a = obj(state.answers[o.setId]);
            a[qi] = oi;
            state.answers[o.setId] = a;
            save();
          };
          label.append(input, el("span", "", String.fromCharCode(65 + oi) + "  " + t));
          fs.append(label);
        });
        fs.append(el("p", "feedback", ""));
        mount.append(fs);
      });
      function check(silent) {
        let score = 0,
          answered = 0;
        o.questions.forEach((item, qi) => {
          const fs = mount.querySelector('[data-q="' + qi + '"]'),
            chosen = fs.querySelector("input:checked"),
            out = fs.querySelector(".feedback");
          fs.querySelectorAll("label").forEach((l) => l.classList.remove("is-right", "is-wrong"));
          if (!chosen) {
            out.textContent = "Not answered yet.";
            out.className = "feedback retry";
            return;
          }
          answered++;
          const correct = +chosen.value === item.answer;
          if (correct) score++;
          fs.querySelectorAll("label")[item.answer].classList.add("is-right");
          if (!correct) chosen.parentElement.classList.add("is-wrong");
          out.textContent =
            (correct ? "Correct. " : "Not quite. The answer is " + String.fromCharCode(65 + item.answer) + ". ") +
            item.why;
          out.className = "feedback " + (correct ? "correct" : "retry");
          if (!silent) logResult(o.setId + "-q" + (qi + 1), item.label || item.q, correct);
        });
        if (!silent) {
          state.results[o.setId] = { score, total: o.questions.length, date: new Date().toISOString() };
          save();
        }
        $(o.out).textContent =
          answered < o.questions.length
            ? "You answered " + answered + " of " + o.questions.length + ". Answer every item, then check again."
            : "Practice score: " + score + " / " + o.questions.length + ". Read every explanation, including the ones you got right.";
        $(o.out).className = "feedback " + (score === o.questions.length ? "correct" : "retry");
        if (o.onCheck) o.onCheck(score, answered);
        return score;
      }
      $(o.check).onclick = () => check(false);
      $(o.retry).onclick = () => {
        state.answers[o.setId] = {};
        save();
        questionSet(o);
        $(o.out).textContent = "";
        $(o.out).className = "feedback";
      };
      return { check };
    }

    /* ---------- Hints toggle ---------- */
    if ($("#hint-toggle")) {
      const apply = (show) => {
        $$(".hint, #hint-box").forEach((h) => (h.hidden = !show));
        $("#hint-toggle").setAttribute("aria-expanded", String(show));
        $("#hint-toggle").textContent = show ? "Hide " + cfg.technique + " hints" : "Show " + cfg.technique + " hints";
      };
      let show = state.hints !== false;
      $("#hint-toggle").onclick = () => {
        show = !show;
        state.hints = show;
        save();
        apply(show);
      };
      cfg._applyHints = () => apply(show);
    }

    /* ---------- Timer ---------- */
    let timerHandle = null,
      timerEnd = 0,
      remaining = 0,
      running = false;
    const modes = cfg.timerModes || null;
    function duration() {
      return modes ? modes[$("#timer-mode").value][1] : 0;
    }
    function drawTime() {
      if (!modes) return;
      const seconds = Math.ceil(remaining / 1000),
        total = duration() / 1000;
      $("#time").textContent =
        String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
      const ring = $(".timer-ring");
      ring.classList.toggle("amber", seconds <= 30 && seconds > 10);
      ring.classList.toggle("urgent", seconds <= 10);
      ring.style.setProperty("--fill", total ? (1 - seconds / total) * 360 + "deg" : "0deg");
    }
    function pauseTimer() {
      if (!running) return;
      remaining = Math.max(0, timerEnd - Date.now());
      running = false;
      clearInterval(timerHandle);
      $("#timer-start").textContent = "Resume timer";
      $("#timer-status").textContent = "Paused. Continue when you are ready.";
      drawTime();
    }
    function resetTimer() {
      if (!modes) return;
      clearInterval(timerHandle);
      running = false;
      remaining = duration();
      drawTime();
      $("#timer-start").textContent = "Start timer";
      $("#timer-status").textContent = "Ready: " + modes[$("#timer-mode").value][0] + ". This is a practice timer.";
    }
    if (modes) {
      const sel = $("#timer-mode");
      Object.entries(modes).forEach(([k, v]) => {
        const op = el("option", "", v[0]);
        op.value = k;
        sel.append(op);
      });
      sel.onchange = resetTimer;
      $("#timer-reset").onclick = resetTimer;
      $("#timer-start").onclick = () => {
        if (running) {
          pauseTimer();
          return;
        }
        if (remaining <= 0) remaining = duration();
        timerEnd = Date.now() + remaining;
        running = true;
        $("#timer-start").textContent = "Pause timer";
        $("#timer-status").textContent = "Timer running. Keep going.";
        timerHandle = setInterval(() => {
          remaining = Math.max(0, timerEnd - Date.now());
          drawTime();
          if (remaining === 0) {
            clearInterval(timerHandle);
            running = false;
            $("#timer-start").textContent = "Start again";
            $("#timer-status").textContent = "Time is up. Finish your sentence, then check your work.";
          }
        }, 250);
      };
      resetTimer();
      leaveHandlers.push((from) => {
        if (from === 3) pauseTimer();
      });
    }

    /* ---------- Check & improve ---------- */
    (cfg.checks || []).forEach((t, i) => {
      const label = el("label", "check-label"),
        input = el("input");
      input.type = "checkbox";
      input.checked = state.checks.includes(i);
      input.onchange = () => {
        state.checks = state.checks.filter((n) => n !== i);
        if (input.checked) state.checks.push(i);
        save();
      };
      label.append(input, el("span", "", t));
      $("#self-checks").append(label);
    });
    if ($("#traps"))
      (cfg.traps || []).forEach((t, i) => {
        const b = el("button", "chip", t);
        b.type = "button";
        b.setAttribute("aria-pressed", String(state.traps.includes(i)));
        b.onclick = () => {
          const on = !state.traps.includes(i);
          state.traps = state.traps.filter((n) => n !== i);
          if (on) state.traps.push(i);
          b.setAttribute("aria-pressed", String(on));
          save();
        };
        $("#traps").append(b);
      });
    for (const id of ["improvement", "comparison", "next-change"]) {
      const input = $("#" + id);
      if (!input) continue;
      input.value = safeText(state[id]);
      input.oninput = () => {
        state[id] = input.value;
        save();
      };
    }

    /* ---------- Reflect ---------- */
    const techSel = $("#technique");
    cfg.techniques.forEach((t) => techSel.append(el("option", "", t)));
    techSel.value = safeText(state.technique);
    techSel.onchange = (e) => {
      state.technique = e.target.value;
      save();
    };
    $("#confidence").value = [1, 2, 3, 4, 5].includes(+state.confidence) ? state.confidence : 3;
    $("#confidence-value").textContent = $("#confidence").value;
    $("#confidence").oninput = (e) => {
      state.confidence = +e.target.value;
      $("#confidence-value").textContent = e.target.value;
      save();
    };
    function renderSummary() {
      const correct = Object.values(state.drills).filter((x) => x?.correct).length,
        results = Object.entries(state.results)
          .map(([k, v]) => (cfg.setNames?.[k] || k) + " " + v.score + "/" + v.total)
          .join(" · ");
      $("#summary").textContent =
        correct +
        "/" +
        cfg.drillCount +
        " guided drills correct · " +
        (results ? "Practice: " + results + " · " : "") +
        state.checks.length +
        "/" +
        (cfg.checks || []).length +
        " self-review items ticked · " +
        state.reflections.length +
        " reflection" +
        (state.reflections.length === 1 ? "" : "s") +
        " saved. These describe practice, not an exam band.";
      const list = $("#history-list");
      list.replaceChildren();
      if (!state.reflections.length) {
        list.textContent = "Your saved reflections will appear here.";
        return;
      }
      state.reflections
        .slice()
        .reverse()
        .forEach((r) => {
          const a = el("article", "history-entry");
          a.append(
            el("b", "", r.topic || cfg.name),
            el("small", "", " · " + new Date(r.date).toLocaleString() + " · Confidence " + r.confidence + "/5"),
            el("p", "", r.text),
          );
          list.append(a);
        });
    }
    renderSummary();
    $("#reflection-form").onsubmit = (e) => {
      e.preventDefault();
      const text = $("#next-change").value.trim(),
        technique = techSel.value,
        topic = cfg.topicLabel ? cfg.topicLabel() : cfg.name;
      if (!technique) {
        $("#reflection-status").textContent = "Choose the technique that helped most.";
        techSel.focus();
        return;
      }
      if (!text) {
        $("#reflection-status").textContent = "Write one specific action for your next attempt.";
        $("#next-change").focus();
        return;
      }
      const last = state.reflections.at(-1);
      if (last?.text === text && last?.topic === topic && last?.confidence === +$("#confidence").value) {
        $("#reflection-status").textContent =
          "This reflection is already saved. Try another task before adding a new one.";
        return;
      }
      state.reflections.push({
        date: new Date().toISOString(),
        skill: cfg.skill,
        topic,
        text,
        technique,
        confidence: +$("#confidence").value,
        goal: $("#goal") ? $("#goal").value : "",
      });
      save();
      renderSummary();
      $("#reflection-status").textContent = memory
        ? "Reflection kept for this visit. Export your record."
        : "Reflection saved. It also appears on your Me page.";
      const status = $("#reflection-status");
      status.classList.remove("pulse");
      void status.offsetWidth;
      status.classList.add("pulse");
    };

    /* ---------- Export + reset ---------- */
    function download(blob, name) {
      const url = URL.createObjectURL(blob),
        a = el("a");
      a.href = url;
      a.download = name;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
    $("#export-record").onclick = () => {
      const lines = [
        "SMART MUET · " + cfg.name.toUpperCase(),
        new Date().toLocaleString(),
        "GOAL: " + ($("#goal") ? $("#goal").value : ""),
        "",
        "GUIDED DRILLS",
        ...Object.entries(state.drills).map(([k, v]) => k + ": " + (v.correct ? "correct" : "review needed")),
        "",
        "PRACTICE SETS",
        ...Object.entries(state.results).map(
          ([k, v]) => (cfg.setNames?.[k] || k) + ": " + v.score + "/" + v.total + " (" + v.date + ")",
        ),
        "",
        ...(cfg.exportExtra ? cfg.exportExtra(state) : []),
        "SELF-REVIEW",
        ...(cfg.checks || []).map((t, i) => (state.checks.includes(i) ? "[x] " : "[ ] ") + t),
        ...(cfg.traps ? ["", "TRAPS I NOTICED", ...state.traps.map((i) => "- " + cfg.traps[i])] : []),
        "",
        "NEXT IMPROVEMENT",
        safeText(state.improvement),
        "SECOND ATTEMPT",
        safeText(state.comparison),
        "",
        "REFLECTIONS",
        ...state.reflections.flatMap((r) => [
          r.date + " · " + r.topic,
          r.technique,
          "Confidence " + r.confidence + "/5",
          r.text,
          "",
        ]),
        "Practice record only; no automatic band assessment.",
      ];
      download(
        new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }),
        "Smart-MUET-" + cfg.skill[0].toUpperCase() + cfg.skill.slice(1) + "-Lab-Record.txt",
      );
    };
    $("#reset-lab").onclick = () => $("#reset-dialog").showModal();
    $("#cancel-reset").onclick = () => $("#reset-dialog").close();
    $("#confirm-reset").onclick = () => {
      try {
        localStorage.removeItem(cfg.key);
      } catch {}
      location.hash = "";
      location.reload();
    };
    window.addEventListener("pagehide", () => {
      stopVoice();
      pauseTimer();
    });

    const api = {
      $,
      $$,
      el,
      state,
      save,
      feedback,
      drill,
      choiceDrill,
      sequenceDrill,
      questionSet,
      speak,
      stopVoice,
      showStep,
      logResult,
      onLeave: (fn) => leaveHandlers.push(fn),
      isMemory: () => memory,
      download,
    };
    if (cfg.init) cfg.init(api);
    if (cfg._applyHints) cfg._applyHints();
    const hash = location.hash.match(/^#step-([1-6])$/);
    showStep(hash ? +hash[1] - 1 : 0, false);
    return api;
  };
})();
