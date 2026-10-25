/* Smart MUET · Reading SCAN Evidence Hunt (labs/scan-hunt.html)
   Each question runs the six-step Reading Lab flow:
     1 One question  (S · Study: what am I looking for? choose the question type)
     2 Find it       (C · Circle: tap the key words and qualifiers in the question)
     3 Locate it     (A · Analyse: tap the exact evidence sentence, then read before and after)
     4 Your text     (N · Nail: compare the evidence with the options and choose)
     5 Name the trap (Word-Match, Own-Knowledge or Too-Far)
     6 Keep the learning (missed answers go to Review again; next question)
   Content: window.SMHBank.reading.hunt (shared/js/item-bank.js)
   Saves:   smh.lab.scanhunt.v1 = { passages: { id: { done, best, last, runs } }, traps: { word, own, far } }
            smh.review.queue.v1 (same shape as the Labs), so misses show on Review again and the Me error log. */
(() => {
  'use strict';
  const Bank = window.SMHBank && window.SMHBank.reading;
  if (!Bank || !Bank.hunt) return;
  const KEY = 'smh.lab.scanhunt.v1', REVIEW = 'smh.review.queue.v1', DAY = 864e5;
  const STEPS = [['One question', 'S'], ['Find it', 'C'], ['Locate it', 'A'], ['Your text', 'N'], ['Name the trap', '!'], ['Keep the learning', '✓']];
  const PACE = 110; /* seconds a question at MUET pace: 75 min / 40 questions ≈ 1 min 52 s */
  const $ = id => document.getElementById(id);
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; };
  const btn = (c, x) => { const b = el('button', c, x); b.type = 'button'; return b; };
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  const clean = w => w.toLowerCase().replace(/^[^a-z0-9’'-]+|[^a-z0-9’'-]+$/g, '');
  const LETTER = 'ABCD';
  const TRAP = Bank.huntTraps, TYPES = Bank.huntTypes, PLAIN = Bank.huntPlain || {};
  const guided = () => { const g = $('sh-guided'); return !g || g.checked; };
  const trapText = s => s.replace(/^[^:]+:\s*/, '');

  let pid = null, P = null, flat = [], qi = 0, step = 0, run = null, cur = null, tick = null, t0 = 0, N = 6;

  /* ---------- passage picker ---------- */
  function paintCards() {
    const store = get(KEY, {}) || {}, box = $('sh-cards'); box.replaceChildren();
    Object.entries(Bank.hunt).forEach(([id, p]) => {
      const rec = (store.passages || {})[id];
      const n = p.questions.length;
      const c = btn('sh-card' + (rec && rec.done ? ' is-done' : '') + (p.stage === 'start' ? ' is-start' : ''));
      if (p.stage === 'start') c.append(el('span', 'sh-card-badge', 'Start here'));
      c.append(el('span', 'sh-card-lvl', p.level), el('b', '', p.title));
      c.append(el('span', 'sh-card-st', rec && rec.best ? 'Best: ' + rec.best.points + '/' + n * 5 + ' proof points · ' + rec.best.answers + '/' + n + ' answers' : n + ' questions · not tried yet'));
      c.append(el('span', 'sh-card-go', rec && rec.done ? 'Hunt again →' : 'Start the hunt →'));
      c.onclick = () => start(id);
      box.append(c);
    });
  }

  /* ---------- run ---------- */
  function start(id) {
    pid = id; P = Bank.hunt[id]; flat = P.paras.flat(); qi = 0; N = P.questions.length;
    run = { qs: P.questions.map(() => ({ type: null, keys: null, ev: null, ans: null, trap: null, picked: null })), started: Date.now() };
    $('sh-pick').hidden = true; $('sh-end').hidden = true; $('sh-play').hidden = false;
    paintPassage(); openQ(0);
    $('sh-play').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function paintPassage() {
    const box = $('sh-passage'); box.replaceChildren();
    box.append(el('span', 'label', 'READ THE PASSAGE'), el('h3', '', P.title));
    if (P.words && P.words.length) {
      const d = el('details', 'sh-help'); d.id = 'sh-help'; d.open = guided();
      d.append(el('summary', '', '📖 Word help · ' + P.words.length + ' words'));
      const dl = el('dl'); P.words.forEach(([w, m]) => dl.append(el('dt', '', w), el('dd', '', m))); d.append(dl);
      box.append(d);
    }
    let n = 0;
    P.paras.forEach((para, pi) => {
      const p = el('p', 'sh-para'); p.append(el('span', 'sh-pn', String(pi + 1)));
      para.forEach(s => { const b = btn('sh-s', s + ' '); b.dataset.i = n++; b.disabled = true; b.setAttribute('aria-pressed', 'false'); p.append(b); });
      box.append(p);
    });
  }
  const sentences = () => [...document.querySelectorAll('#sh-passage .sh-s')];

  function paintTop() {
    const d = $('sh-dots'); d.replaceChildren();
    run.qs.forEach((r, i) => {
      const b = el('span', 'sh-dot' + (i === qi ? ' is-now' : '') + (r.trap !== null ? (r.ans ? ' is-ok' : ' is-miss') : ''), String(i + 1));
      b.setAttribute('aria-label', 'Question ' + (i + 1) + (i === qi ? ', current' : r.trap !== null ? (r.ans ? ', correct' : ', missed') : ''));
      d.append(b);
    });
    $('sh-score').textContent = points() + ' proof points';
  }
  const pts = r => [r.type, r.keys, r.ev, r.ans, r.trap].filter(Boolean).length;
  const points = () => run.qs.reduce((n, r) => n + pts(r), 0);

  function openQ(i) {
    qi = i; cur = P.questions[i]; step = 0;
    sentences().forEach(s => { s.className = 'sh-s'; s.disabled = true; s.setAttribute('aria-pressed', 'false'); });
    clearInterval(tick); t0 = Date.now();
    const clock = $('sh-clock'); clock.hidden = !$('sh-pace').checked;
    if (!clock.hidden) { const draw = () => { const s = Math.round((Date.now() - t0) / 1000); clock.textContent = 'Time on this question ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' · MUET pace about 1:50'; clock.classList.toggle('is-over', s > PACE); }; draw(); tick = setInterval(draw, 1000); }
    paintTop(); show();
  }

  function paintSteps() {
    const ol = $('sh-steps'); ol.replaceChildren();
    STEPS.forEach(([name, l], i) => {
      const li = el('li', i === step ? 'is-now' : i < step ? 'is-done' : '');
      li.append(el('b', '', l), el('span', '', name));
      if (i === step) li.setAttribute('aria-current', 'step');
      ol.append(li);
    });
  }

  function head(eyebrow, mantra) {
    const body = $('sh-body'); body.replaceChildren();
    body.append(el('span', 'sh-eye', 'QUESTION ' + (qi + 1) + ' OF ' + N + ' · ' + eyebrow));
    const q = el('h3', 'sh-qtext', cur.q); body.append(q);
    if (mantra) body.append(el('p', 'sh-mantra', mantra));
    return body;
  }
  function fb(body, ok, title, text) {
    const f = el('div', 'qfb ' + (ok ? 'ok' : 'no'));
    const av = el('span', 'cs-av', ok ? '✓' : '!'); av.setAttribute('aria-hidden', 'true');
    const tx = el('div'); tx.append(el('b', '', title)); if (text) tx.append(el('p', '', text));
    f.append(av, tx); body.append(f); return f;
  }
  function next(body, label, fn) { const b = btn('primary sh-next', label); b.onclick = fn; body.append(b); b.focus({ preventScroll: true }); return b; }

  function show() {
    paintSteps();
    [s1, s2, s3, s4, s5, s6][step]();
  }
  const go = () => { step++; show(); };

  /* 1 · One question: S · Study */
  function s1() {
    const body = head('S · STUDY', '“What am I actually looking for?” Choose one.');
    const row = el('div', 'sh-chips sh-types');
    TYPES.forEach(t => {
      const b = btn('sh-chip'); b.dataset.type = t;
      b.append(el('span', '', PLAIN[t] || t), el('small', '', t));
      b.onclick = () => {
        row.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.dataset.type === cur.type) x.classList.add('is-right'); });
        const ok = t === cur.type; if (!ok) b.classList.add('is-wrong');
        run.qs[qi].type = ok; paintTop();
        fb(body, ok, ok ? 'Yes: ' + (PLAIN[cur.type] || cur.type).toLowerCase() + '.' : 'You are looking for ' + (PLAIN[cur.type] || cur.type).toLowerCase() + ' (' + cur.type.toLowerCase() + ').', hintFor(cur.type));
        next(body, 'Find it →', go);
      };
      row.append(b);
    });
    body.append(row);
  }
  function hintFor(t) {
    return ({
      'Main idea': 'You need the idea that covers the whole text, not one detail.',
      'Detail': 'You need one fact, stated in one place. Find that place.',
      'Reference': 'Read the sentence before: pronouns and “this / that” point backwards.',
      'Word meaning': 'Use the words around it, not what the word usually means to you.',
      'Inference': 'The text does not say it directly, but the evidence must still be there.',
      'Writer’s view': 'Look for the writer’s judgement, usually near the end, and for words like yet, however.'
    })[t] || '';
  }

  /* 2 · Find it: C · Circle */
  function s2() {
    const body = head('C · CIRCLE', '“Mark the limits and key terms.” Tap the words that carry the meaning, including qualifiers like only, not, most.');
    body.querySelector('.sh-qtext').remove();
    const box = el('p', 'sh-words'); const picked = new Set();
    cur.q.split(/\s+/).forEach((w, i) => {
      const b = btn('sh-w', w); b.setAttribute('aria-pressed', 'false');
      b.onclick = () => { picked.has(i) ? picked.delete(i) : picked.add(i); b.setAttribute('aria-pressed', String(picked.has(i))); };
      box.append(b);
    });
    body.insertBefore(box, body.querySelector('.sh-mantra'));
    if (guided()) body.append(el('p', 'sh-hint', '💡 Hint: tap about ' + cur.key.length + ' words. Skip small words like “the”, “is”, “in”.'));
    const check = btn('primary', 'Check my key words');
    check.onclick = () => {
      if (!picked.size) { check.textContent = 'Tap at least one word first'; return; }
      const words = [...box.children];
      const isKey = b => cur.key.includes(clean(b.textContent));
      let hit = 0, extra = 0;
      words.forEach((b, i) => { b.disabled = true; const k = isKey(b); if (k) b.classList.add('is-key'); if (picked.has(i)) { k ? hit++ : extra++; if (!k) b.classList.add('is-extra'); } });
      const keyCount = words.filter(isKey).length;
      const ok = hit >= Math.ceil(keyCount / 2) && extra <= 2;
      run.qs[qi].keys = ok; paintTop(); check.remove();
      fb(body, ok, ok ? 'Good marking: ' + hit + ' of ' + keyCount + ' key words.' : 'The key words are outlined in green.', ok ? 'These words tell you what to find in the passage.' : extra > 2 ? 'Mark only the words that carry the meaning. Small words like “the” and “is” do not help you find the evidence.' : 'These words tell you what to find. Look for them, or words with the same meaning, in the passage.');
      next(body, 'Locate it →', go);
    };
    body.append(check);
  }

  /* 3 · Locate it: A · Analyse */
  function s3() {
    const body = head('A · ANALYSE', '“Does the logic flow before and after?” Tap the one sentence in the passage that proves the answer.');
    const keys = el('p', 'sh-keys'); keys.append(el('b', '', 'Your key words: '), cur.key.join(' · ')); body.append(keys);
    let chosen = null, tries = 0;
    const paraNo = P.paras.findIndex(pa => pa.includes(flat[cur.ev[0]])) + 1;
    if (guided()) body.append(el('p', 'sh-hint', cur.type === 'Main idea' || cur.type === 'Writer’s view' ? '💡 Hint: big ideas and the writer’s view are usually in the first or the last paragraph.' : '💡 Hint: look in paragraph ' + paraNo + '.'));
    const st = el('p', 'sh-chosen', 'No sentence chosen yet.'); body.append(st);
    const ss = sentences();
    ss.forEach(s => {
      s.disabled = false;
      s.onclick = () => { chosen = +s.dataset.i; ss.forEach(x => x.setAttribute('aria-pressed', String(x === s))); st.textContent = 'Chosen: “' + s.textContent.trim().slice(0, 90) + (s.textContent.length > 92 ? '…”' : '”'); check.disabled = false; };
    });
    const check = btn('primary sh-fixed', 'Check my evidence'); check.disabled = true;
    if (matchMedia('(max-width: 900px)').matches) $('sh-passage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    check.onclick = () => {
      tries++;
      const ok = cur.ev.includes(chosen);
      if (!ok && tries < 2) {
        const s = ss[chosen]; s.classList.add('is-wrong'); s.setAttribute('aria-pressed', 'false');
        body.querySelector('.qfb')?.remove();
        fb(body, false, 'Not that one. One more try.', 'That sentence has related words, but it does not prove the answer. Look in paragraph ' + paraNo + ', and read around your key words.');
        body.append(check); return;
      }
      check.classList.remove('sh-fixed');
      ss.forEach(s => { s.disabled = true; s.onclick = null; });
      const evi = ok ? chosen : cur.ev[0];
      showEvidence(evi);
      run.qs[qi].ev = ok && tries === 1; paintTop(); check.remove();
      body.querySelector('.qfb')?.remove();
      const before = flat[evi - 1], after = flat[evi + 1];
      const f = fb(body, ok, ok ? (tries === 1 ? 'Evidence found first time.' : 'Found it on the second try.') : 'This is the evidence, now highlighted in green.', 'Now read the sentences before and after (shaded yellow) to check the linkers and pronouns.');
      const ctx = el('div', 'sh-ctx');
      if (before) ctx.append(el('p', 'sh-ctx-b', '↑ Before: ' + before));
      ctx.append(el('p', 'sh-ctx-e', '● Evidence: ' + flat[evi]));
      if (after) ctx.append(el('p', 'sh-ctx-b', '↓ After: ' + after));
      f.after(ctx);
      next(body, 'Compare with the options →', go);
      if (matchMedia('(max-width: 900px)').matches) $('sh-q').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    body.append(check);
  }
  function showEvidence(i) {
    const ss = sentences();
    ss.forEach(s => s.classList.remove('is-wrong'));
    ss[i].classList.add('is-ev'); ss[i].setAttribute('aria-pressed', 'false');
    if (ss[i - 1] && !cur.ev.includes(i - 1)) ss[i - 1].classList.add('is-near');
    if (ss[i + 1] && !cur.ev.includes(i + 1)) ss[i + 1].classList.add('is-near');
    cur.ev.forEach(e => ss[e] && ss[e].classList.add('is-ev'));
  }

  /* 4 · Your text: N · Nail */
  function s4() {
    const body = head('N · NAIL', '“Prove it with evidence, not memory.” Choose the option that says the same as your evidence.');
    const evq = el('blockquote', 'sh-evq', flat[cur.ev[0]]); body.append(evq);
    const list = el('div', 'sh-opts');
    cur.options.forEach((o, i) => {
      const b = btn('sh-opt'); b.append(el('b', '', LETTER[i]), el('span', '', o));
      b.onclick = () => {
        const ok = i === cur.answer;
        run.qs[qi].ans = ok; run.qs[qi].picked = i;
        [...list.children].forEach((x, j) => {
          x.disabled = true;
          if (j === cur.answer) x.classList.add('is-right');
          else { if (j === i) x.classList.add('is-wrong'); x.append(el('small', 'sh-tag t-' + cur.tags[j], TRAP[cur.tags[j]][0])); }
        });
        if (!ok) { logMiss(); bumpTrap(cur.tags[i]); }
        paintTop();
        fb(body, ok, ok ? 'Nailed it. ' + LETTER[cur.answer] + ' is proved by the text.' : 'The answer is ' + LETTER[cur.answer] + '. You chose a ' + TRAP[cur.tags[i]][0] + '.', ok ? cur.why : trapText(cur.traps[i]) + '. ' + cur.why);
        next(body, 'Name the trap →', go);
      };
      list.append(b);
    });
    body.append(list);
  }

  /* 5 · Name the trap */
  function s5() {
    const body = head('NAME THE TRAP', 'Naming the trap tells you what to watch for next time.');
    const n = cur.nameIt, tag = cur.tags[n];
    const card = el('div', 'sh-trapopt'); card.append(el('b', '', 'Option ' + LETTER[n]), el('span', '', cur.options[n]));
    body.append(el('p', 'sh-ask', 'This option is wrong. Which trap is it?'), card);
    const row = el('div', 'sh-traps');
    Object.entries(TRAP).forEach(([k, [name, desc]]) => {
      const b = btn('sh-trap t-' + k); b.append(el('b', '', name), el('small', '', desc));
      b.onclick = () => {
        const ok = k === tag;
        [...row.children].forEach(x => { x.disabled = true; if (x.classList.contains('t-' + tag)) x.classList.add('is-right'); });
        if (!ok) b.classList.add('is-wrong');
        run.qs[qi].trap = ok; paintTop();
        fb(body, ok, ok ? 'Yes: a ' + TRAP[tag][0] + '.' : 'It is a ' + TRAP[tag][0] + '.', trapText(cur.traps[n]) + '.');
        next(body, 'Keep the learning →', go);
      };
      row.append(b);
    });
    body.append(row);
  }

  /* 6 · Keep the learning */
  function s6() {
    clearInterval(tick);
    const r = run.qs[qi], body = head('KEEP THE LEARNING', '');
    const grid = el('div', 'sh-sum');
    [['S', 'Question type', r.type], ['C', 'Key words', r.keys], ['A', 'Evidence (first try)', r.ev], ['N', 'Answer', r.ans], ['!', 'Trap named', r.trap]].forEach(([l, n, ok]) => {
      const c = el('div', 'sh-sum-i ' + (ok ? 'ok' : 'no')); c.append(el('b', '', l), el('span', '', n), el('i', '', ok ? '✓' : '✗')); grid.append(c);
    });
    body.append(grid);
    body.append(el('p', 'sh-why', cur.why));
    if (!r.ans) body.append(el('p', 'sh-saved', '↻ Saved to Review again. It comes back in 3 days, so you can try it fresh.'));
    if (qi < N - 1) next(body, 'Next question →', () => openQ(qi + 1));
    else next(body, 'See my evidence report →', finish);
  }

  /* ---------- saving ---------- */
  function logMiss() {
    let q = get(REVIEW, []); if (!Array.isArray(q)) q = [];
    const id = 'reading:hunt-' + pid + '-q' + (qi + 1), now = new Date().toISOString(), f = q.find(x => x && x.id === id);
    if (f) { f.misses = (f.misses || 1) + 1; f.last = now; f.due = new Date(Date.now() + 3 * DAY).toISOString(); }
    else q.push({ id, skill: 'reading', source: 'SCAN Evidence Hunt', label: cur.label, misses: 1, last: now, due: new Date(Date.now() + 3 * DAY).toISOString() });
    put(REVIEW, q);
  }
  function bumpTrap(tag) { const s = get(KEY, {}) || {}; s.traps = s.traps || {}; s.traps[tag] = (s.traps[tag] || 0) + 1; put(KEY, s); }

  function finish() {
    const qs = run.qs, sum = k => qs.filter(r => r[k]).length;
    const res = { points: points(), answers: sum('ans'), evidence: sum('ev'), types: sum('type'), keys: sum('keys'), traps: sum('trap'), date: new Date().toISOString(), mins: Math.max(1, Math.round((Date.now() - run.started) / 60000)) };
    const s = get(KEY, {}) || {}; s.passages = s.passages || {};
    const rec = s.passages[pid] || { runs: 0 };
    rec.runs = (rec.runs || 0) + 1; rec.done = true; rec.last = res;
    if (!rec.best || res.points > rec.best.points) rec.best = res;
    s.passages[pid] = rec; put(KEY, s);
    try { window.dispatchEvent(new StorageEvent('storage', { key: KEY })); } catch {}

    $('sh-play').hidden = true; $('sh-end').hidden = false;
    const M = N * 5;
    $('sh-end-lead').textContent = P.title + ' · ' + res.mins + ' min · ' + (rec.runs > 1 ? 'attempt ' + rec.runs + ', best ' + rec.best.points + '/' + M : 'first attempt') + (guided() ? ' · guided help on' : '');
    const rep = $('sh-report'); rep.replaceChildren();
    [['Proof points', res.points + '/' + M, 'one for each step you got right'], ['Answers', res.answers + '/' + N, 'N · Nail'], ['Evidence first try', res.evidence + '/' + N, 'A · Analyse'], ['Question types', res.types + '/' + N, 'S · Study'], ['Key words', res.keys + '/' + N, 'C · Circle'], ['Traps named', res.traps + '/' + N, 'Name the trap']].forEach(([n, v, d], i) => {
      const c = el('div', 'sh-tile' + (i === 0 ? ' big' : '')); c.append(el('small', '', n), el('b', '', v), el('span', '', d)); rep.append(c);
    });
    const fell = {}; qs.forEach((r, i) => { if (r.picked !== null && !r.ans) { const t = P.questions[i].tags[r.picked]; fell[t] = (fell[t] || 0) + 1; } });
    const top = Object.entries(fell).sort((a, b) => b[1] - a[1])[0];
    const tip = el('div', 'sh-tip');
    if (top) { tip.append(el('b', '', 'Watch out for the ' + TRAP[top[0]][0] + ' (' + top[1] + '×).'), el('p', '', TRAP[top[0]][1] + ' ' + ({ word: 'Before you choose, find the word in the text and read the whole sentence: is the meaning the same?', own: 'Ask: did the text say this, or do I just know it?', far: 'Circle words like always, all, best, never and check the text uses them too.' })[top[0]])); }
    else tip.append(el('b', '', 'No traps caught you this time.'), el('p', '', P.stage === 'start' ? 'You are ready for a MUET-level passage. Try one next.' : 'Try another passage, or switch Guided help off, or try a full Reading paper in Vault 1 to use SCAN under time.'));
    rep.append(tip);
    const ids = Object.keys(Bank.hunt), store = (get(KEY, {}) || {}).passages || {};
    const other = ids.find(k => k !== pid && !(store[k] && store[k].done)) || ids[(ids.indexOf(pid) + 1) % ids.length];
    $('sh-again').textContent = other !== pid ? 'Next: “' + Bank.hunt[other].title + '” →' : 'Hunt again →';
    $('sh-again').onclick = () => start(other || pid);
    $('sh-end').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('sh-quit').onclick = () => { clearInterval(tick); $('sh-play').hidden = true; $('sh-end').hidden = true; $('sh-pick').hidden = false; paintCards(); $('sh-pick').scrollIntoView({ behavior: 'smooth' }); };
  try { $('sh-pace').checked = localStorage.getItem('smh.scanhunt.pace') === '1'; } catch {}
  try { $('sh-guided').checked = localStorage.getItem('smh.scanhunt.guided') !== '0'; } catch {}
  $('sh-guided').onchange = e => { try { localStorage.setItem('smh.scanhunt.guided', e.target.checked ? '1' : '0'); } catch {} };
  $('sh-pace').onchange = e => { try { localStorage.setItem('smh.scanhunt.pace', e.target.checked ? '1' : '0'); } catch {} };
  paintCards();
})();
