/* Smart MUET Hub · Flow infographic + 45-second motion tour (21 Oct 2026)
   Home and Practice: "Who does what" infographic across the five stages (You · The Hub · Your lecturer),
   with an animated route, and a short motion explainer that plays in the page (captions, optional voice).
   Loaded by shell.js. */
(() => {
  'use strict';
  const id = document.body.dataset.pageId || '', root = document.body.dataset.appRoot || '../';
  const mountAt = { home: '.h-stages-wrap', vault: '.smh-tips' }[id];
  if (!mountAt || document.querySelector('.fl-sec')) return;
  const anchor = document.querySelector(mountAt); if (!anchor) return;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STAGES = [
    { n: 1, t: 'Know MUET', c: 's1', href: 'welcome/index.html',
      you: 'Read eBook ch 1–2 and set your target band', hub: 'Welcome tour, band and CEFR table', lec: 'Introduces MUET in the first class' },
    { n: 2, t: '10-min check', c: 's2', href: 'labs/diagnostic.html',
      you: 'Answer 20 quick items', hub: 'Explains every answer, builds your 3-week plan', lec: 'Sees your starting paper' },
    { n: 3, t: 'Learn', c: 's3', href: 'learn.html',
      you: 'Read the guide, try CLUE · PREP · SCAN · PEEL', hub: 'Worked examples, hints, stars', lec: 'Models the technique in class' },
    { n: 4, t: 'Practise', c: 's4', href: 'practice.html',
      you: 'Lab → Vault 1 → Vault 2 → Mock 1', hub: 'Marks /90, band, error log', lec: 'Rubric for Speaking and Writing' },
    { n: 5, t: 'Track', c: 's5', href: 'me.html',
      you: 'Reflect and redo your misses', hub: 'Badges, streak and certificate', lec: 'Reads your PDF report' }
  ];
  const LANES = [['you', 'You', 'l-you'], ['hub', 'The Hub', 'l-hub'], ['lec', 'Your lecturer', 'l-lec']];

  const sec = el('section', 'fl-sec smh-sec'); sec.setAttribute('aria-labelledby', 'fl-title');
  const head = el('div', 'fl-head');
  const ht = el('div'); ht.append(el('span', 'fl-k', 'How it works · who does what'));
  const h2 = el('h2', '', 'One journey, three partners'); h2.id = 'fl-title'; ht.append(h2);
  ht.append(el('p', 'fl-sub', 'You do the work, the Hub gives instant feedback, and your lecturer guides you in class. Follow the route from 1 to 5.'));
  const play = el('button', 'fl-play'); play.type = 'button';
  play.innerHTML = '<span aria-hidden="true">▶</span><b>Watch the 45-second tour</b>';
  head.append(ht, play);

  /* route with moving marker */
  const route = el('ol', 'fl-route'); route.setAttribute('aria-label', 'Five stages');
  STAGES.forEach(s => {
    const li = el('li', 'fl-stop ' + s.c);
    const a = el('a'); a.href = root + s.href;
    a.append(el('span', 'fl-n', String(s.n)), el('b', '', s.t));
    li.append(a); route.append(li);
  });
  const track = el('div', 'fl-track'); track.setAttribute('aria-hidden', 'true'); track.append(el('i', 'fl-dot'));
  const routeWrap = el('div', 'fl-route-wrap'); routeWrap.append(track, route);

  /* lanes table */
  const grid = el('div', 'fl-grid'); grid.setAttribute('role', 'table'); grid.setAttribute('aria-label', 'Who does what at each stage');
  const hr = el('div', 'fl-row fl-hrow'); hr.setAttribute('role', 'row');
  hr.append(el('span', 'fl-lane', ''));
  STAGES.forEach(s => { const c = el('span', 'fl-hc ' + s.c, s.n + ' · ' + s.t); c.setAttribute('role', 'columnheader'); hr.append(c); });
  grid.append(hr);
  LANES.forEach(([k, label, cls]) => {
    const r = el('div', 'fl-row ' + cls); r.setAttribute('role', 'row');
    const lh = el('span', 'fl-lane', label); lh.setAttribute('role', 'rowheader'); r.append(lh);
    STAGES.forEach((s, i) => { const c = el('span', 'fl-cell'); c.dataset.s = s.n; c.setAttribute('role', 'cell'); c.style.setProperty('--d', (i * 0.12 + LANES.findIndex(l => l[0] === k) * 0.05) + 's');
      c.append(el('small', 'fl-cell-k', s.n + ' · ' + s.t), document.createTextNode(s[k])); r.append(c); });
    grid.append(r);
  });
  const goLink = el('a', 'fl-go'); 
  sec.append(head, routeWrap, grid, goLink);
  anchor.before(sec);
  /* phone: the five circles work as tabs, showing who does what at one stage */
  const small = matchMedia('(max-width:860px)');
  const pick = n => {
    sec.dataset.active = n;
    route.querySelectorAll('.fl-stop').forEach((li, k) => li.classList.toggle('on', k + 1 === n));
    const st = STAGES[n - 1]; goLink.href = root + st.href; goLink.textContent = 'Open stage ' + n + ' · ' + st.t + ' →';
  };
  pick(1);
  route.querySelectorAll('.fl-stop a').forEach((a, k) => a.addEventListener('click', e => { if (small.matches) { e.preventDefault(); pick(k + 1); } }));

  /* reveal when scrolled into view */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { sec.classList.add('in'); io.disconnect(); } }), { threshold: .2 }) : null;
  if (io && !reduce) io.observe(sec); else sec.classList.add('in');

  /* ---------- motion tour ---------- */
  const SCENES = [
    { img: 'photo-overview.webp', k: 'Smart MUET Hub', t: 'Your first MUET starts here', s: 'Free practice for all four papers, on your phone, at your pace.' },
    { img: 'photo-listening.webp', k: 'Stage 1 · Know MUET', t: 'Four papers. One band.', s: 'Listening, Speaking, Reading and Writing. 90 marks each, 360 in total.' },
    { img: 'photo-reading.webp', k: 'Stage 2 · 10-minute check', t: 'Find where to begin', s: 'Twenty quick items. Every answer is explained, then you get a 3-week plan.' },
    { img: 'photo-speaking.webp', k: 'Stage 3 · Learn', t: 'One technique per paper', s: 'CLUE for Listening, PREP for Speaking, SCAN for Reading, PEEL for Writing.' },
    { img: 'photo-practice.webp', k: 'Stage 4 · Practise', t: 'Lab. Vault. Mock.', s: 'Guided practice first, then real MUET-style papers with marks and a band.' },
    { img: 'photo-progress.webp', k: 'Stage 5 · Track', t: 'See your band move', s: 'Badges, streaks, a PDF for your lecturer and a certificate at the end.' }
  ];
  const DUR = 7000;
  let dlg = null, timer = 0, i = 0, playing = false, t0 = 0, left = DUR, voice = false;
  function build() {
    dlg = el('dialog', 'fl-video'); dlg.setAttribute('aria-label', 'Smart MUET Hub in 45 seconds');
    const stage = el('div', 'fv-stage');
    SCENES.forEach((s, n) => {
      const sc = el('figure', 'fv-scene'); sc.dataset.n = n;
      const im = new Image(); im.src = root + 'shared/assets/' + s.img; im.alt = ''; im.loading = 'lazy';
      const cap = el('figcaption'); cap.append(el('span', 'fv-k', s.k), el('strong', '', s.t), el('p', '', s.s));
      sc.append(im, cap); stage.append(sc);
    });
    const bars = el('div', 'fv-bars'); SCENES.forEach(() => { const b = el('span'); b.append(el('i')); bars.append(b); });
    const ctl = el('div', 'fv-ctl');
    const pp = el('button', 'fv-pp', 'Ⅱ Pause'); pp.type = 'button';
    const pr = el('button', '', '← Back'); pr.type = 'button';
    const nx = el('button', '', 'Next →'); nx.type = 'button';
    const vo = el('button', 'fv-vo', '🔈 Voice off'); vo.type = 'button'; vo.setAttribute('aria-pressed', 'false');
    const cl = el('button', 'fv-x', '✕'); cl.type = 'button'; cl.setAttribute('aria-label', 'Close the tour');
    ctl.append(pr, pp, nx, vo);
    const end = el('div', 'fv-end'); end.hidden = true;
    const go = el('a', 'fv-go', 'Start stage 1 →'); go.href = root + 'welcome/index.html';
    const again = el('button', 'fv-again', '↻ Watch again'); again.type = 'button';
    end.append(el('strong', '', 'Ready?'), go, again);
    dlg.append(cl, bars, stage, end, ctl);
    document.body.append(dlg);
    pp.onclick = () => playing ? pause() : resume();
    pr.onclick = () => showScene(Math.max(0, i - 1));
    nx.onclick = () => i < SCENES.length - 1 ? showScene(i + 1) : finish();
    vo.onclick = () => { voice = !voice; vo.setAttribute('aria-pressed', String(voice)); vo.textContent = voice ? '🔊 Voice on' : '🔈 Voice off'; if (voice) speak(); else stopVoice(); };
    cl.onclick = close; again.onclick = () => showScene(0);
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  }
  const stopVoice = () => { try { speechSynthesis.cancel(); } catch {} };
  function speak() {
    if (!voice || !('speechSynthesis' in window)) return;
    stopVoice(); const s = SCENES[i];
    const u = new SpeechSynthesisUtterance(s.t + '. ' + s.s); u.rate = .95;
    const v = speechSynthesis.getVoices().find(x => /^en/i.test(x.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  function paintBars(p) {
    dlg.querySelectorAll('.fv-bars i').forEach((b, n) => { b.style.width = (n < i ? 100 : n > i ? 0 : p * 100) + '%'; });
  }
  function tick() {
    if (!playing) return;
    const p = Math.min(1, 1 - (left - (performance.now() - t0)) / DUR);
    paintBars(p);
    if (p >= 1) { if (i < SCENES.length - 1) showScene(i + 1); else finish(); return; }
    timer = requestAnimationFrame(tick);
  }
  function showScene(n) {
    i = n; dlg.querySelector('.fv-end').hidden = true;
    dlg.querySelectorAll('.fv-scene').forEach(s => { s.classList.toggle('on', +s.dataset.n === n); });
    left = DUR; t0 = performance.now(); playing = true; dlg.querySelector('.fv-pp').textContent = 'Ⅱ Pause';
    cancelAnimationFrame(timer); paintBars(0); timer = requestAnimationFrame(tick); speak();
  }
  function pause() { playing = false; left -= performance.now() - t0; cancelAnimationFrame(timer); dlg.querySelector('.fv-pp').textContent = '▶ Play'; dlg.classList.add('paused'); stopVoice(); }
  function resume() { playing = true; t0 = performance.now(); dlg.classList.remove('paused'); dlg.querySelector('.fv-pp').textContent = 'Ⅱ Pause'; timer = requestAnimationFrame(tick); }
  function finish() { playing = false; cancelAnimationFrame(timer); paintBars(1); dlg.querySelector('.fv-end').hidden = false; stopVoice(); }
  function close() { playing = false; cancelAnimationFrame(timer); stopVoice(); dlg.close(); }
  play.onclick = () => { if (!dlg) build(); try { dlg.showModal(); } catch { dlg.setAttribute('open', ''); } dlg.classList.toggle('still', reduce); showScene(0); };
})();
