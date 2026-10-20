/* Smart MUET Hub · home page.
   Two views: first-timer (route + road) and returning learner (continue, streak, per-paper status).
   Reads only records already saved on this device; nothing is uploaded. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const flag = k => { try { return localStorage.getItem(k) === 'true'; } catch { return false; } };
  const safe = p => typeof p === 'string' && /^(?:(?:welcome|account|guides|book|labs|vault|arcade)\/[a-z0-9-]+|learn|practice|me|ebook|certificate)\.html(?:#[a-z0-9=.-]+)?$/i.test(p);
  const skills = ['listening', 'speaking', 'reading', 'writing'];
  const title = s => s[0].toUpperCase() + s.slice(1);
  const tech = { listening: 'CLUE', speaking: 'PREP', reading: 'SCAN', writing: 'PEEL' };
  const labBadge = { listening: 'sharp-ears', speaking: 'confident-speaker', reading: 'speed-reader', writing: 'word-smith' };
  const rowColour = { listening: 'r-p-listening', speaking: 'r-p-speaking', reading: 'r-p-reading', writing: 'r-p-writing' };

  /* ---------- what has this learner done? ---------- */
  function record() {
    const s = window.SMHApp ? window.SMHApp.summary() : { total: 0, level: 'Starter', streak: 0, badges: [] };
    const badges = new Set(s.badges || []);
    const diag = get('smh.diagnostic.v1', null);
    const pdfRead = new Set(get('smh.pdfbook.v1.read', []));
    const guideDone = skills.some(k => (get('smh.rebuild.guide.' + k + '.done', []) || []).length);
    const per = Object.fromEntries(skills.map(k => [k, {
      lab: badges.has(labBadge[k]), labStarted: !!localStorage.getItem('smh.lab.' + k + '.v1'),
      v1: flag('muet_v1_' + k), v2: flag('muet_v2_' + k), m1: flag('muet_mock1_' + k)
    }]));
    const count = key => skills.filter(k => per[k][key]).length;
    const queue = get('smh.review.queue.v1', []);
    const due = Array.isArray(queue) ? queue.filter(x => x && typeof x.id === 'string' && !(Date.parse(x.due) > Date.now())).length : 0;
    const steps = {
      know: flag('smh.home.know') || [4, 5, 6, 7].some(p => pdfRead.has(p)),
      check: !!(diag && diag.plan),
      learn: guideDone || pdfRead.size >= 15,
      labs: count('lab'), vault: count('v1') + count('v2'), mock: count('m1'),
      arcade: !!localStorage.getItem('smh.arcade.v1')
    };
    const active = !!localStorage.getItem('smh.flow.last') || s.total > 0 || steps.check;
    return { s, diag, per, due, steps, active, count };
  }

  /* ---------- persona switch ---------- */
  function setPersona(p, save) {
    $$('[data-view]').forEach(e => { e.hidden = e.dataset.view !== p; });
    $$('.h-switch [data-persona]').forEach(b => b.setAttribute('aria-pressed', b.dataset.persona === p ? 'true' : 'false'));
    if (save) put('smh.persona', p);
  }
  $$('[data-persona]').forEach(b => b.addEventListener('click', () => setPersona(b.dataset.persona, true)));
  $$('[data-know]').forEach(a => a.addEventListener('click', () => { try { localStorage.setItem('smh.home.know', 'true'); } catch {} }));

  function render() {
    const r = record();
    const { steps } = r;

    /* route rows + road status */
    const order = ['know', 'check', 'learn', 'labs', 'vault', 'mock'];
    const isDone = k => k === 'labs' ? steps.labs === 4 : k === 'vault' ? steps.vault === 8 : k === 'mock' ? steps.mock === 4 : !!steps[k];
    const now = order.find(k => !isDone(k));
    const label = k => {
      if (isDone(k)) return ['✓ done', 'done'];
      if (k === now) return [k === 'know' ? 'start here' : 'next', 'now'];
      if (k === 'labs' && steps.labs) return [steps.labs + ' / 4', ''];
      if (k === 'vault' && (steps.vault || steps.mock)) return [(steps.vault + steps.mock) + ' / 12', ''];
      return ['', ''];
    };
    $$('.h-menu .h-row').forEach(a => {
      const k = a.dataset.step, st = a.querySelector('.st');
      if (k === 'arcade') { st.textContent = steps.arcade ? 'played' : ''; return; }
      const key = k === 'vault' ? (steps.vault === 8 ? 'mock' : 'vault') : k;
      const [t, c] = label(key); st.textContent = t; st.className = 'st ' + c;
    });
    $$('.h-stops li').forEach(li => {
      const k = li.dataset.step; if (k === 'arcade') return;
      li.classList.toggle('is-done', isDone(k)); li.classList.toggle('is-now', k === now);
      if (isDone(k)) li.querySelector('.when').textContent = '✓ done';
      else if (k === now) li.querySelector('.when').textContent = k === 'know' ? 'start here' : 'you are here';
    });

    /* returning view */
    const { s } = r;
    $('#t-streak').textContent = s.streak || 0;
    $('#t-xp').textContent = s.total || 0;
    $('#t-level').textContent = 'XP · ' + (s.level || 'Starter');
    $('#t-review').textContent = r.due;
    $('#streak-pill').textContent = s.streak ? s.streak + '-day streak' : 'Welcome back';
    if (r.due) { $('#back-review').textContent = 'Do ' + r.due + ' review' + (r.due > 1 ? 's' : '') + ' first'; }

    const last = get('smh.flow.last', {});
    const card = $('#cont-card');
    if (safe(last.path)) {
      card.href = last.path; $('#cont-k').textContent = 'Continue where you stopped';
      $('#cont-title').textContent = String(last.label || 'Your last page').replace(/^(Learn|Vault|Practice|Home|Book) \/ /, '');
      $('#cont-sub').textContent = 'Last opened ' + (last.date ? new Date(last.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'recently') + '.';
      const b = $('#back-continue'); b.href = last.path; b.textContent = 'Continue →';
    } else if (r.diag && r.diag.plan) {
      const k = skills.includes(r.diag.start) ? r.diag.start : 'reading';
      card.href = 'labs/diagnostic.html#plan'; $('#cont-k').textContent = 'Your 3-week plan';
      $('#cont-title').textContent = 'Start with ' + title(k); $('#cont-sub').textContent = 'Open your plan to see this week’s steps.';
      const b = $('#back-continue'); b.href = card.href; b.textContent = 'Open my plan →';
    }

    const box = $('#skill-rows'); box.replaceChildren();
    const weakest = skills.slice().sort((a, b) => {
      const n = k => ['lab', 'v1', 'v2', 'm1'].filter(x => r.per[k][x]).length;
      return n(a) - n(b);
    })[0];
    skills.forEach((k, i) => {
      const p = r.per[k], n = ['lab', 'v1', 'v2', 'm1'].filter(x => p[x]).length;
      const parts = [p.lab ? 'Lab ✓' : p.labStarted ? 'Lab started' : 'Lab not started', p.v1 ? 'Vault 1 ✓' : '', p.v2 ? 'Vault 2 ✓' : '', p.m1 ? 'Mock ✓' : ''].filter(Boolean);
      const href = !p.lab ? 'labs/' + k + '-lab.html' : !p.v1 ? 'vault/vault1-' + k + '.html' : !p.v2 ? 'vault/vault2-' + k + '.html' : !p.m1 ? 'vault/mock1-' + k + '.html' : 'guides/' + k + '.html';
      const a = document.createElement('a'); a.className = 'h-row ' + rowColour[k]; a.href = href;
      const num = document.createElement('span'); num.className = 'n'; num.textContent = '0' + (i + 1);
      const mid = document.createElement('span'); const b = document.createElement('b'); b.textContent = title(k) + ' · ' + tech[k];
      const sm = document.createElement('small'); sm.textContent = parts.join(' · '); mid.append(b, sm);
      const st = document.createElement('span'); st.className = 'st' + (n === 4 ? ' done' : k === weakest ? ' now' : '');
      st.textContent = n === 4 ? '✓ 4/4' : k === weakest ? 'focus · ' + n + '/4' : n + '/4';
      a.append(num, mid, st); box.append(a);
    });
    return r;
  }

  /* eBook section: pages read, continue where you stopped, chapters finished */
  function book() {
    const read = new Set((get('smh.pdfbook.v1.read', []) || []).filter(Number.isInteger));
    const last = get('smh.pdfbook.v1.last', null);
    const n = Math.min(53, read.size);
    const rd = $('#book-read'); if (!rd) return;
    rd.textContent = n + ' of 53 pages read';
    $('#book-bar').style.width = (n / 53 * 100) + '%';
    const btn = $('#book-open');
    if (Number.isInteger(last) && last > 1 && last <= 53) { btn.href = 'book/index.html#page=' + last; btn.textContent = 'Continue at page ' + last + ' →'; }
    $$('.h-ch').forEach(a => {
      const from = +a.dataset.from, to = +a.dataset.to; let got = 0;
      for (let p = from; p <= to; p++) if (read.has(p)) got++;
      const st = a.querySelector('.h-ch-st'), all = to - from + 1;
      a.classList.toggle('done', got === all);
      st.textContent = got === all ? '✓ read' : got ? got + ' / ' + all + ' pages' : 'p. ' + from + (from === to ? '' : '–' + to);
      const G = { 4: [['1.4', 8]], 17: [['3.3', 3], ['3.4', 14], ['3.5', 2]], 24: [['4.3', 4], ['4.4', 8], ['4.5', 2]], 31: [['5.3', 3], ['5.4', 10], ['5.5', 2]], 38: [['6.3', 4], ['6.4', 12], ['6.5', 2]], 45: [['7', 8]] }[from], q = get('smh.ebook.quiz.v1', {}) || {};
      let star = a.querySelector('.h-ch-star');
      if (G) {
        if (!star) { star = document.createElement('span'); star.className = 'h-ch-star'; a.append(star); }
        const got = G.reduce((n, [id, t]) => n + (q[id] ? Math.min(q[id].best, t) : 0), 0), max = G.reduce((n, [, t]) => n + t, 0), played = G.some(([id]) => q[id]);
        star.textContent = played ? '★ ' + got + ' / ' + max : '▶ ' + G.length + (G.length > 1 ? ' games' : ' game');
        star.classList.toggle('won', played);
      }
    });
  }
  book();
  window.addEventListener('storage', book);

  const r = render();
  const saved = get('smh.persona', null);
  setPersona(saved === 'back' || saved === 'first' ? saved : (r.active ? 'back' : 'first'), false);
  if (location.hash === '#start' && !saved) setPersona('first', false);
  window.addEventListener('storage', render);
  setTimeout(render, 600); // SMHApp finishes its first check shortly after load
})();

