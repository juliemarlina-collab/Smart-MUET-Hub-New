/* Smart MUET Hub · My progress dashboard (21 Oct 2026)
   Home and Me: MUET exam countdown, an animated 8-week timeline (Week 0 → Week 8) built from what the
   student has really done, journey ring, KPI tiles, weekly activity bars and four paper cards with
   coloured step indicators (Lab · Vault 1 · Vault 2 · Mock 1).
   Reads only records already on this device. Writes only smh.exam.v1 (the exam date the student picks). */
(() => {
  'use strict';
  const id = document.body.dataset.pageId || '', root = document.body.dataset.appRoot || '../';
  const mountAt = { home: '#ebook', me: '.me-print-head' }[id];
  if (!mountAt || document.querySelector('.pd-sec')) return;
  const anchor = document.querySelector(mountAt); if (!anchor) return;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const flag = k => { try { return localStorage.getItem(k) === 'true'; } catch { return false; } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = ['listening', 'speaking', 'reading', 'writing'];
  const NAME = { listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing' };
  const TECH = { listening: 'CLUE', speaking: 'PREP', reading: 'SCAN', writing: 'PEEL' };
  const CODE = { listening: '800/1', speaking: '800/2', reading: '800/3', writing: '800/4' };
  const BADGE = { listening: 'sharp-ears', speaking: 'confident-speaker', reading: 'speed-reader', writing: 'word-smith' };
  const DAY = 864e5;
  const dayKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  function data() {
    const sum = window.SMHApp ? window.SMHApp.summary() : { total: 0, level: 'Starter', streak: 0, badges: [] };
    const badges = new Set(sum.badges || []);
    const app = get('smh.app.v1', {}) || {};
    const days = (Array.isArray(app.days) ? app.days : []).filter(x => /^\d{4}-\d\d-\d\d$/.test(x)).sort();
    const today = dayKey(new Date()); if (!days.includes(today)) days.push(today);
    const diag = get('smh.diagnostic.v1', null);
    const planDone = new Set((diag && diag.done) || []);
    const read = new Set((get('smh.pdfbook.v1.read', []) || []).filter(Number.isInteger));
    const per = Object.fromEntries(P.map(k => [k, {
      lab: badges.has(BADGE[k]), labStarted: !!localStorage.getItem('smh.lab.' + k + '.v1'),
      v1: flag('muet_v1_' + k), v2: flag('muet_v2_' + k), m1: flag('muet_mock1_' + k),
      guide: new Set((get('smh.rebuild.guide.' + k + '.done', []) || []).filter(Number.isInteger)).size
    }]));
    const cnt = key => P.filter(k => per[k][key]).length;
    const know = flag('smh.home.know') || [4, 5, 6, 7].some(p => read.has(p));
    const check = !!(diag && diag.plan);
    const start = new Date(days[0] + 'T00:00:00');
    const week = Math.max(0, Math.min(8, Math.floor((Date.now() - start) / (7 * DAY))));
    const perWeek = Array.from({ length: 9 }, (_, w) => days.filter(d => { const t = new Date(d + 'T00:00:00') - start; return t >= w * 7 * DAY && t < (w + 1) * 7 * DAY; }).length);
    const cert = window.SMHCert ? window.SMHCert.state() : null;
    return { sum, days, diag, planDone, read, per, cnt, know, check, start, week, perWeek, cert };
  }

  /* the 8-week journey: each week has checks that tick themselves */
  function weeks(d) {
    const plan = d.diag && Array.isArray(d.diag.plan) ? d.diag.plan : null;
    const planWeek = n => plan && plan[n] ? plan[n].items.map(it => [it.text, d.planDone.has(it.id), it.href]) : null;
    const lab = k => [NAME[k] + ' ' + TECH[k] + ' Lab', d.per[k].lab, 'labs/' + k + '-lab.html'];
    return [
      { w: 0, t: 'Start', s: 'Know MUET · 10-minute check', c: 'c0', items: [['Know MUET tour or eBook ch 1', d.know, 'welcome/index.html'], ['10-minute check and 3-week plan', d.check, 'labs/diagnostic.html']] },
      { w: 1, t: 'Learn it', s: 'First paper · I do → We do', c: 'c1', items: planWeek(0) || [['Take the 10-minute check to unlock your week 1 plan', false, 'labs/diagnostic.html'], lab('listening')] },
      { w: 2, t: 'Practise it', s: 'Two more Labs · Vault 1', c: 'c2', items: planWeek(1) || [lab('speaking'), lab('reading')] },
      { w: 3, t: 'Apply it', s: 'Last Lab · Vault 2 · Mock taste', c: 'c3', items: planWeek(2) || [lab('writing'), ['Retake the 10-minute check', false, 'labs/diagnostic.html']] },
      { w: 4, t: 'Vault 1', s: 'All four papers, guided', c: 'c4', items: P.map(k => ['Vault 1 · ' + NAME[k], d.per[k].v1, 'vault/vault1-' + k + '.html']) },
      { w: 5, t: 'Vault 2', s: 'Less support · first two papers', c: 'c5', items: ['listening', 'speaking'].map(k => ['Vault 2 · ' + NAME[k], d.per[k].v2, 'vault/vault2-' + k + '.html']) },
      { w: 6, t: 'Vault 2', s: 'Less support · last two papers', c: 'c5', items: ['reading', 'writing'].map(k => ['Vault 2 · ' + NAME[k], d.per[k].v2, 'vault/vault2-' + k + '.html']) },
      { w: 7, t: 'Mock 1', s: 'Exam conditions · all four', c: 'c7', items: P.map(k => ['Mock 1 · ' + NAME[k], d.per[k].m1, 'vault/mock1-' + k + '.html']) },
      { w: 8, t: 'Track', s: 'Review · certificate', c: 'c8', items: [['Clear a Review again set', !!(get('smh.review.v1', null)), 'labs/review.html'], ['Certificate · all 9 activities', d.cert ? d.cert.done === 9 : false, 'certificate.html']] }
    ].map(x => ({ ...x, done: x.items.filter(i => i[1]).length, total: x.items.length }));
  }

  /* ---------- build ---------- */
  const sec = el('section', 'pd-sec'); sec.setAttribute('aria-labelledby', 'pd-title');
  anchor.before(sec);
  function render() {
    const d = data(), W = weeks(d);
    const checkpoints = [d.know, d.check, ...P.map(k => d.per[k].lab), ...P.map(k => d.per[k].v1), ...P.map(k => d.per[k].v2), ...P.map(k => d.per[k].m1)];
    const pct = Math.round(checkpoints.filter(Boolean).length / checkpoints.length * 100);
    sec.replaceChildren();

    /* header */
    const head = el('div', 'pd-head');
    const ht = el('div'); ht.append(el('span', 'pd-k', 'My progress dashboard'));
    const h2 = el('h2', '', 'My weekly journey'); h2.id = 'pd-title'; ht.append(h2);
    ht.append(el('p', 'pd-sub', 'Eight weeks from your first visit to Mock 1. Each week ticks itself as you finish the work. Your week is the glowing one.'));
    head.append(ht);

    /* exam countdown */
    const exam = get('smh.exam.v1', {}) || {};
    const cd = el('div', 'pd-exam');
    const lab = el('label', 'pd-exam-l', 'My MUET date'); lab.htmlFor = 'pd-exam-date';
    const inp = el('input'); inp.type = 'date'; inp.id = 'pd-exam-date'; inp.value = exam.date || ''; inp.min = dayKey(new Date());
    const out = el('div', 'pd-exam-out');
    inp.onchange = () => { put('smh.exam.v1', { date: inp.value }); paintExam(); };
    function paintExam() {
      out.replaceChildren();
      if (!inp.value) { out.append(el('b', 'pd-exam-n', '?'), el('span', '', 'Pick your test date to start the countdown.')); return; }
      const ms = new Date(inp.value + 'T08:30:00') - Date.now();
      if (ms < 0) { out.append(el('b', 'pd-exam-n', '✓'), el('span', '', 'Exam day has passed. Good luck with your result!')); return; }
      const days = Math.floor(ms / DAY), hrs = Math.floor(ms % DAY / 36e5), wk = Math.floor(days / 7);
      const n = el('b', 'pd-exam-n', String(days)); out.append(n, el('span', '', (days === 1 ? 'day' : 'days') + ' and ' + hrs + ' h to go'));
      const fit = el('small', 'pd-exam-fit', wk >= 8 ? 'Enough time for the full 8-week journey. Keep one paper a day.' : wk >= 3 ? wk + ' weeks left: do the 3-week plan, then Vault 1 and Mock 1.' : 'Under 3 weeks: go straight to Vault 1 and Mock 1, and clear Review again daily.');
      out.append(fit);
      cd.classList.toggle('soon', days < 21);
    }
    paintExam();
    const mpm = el('a', 'pd-exam-a', 'Check official dates on the MPM portal ↗'); mpm.href = 'https://portal.mpm.edu.my/'; mpm.target = '_blank'; mpm.rel = 'noopener';
    cd.append(lab, inp, out, mpm);
    head.append(cd);
    sec.append(head);

    /* KPI tiles + ring */
    const top = el('div', 'pd-top');
    const ring = el('div', 'pd-ring'); ring.style.setProperty('--p', reduce ? pct : 0);
    ring.setAttribute('role', 'img'); ring.setAttribute('aria-label', 'Journey ' + pct + '% complete');
    const ri = el('div', 'pd-ring-in'); ri.append(el('b', '', pct + '%'), el('span', '', 'of the journey'));
    ring.append(ri);
    const tiles = el('div', 'pd-tiles');
    [['Week', d.week + ' of 8', 't-blue'], ['Day streak', String(d.sum.streak || 0), 't-sun'], ['XP · ' + (d.sum.level || 'Starter'), String(d.sum.total || 0), 't-mint'], ['Days active', String(d.days.length), 't-coral']]
      .forEach(([k, v, c]) => { const t = el('div', 'pd-tile ' + c); t.append(el('b', '', v), el('span', '', k)); tiles.append(t); });
    top.append(ring, tiles);
    sec.append(top);
    if (!reduce) requestAnimationFrame(() => setTimeout(() => ring.style.setProperty('--p', pct), 60));

    /* timeline */
    const tl = el('ol', 'pd-tl'); tl.setAttribute('aria-label', 'Eight-week timeline');
    W.forEach(x => {
      const state = x.done === x.total ? 'done' : x.w === d.week ? 'now' : x.w < d.week ? 'late' : 'next';
      const li = el('li', 'pd-wk ' + x.c + ' ' + state); li.style.setProperty('--i', x.w);
      const btn = el('button', 'pd-wk-b'); btn.type = 'button'; btn.setAttribute('aria-expanded', String(state === 'now'));
      const dot = el('span', 'pd-dot', state === 'done' ? '✓' : String(x.w));
      const lbl = el('span', 'pd-wk-l'); lbl.append(el('small', '', 'Week ' + x.w), el('b', '', x.t));
      const tag = el('span', 'pd-tag', state === 'done' ? 'Done' : state === 'now' ? 'This week' : state === 'late' ? 'Catch up' : 'Coming');
      const bar = el('span', 'pd-wk-bar'); const fill = el('i'); fill.style.width = (x.done / x.total * 100) + '%'; bar.append(fill);
      const act = el('span', 'pd-act'); act.setAttribute('aria-label', d.perWeek[x.w] + ' active days');
      for (let i = 0; i < 7; i++) act.append(el('i', i < d.perWeek[x.w] ? 'on' : ''));
      btn.append(dot, lbl, tag, bar, act);
      const body = el('div', 'pd-wk-body'); body.hidden = state !== 'now';
      body.append(el('p', 'pd-wk-s', x.s + ' · ' + x.done + ' of ' + x.total + ' done'));
      const ul = el('ul');
      x.items.forEach(([t, ok, href]) => { const li2 = el('li', ok ? 'ok' : ''); const a = el('a', '', (ok ? '✓ ' : '○ ') + t); a.href = root + href; li2.append(a); ul.append(li2); });
      body.append(ul);
      btn.onclick = () => { const open = body.hidden; body.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
      li.append(btn, body); tl.append(li);
    });
    const tlWrap = el('div', 'pd-tl-wrap'); tlWrap.append(tl);
    sec.append(el('h3', 'pd-h3', 'Week by week'), tlWrap);

    /* paper cards with coloured indicators */
    sec.append(el('h3', 'pd-h3', 'My four papers'));
    const cards = el('div', 'pd-cards');
    const order = P.slice().sort((a, b) => ['lab', 'v1', 'v2', 'm1'].filter(s => d.per[a][s]).length - ['lab', 'v1', 'v2', 'm1'].filter(s => d.per[b][s]).length);
    const focus = order[0];
    P.forEach(k => {
      const p = d.per[k], steps = [['Lab', p.lab], ['Vault 1', p.v1], ['Vault 2', p.v2], ['Mock 1', p.m1]], n = steps.filter(s => s[1]).length;
      const next = !p.lab ? ['Start the ' + TECH[k] + ' Lab', 'labs/' + k + '-lab.html'] : !p.v1 ? ['Vault 1 ' + NAME[k], 'vault/vault1-' + k + '.html'] : !p.v2 ? ['Vault 2 ' + NAME[k], 'vault/vault2-' + k + '.html'] : !p.m1 ? ['Mock 1 ' + NAME[k], 'vault/mock1-' + k + '.html'] : ['Review the guide', 'guides/' + k + '.html'];
      const c = el('a', 'pd-card p-' + k + (k === focus && n < 4 ? ' focus' : '')); c.href = root + next[1];
      const hd = el('div', 'pd-card-h'); hd.append(el('span', 'pd-code', CODE[k]), el('span', 'pd-n', n + '/4'));
      c.append(hd, el('b', 'pd-card-t', NAME[k]), el('span', 'pd-tech', TECH[k]));
      if (k === focus && n < 4) c.append(el('span', 'pd-focus', 'Focus paper'));
      const dots = el('ol', 'pd-steps');
      steps.forEach(([t, ok], i) => { const li = el('li', ok ? 'ok' : (i === n ? 'now' : '')); li.append(el('i', '', ok ? '✓' : String(i + 1)), el('span', '', t)); dots.append(li); });
      c.append(dots);
      const bar = el('span', 'pd-card-bar'); const f = el('i'); f.style.width = n / 4 * 100 + '%'; bar.append(f); c.append(bar);
      c.append(el('span', 'pd-next', 'Next: ' + next[0] + ' →'));
      cards.append(c);
    });
    sec.append(cards);
    const sr = $('#skill-rows'); if (sr) sr.classList.add('pd-replaced');
  }
  render();
  setTimeout(render, 700); // SMHApp finishes its first check shortly after load
  addEventListener('storage', render);
  const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { sec.classList.add('in'); io.disconnect(); } }), { threshold: 0, rootMargin: "0px 0px -80px 0px" }) : null;
  if (io) io.observe(sec); else sec.classList.add('in');
})();
