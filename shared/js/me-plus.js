/* Smart MUET Hub · Me page extras: error log and Speaking/Writing rubric.
   Reads: smh.review.queue.v1 (labs, 10-minute check), smh.learn.trap.v1 (Trap spotter misses)
   Writes: smh.errorlog.v1 (own mistakes + ticked-off items), smh.me.rubric.v1 (rubric records),
           muet_{v1|v2|mock1}_{speaking|writing}_score90 + the done flag when "Save to results" is used. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch {} };
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; };
  const NAME = { listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing' };
  const LINK = { listening: 'labs/listening-lab.html', speaking: 'labs/speaking-lab.html', reading: 'labs/reading-lab.html', writing: 'labs/writing-lab.html' };
  const refresh = () => window.dispatchEvent(new StorageEvent('storage', { key: 'smh.me' }));

  /* ---------- error log ---------- */
  const list = $('el-list');
  function items() {
    const log = get('smh.errorlog.v1', { own: [], fixed: {} }) || { own: [], fixed: {} };
    const out = [];
    (get('smh.review.queue.v1', []) || []).forEach(x => { if (x && x.id) out.push({ id: 'q:' + x.id, paper: x.skill, what: x.label || 'Missed question', from: x.source || 'Lab', fix: 'Clear it in Review again', link: 'labs/review.html', n: x.misses || 1 }); });
    Object.entries(get('smh.learn.trap.v1', {}) || {}).forEach(([k, r]) => (r && r.misses || []).forEach((m, i) => out.push({ id: 't:' + k + ':' + m.q.slice(0, 40), paper: k, what: 'Chose “' + m.picked + '”', from: 'Trap spotter', fix: m.why, link: 'learn.html#traps' })));
    (log.own || []).forEach(o => out.push({ id: 'o:' + o.id, paper: o.paper, what: o.what, from: 'My note', fix: o.fix || 'Write your fix', link: LINK[o.paper], own: true }));
    const seen = new Set();
    return { log, all: out.filter(x => !seen.has(x.id) && seen.add(x.id)) };
  }
  function paint() {
    if (!list) return;
    const { log, all } = items();
    list.replaceChildren();
    const open = all.filter(x => !log.fixed[x.id]), fixed = all.length - open.length;
    const head = el('p', 'el-head'); head.append(el('b', '', open.length + ' to fix'), el('span', '', fixed ? ' · ' + fixed + ' fixed' : ''));
    list.append(head);
    if (!open.length) { list.append(el('p', 'el-empty', all.length ? 'Everything in your log is fixed. Well done.' : 'No mistakes logged yet. Missed questions from the Labs, the 10-minute check and the Trap spotter appear here.')); return; }
    open.slice(0, 20).forEach(x => {
      const row = el('div', 'el-row p-' + (x.paper || 'reading'));
      const tag = el('span', 'el-tag', (NAME[x.paper] || 'MUET') + ' · ' + x.from);
      const txt = el('div', 'el-txt'); txt.append(el('b', '', x.what), el('small', '', 'Fix: ' + x.fix));
      const act = el('div', 'el-act');
      if (x.link) { const a = el('a', 'el-go', 'Practise'); a.href = x.link; act.append(a); }
      const done = el('button', 'el-done', '✓ Fixed'); done.type = 'button';
      done.addEventListener('click', () => { log.fixed[x.id] = new Date().toISOString().slice(0, 10); put('smh.errorlog.v1', log); paint(); });
      act.append(done); row.append(tag, txt, act); list.append(row);
    });
  }
  $('el-add')?.addEventListener('submit', e => {
    e.preventDefault();
    const what = $('el-what').value.trim(); if (!what) return;
    const log = get('smh.errorlog.v1', { own: [], fixed: {} }) || { own: [], fixed: {} };
    log.own = log.own || []; log.fixed = log.fixed || {};
    log.own.unshift({ id: Date.now().toString(36), paper: $('el-paper').value, what: what.slice(0, 140), fix: $('el-fix').value.trim().slice(0, 140), date: new Date().toISOString().slice(0, 10) });
    log.own = log.own.slice(0, 50);
    put('smh.errorlog.v1', log); $('el-what').value = ''; $('el-fix').value = ''; paint();
  });
  paint();
  window.addEventListener('storage', e => { if (!e.key || !e.key.startsWith('smh.me')) paint(); });

  /* ---------- rubric ---------- */
  const rb = $('rb'); if (!rb) return;
  const CRIT = {
    speaking: [['Task', 'Answers the question and develops ideas with PREP'], ['Organisation', 'Clear order: point, reason, example, point again'], ['Language', 'Range and accuracy of vocabulary and grammar'], ['Fluency & interaction', 'Steady pace; responds to and builds on others']],
    writing: [['Task', 'Covers every task point; right length and format'], ['Organisation', 'Paragraphs, PEEL, linking words'], ['Vocabulary', 'Varied, precise words for the topic'], ['Grammar & accuracy', 'Sentence range; few errors that block meaning']]
  };
  const LV = ['1 · Very limited', '2 · Limited', '3 · Modest', '4 · Competent', '5 · Good', '6 · Very good'];
  let paper = 'speaking';
  const tabs = el('div', 'lb-tabs');
  const card = el('div', 'rb-card');
  ['speaking', 'writing'].forEach(k => { const b = el('button', 'lb-tab t-' + k, k === 'speaking' ? 'Speaking 800/2' : 'Writing 800/4'); b.type = 'button'; b.dataset.k = k; b.addEventListener('click', () => { paper = k; draw(); }); tabs.append(b); });
  const hist = el('div', 'rb-hist');
  rb.append(tabs, card, hist);
  function draw() {
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.k === paper ? 'true' : 'false'));
    card.className = 'rb-card p-' + paper; card.replaceChildren();
    const sels = [];
    CRIT[paper].forEach(([n, d], i) => {
      const row = el('label', 'rb-row'); const t = el('span', 'rb-crit'); t.append(el('b', '', n), el('small', '', d));
      const s = el('select'); s.append(el('option', '', 'Choose…')); s.options[0].value = '';
      LV.forEach((l, li) => { const o = el('option', '', l); o.value = li + 1; s.append(o); });
      sels.push(s); row.append(t, s); card.append(row);
    });
    const out = el('div', 'rb-out'); const big = el('b', 'rb-score', '— / 90'); const note = el('small', '', 'Choose a level for all four parts.');
    out.append(big, note);
    const meta = el('div', 'rb-meta');
    const who = el('select'); [['Lecturer', 'Marked by my lecturer'], ['Self', 'Self-assessed']].forEach(([v, l]) => { const o = el('option', '', l); o.value = v; who.append(o); });
    const lvl = el('select'); [['', 'Keep it in the rubric log only'], ['v1', 'Save to Vault 1 results'], ['v2', 'Save to Vault 2 results'], ['mock1', 'Save to Mock 1 results']].forEach(([v, l]) => { const o = el('option', '', l); o.value = v; lvl.append(o); });
    const fb = el('textarea'); fb.rows = 2; fb.maxLength = 300; fb.placeholder = 'Feedback and one next step (optional)';
    const lw = (t, c) => { const l = el('label', '', t); l.append(c); return l; };
    meta.append(lw('Marked by', who), lw('Where to save', lvl), lw('Feedback', fb));
    const save = el('button', 'button primary', 'Save rubric score'); save.type = 'button'; save.disabled = true;
    const msg = el('p', 'rb-msg'); msg.setAttribute('role', 'status');
    const score = () => { const v = sels.map(s => +s.value); if (v.some(x => !x)) return null; return Math.round(v.reduce((a, b) => a + b, 0) / 24 * 90); };
    sels.forEach(s => s.addEventListener('change', () => { const x = score(); big.textContent = (x ?? '—') + ' / 90'; note.textContent = x == null ? 'Choose a level for all four parts.' : 'Total of the four parts (out of 24), scaled to 90.'; save.disabled = x == null; }));
    save.addEventListener('click', () => {
      const x = score(); if (x == null) return;
      const recs = get('smh.me.rubric.v1', []) || [];
      recs.unshift({ date: new Date().toISOString().slice(0, 10), paper, by: who.value, level: lvl.value, parts: sels.map(s => +s.value), score90: x, feedback: fb.value.trim().slice(0, 300) });
      put('smh.me.rubric.v1', recs.slice(0, 30));
      let added = !!lvl.value;
      if (lvl.value && paper === 'speaking') {
        /* Speaking: only a lecturer mark becomes the mark; a self-assessment stays in the log */
        if (who.value === 'Lecturer' && window.MUETSpeaking) window.MUETSpeaking.setLecturer(lvl.value, { score90: x, parts: sels.map(s => +s.value), feedback: fb.value.trim() });
        else added = false;
      } else if (lvl.value) { put('muet_' + lvl.value + '_' + paper + '_score90', String(x)); put('muet_' + lvl.value + '_' + paper, 'true'); }
      msg.textContent = 'Saved: ' + x + ' / 90' + (added ? ', added to your ' + lvl.options[lvl.selectedIndex].text.replace('Save to ', '') + ' table as the lecturer mark.' : lvl.value && paper === 'speaking' ? '. Self-assessments stay in the log; only a lecturer mark becomes your Speaking mark.' : '.');
      refresh(); history();
    });
    card.append(out, meta, save, msg);
  }
  function history() {
    const recs = get('smh.me.rubric.v1', []) || [];
    hist.replaceChildren();
    if (!recs.length) return;
    hist.append(el('b', 'rb-hist-h', 'Rubric log'));
    recs.slice(0, 6).forEach(r => {
      const row = el('div', 'rb-hist-row p-' + r.paper);
      row.append(el('span', '', r.date), el('b', '', (r.paper === 'speaking' ? 'Speaking' : 'Writing') + ' · ' + r.score90 + ' / 90'), el('small', '', (r.by === 'Self' ? 'Self-assessed' : 'Lecturer') + (r.feedback ? ' · ' + r.feedback : '')));
      hist.append(row);
    });
  }
  draw(); history();
})();

/* certificate card on Me */
(() => {
  const t = document.getElementById('me-cert-t'); if (!t || !window.SMHCert) return;
  const paint = () => {
    const s = window.SMHCert.state(), c = window.SMHCert.issued();
    const card = document.getElementById('me-cert');
    card.classList.toggle('ready', s.done === 9);
    t.textContent = s.done === 9 ? 'Your certificate is ready' : s.done + ' of 9 activities done';
    document.getElementById('me-cert-s').textContent = s.done === 9 ? (c ? 'Issued ' + c.date + ' · ' + c.id : 'Open it to print or save as PDF.') : 'Next: ' + (s.L.find(x => !x[2]) || [''])[0] + '. Finish all nine and your certificate is made for you.';
    document.getElementById('me-cert-go').textContent = s.done === 9 ? 'Open my certificate →' : 'See what’s left →';
    if (s.done === 9) card.href = 'certificate.html#certificate';
  };
  paint(); setTimeout(paint, 700); window.addEventListener('storage', paint);
})();