/* Five stages board + target band (style v6). Reads the same device records as above. */
(() => {
  'use strict';
  const board = document.querySelector('.h-stages');
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const flag = k => { try { return localStorage.getItem(k) === 'true'; } catch { return false; } };
  const skills = ['listening', 'speaking', 'reading', 'writing'];

  /* target band, shared with the Me page profile */
  const sel = document.getElementById('h-target');
  if (sel) {
    const prof = get('smh.me.profile', {}) || {};
    if (prof.target) sel.value = prof.target;
    const note = document.getElementById('h-target-note');
    const say = () => { if (note && sel.value) note.textContent = 'Saved. Your Me page compares every Vault and Mock result with ' + sel.value + '.'; };
    say();
    sel.addEventListener('change', () => {
      const p = get('smh.me.profile', {}) || {}; p.target = sel.value;
      try { localStorage.setItem('smh.me.profile', JSON.stringify(p)); } catch {}
      say();
    });
  }
  if (!board) return;
  const pdfRead = new Set(get('smh.pdfbook.v1.read', []));
  const diag = get('smh.diagnostic.v1', null);
  const prof = get('smh.me.profile', {}) || {};
  const done = {
    start: flag('smh.home.know') || [4, 5, 6, 7].some(p => pdfRead.has(p)) || !!prof.target,
    check: !!(diag && diag.plan),
    learn: skills.some(k => (get('smh.rebuild.guide.' + k + '.done', []) || []).length >= 6) || pdfRead.size >= 30,
    practise: skills.every(k => flag('muet_mock1_' + k)),
    track: !!get('smh.cert.v1', null)
  };
  const started = {
    learn: skills.some(k => (get('smh.rebuild.guide.' + k + '.done', []) || []).length) || pdfRead.size > 0,
    practise: skills.some(k => !!localStorage.getItem('smh.lab.' + k + '.v1') || flag('muet_v1_' + k)),
    track: skills.some(k => flag('muet_v1_' + k) || flag('muet_v2_' + k) || flag('muet_mock1_' + k))
  };
  const order = ['start', 'check', 'learn', 'practise', 'track'];
  const now = order.find(k => !done[k]);
  board.querySelectorAll('.h-stage').forEach(li => {
    const k = li.dataset.stage, st = li.querySelector('.st');
    li.classList.toggle('is-done', !!done[k]);
    li.classList.toggle('is-now', k === now);
    st.textContent = done[k] ? '✓ Done' : k === now ? 'You are here' : started[k] ? 'Started' : '';
  });
})();
