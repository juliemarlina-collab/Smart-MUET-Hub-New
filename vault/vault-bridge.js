/* Smart MUET · Vault bridge. Connects the V2 Vault/Mock component pages to the hub:
   Reflect panel after every completed component, level-complete celebration
   (ring + confetti + 50 XP, awarded by app.js), and shared status helpers.
   Storage: reads V2 keys muet_{v1|v2|mock1}_{component}; writes smh.vault.v1. */
(() => {
  "use strict";
  const KEY = "smh.vault.v1",
    ORDER = ["listening", "speaking", "reading", "writing"],
    STAGES = {
      v1: { name: "Vault 1", page: "vault1.html", file: "vault1", grr: "We do · guided practice" },
      v2: { name: "Vault 2", page: "vault2.html", file: "vault2", grr: "You do together · less support" },
      mock1: { name: "Mock 1", page: "mock1.html", file: "mock1", grr: "You do alone · exam conditions" },
    },
    TECH = { listening: "CLUE", speaking: "PREP", reading: "SCAN", writing: "PEEL" },
    PAPER = { listening: "800/1", speaking: "800/2", reading: "800/3", writing: "800/4" };
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const load = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch {
      return {};
    }
  };
  const store = (v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {}
  };
  const raw = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  function status(stage) {
    const comps = ORDER.map((c) => {
      const done = raw("muet_" + stage + "_" + c) === "true",
        s90 = parseInt(raw("muet_" + stage + "_" + c + "_score90"), 10);
      return { id: c, name: cap(c), done, score90: Number.isFinite(s90) ? s90 : null, href: STAGES[stage].file + "-" + c + ".html" };
    });
    return { stage, ...STAGES[stage], comps, done: comps.filter((c) => c.done).length };
  }
  function recommended() {
    const order = ["v1", "v2", "mock1"];
    return order.find((s) => status(s).done < 4) || null;
  }
  const reduced = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    raw("smh.rebuild.motionPaused") === "true" ||
    document.documentElement.classList.contains("no-motion");

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function ring(done, size = 120) {
    const r = 46,
      c = 2 * Math.PI * r,
      ns = "http://www.w3.org/2000/svg",
      svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("class", "smh-ring");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", done + " of 4 components complete");
    svg.innerHTML =
      '<circle cx="60" cy="60" r="' + r + '" class="track"/>' +
      '<circle cx="60" cy="60" r="' + r + '" class="fill" style="stroke-dasharray:' + c + ";stroke-dashoffset:" + c + '"/>' +
      '<text x="60" y="58" text-anchor="middle" class="n">' + done + "/4</text>" +
      '<text x="60" y="78" text-anchor="middle" class="t">' + (done === 4 ? "complete" : "done") + "</text>";
    const fill = svg.querySelector(".fill");
    const target = c * (1 - done / 4);
    if (reduced()) fill.style.strokeDashoffset = target;
    else requestAnimationFrame(() => requestAnimationFrame(() => (fill.style.strokeDashoffset = target)));
    if (done === 4) svg.classList.add("full");
    return svg;
  }
  function celebrate(stage, force) {
    const v = load();
    v.celebrated = Array.isArray(v.celebrated) ? v.celebrated : [];
    if (!force && v.celebrated.includes(stage)) return false;
    if (status(stage).done < 4) return false;
    v.celebrated.push(stage);
    store(v);
    const layer = el("div", "smh-celebrate");
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.setAttribute("aria-labelledby", "smh-cel-title");
    const card = el("div", "smh-cel-card");
    const title = el("h2", "", STAGES[stage].name + " complete!");
    title.id = "smh-cel-title";
    const next = stage === "v1" ? "Vault 2" : stage === "v2" ? "Mock 1" : null;
    card.append(
      ring(4, 140),
      title,
      el("p", "smh-cel-xp", "+50 XP"),
      el("p", "", next ? "All four papers done. " + next + " is your recommended next step." : "You finished the full mock. Review your results and reflect on what to practise next."),
    );
    const go = el("a", "smh-cel-btn", next ? "Go to " + next + " ↗" : "See my progress ↗");
    go.href = next ? (stage === "v1" ? "vault2.html" : "mock1.html") : "../me.html";
    const close = el("button", "smh-cel-close", "Close");
    close.type = "button";
    close.onclick = () => layer.remove();
    const row = el("div", "smh-cel-actions");
    row.append(go, close);
    card.append(row);
    layer.append(card);
    if (!reduced())
      for (let i = 0; i < 36; i++) {
        const bit = el("i", "smh-confetti");
        bit.style.setProperty("--x", Math.random() * 100 + "%");
        bit.style.setProperty("--d", (Math.random() * 0.4).toFixed(2) + "s");
        bit.style.setProperty("--r", Math.round(Math.random() * 720 - 360) + "deg");
        bit.style.setProperty("--c", ["#3b5bff", "#ffcc33", "#4cc9a6", "#ff754a", "#e0479e"][i % 5]);
        layer.append(bit);
      }
    document.body.append(layer);
    close.focus();
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") {
        layer.remove();
        document.removeEventListener("keydown", esc);
      }
    });
    return true;
  }

  /* ---------- Reflect panel ---------- */
  function reflectPanel(stage, component, mount) {
    if (mount.querySelector(".smh-reflect")) return;
    const box = el("form", "smh-reflect");
    box.append(el("span", "smh-reflect-tag", "REFLECT · 1 MINUTE"), el("h3", "", "Before you move on"));
    box.append(el("p", "smh-q", "1. Which technique helped most?"));
    const chips = el("div", "smh-chips");
    let chosen = TECH[component];
    ["CLUE", "PREP", "SCAN", "PEEL", "Not sure yet"].forEach((t) => {
      const b = el("button", "smh-chip", t);
      b.type = "button";
      b.setAttribute("aria-pressed", String(t === chosen));
      b.onclick = () => {
        chosen = t;
        chips.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      };
      chips.append(b);
    });
    const lbl = el("label", "smh-q", "2. What will you do differently next time?"),
      ta = el("textarea");
    ta.id = "smh-reflect-text-" + component;
    lbl.htmlFor = ta.id;
    ta.rows = 2;
    ta.maxLength = 600;
    ta.placeholder = "One specific action…";
    const cl = el("label", "smh-q", "3. My confidence now: "),
      out = el("output", "", "3"),
      range = el("input");
    cl.append(out, document.createTextNode(" / 5"));
    range.type = "range";
    range.min = 1;
    range.max = 5;
    range.value = 3;
    range.id = "smh-conf-" + component;
    cl.htmlFor = range.id;
    range.oninput = () => (out.textContent = range.value);
    const save = el("button", "smh-save", "Save my reflection ✓"),
      status = el("p", "smh-status");
    status.setAttribute("role", "status");
    save.type = "submit";
    box.append(chips, lbl, ta, cl, range, save, status);
    box.onsubmit = (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (!text) {
        status.textContent = "Write one specific action for next time.";
        ta.focus();
        return;
      }
      const v = load();
      v.reflections = Array.isArray(v.reflections) ? v.reflections : [];
      v.reflections.push({
        date: new Date().toISOString(),
        stage,
        component,
        topic: STAGES[stage].name + " · " + cap(component),
        technique: chosen,
        text,
        confidence: +range.value,
      });
      store(v);
      status.textContent = "Saved. It appears on your Me page.";
      save.disabled = true;
      setTimeout(() => celebrate(stage), 600);
    };
    mount.append(box);
  }

  window.SMHVault = { status, recommended, celebrate, ring, STAGES, ORDER, PAPER, TECH, load };

  const b = document.body;
  if (b.dataset.stage && b.dataset.component) {
    window.addEventListener("smh:component-complete", (e) => {
      const d = e.detail || {};
      const key = d.stage === "vault1" ? "v1" : d.stage === "vault2" ? "v2" : d.stage;
      reflectPanel(key, d.component, d.box);
    });
  }
})();
