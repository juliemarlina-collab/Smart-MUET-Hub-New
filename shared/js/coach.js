/* Smart MUET Hub · Coach (21 Oct 2026)
   eBook-style help on every page:
   1. "Guide me" tour: numbered steps that spotlight the important parts of a page with a dialogue box.
      Opens by itself the first time a student visits a page, then from the Guide me button.
   2. Step coach: on Labs and guides, a dialogue box explains the numbered step that is open.
   3. Inline dialogue boxes where a page needs a "what to do" note.
   Loaded by shell.js. Nothing is uploaded; "seen" flags live in localStorage (smh.coach.seen). */
(() => {
  'use strict';
  if (window.__smhCoach) return; window.__smhCoach = true;
  const body = document.body, id = body.dataset.pageId || '', root = body.dataset.appRoot || '../';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const seenKey = 'smh.coach.seen';
  const seen = () => { try { return JSON.parse(localStorage.getItem(seenKey)) || {}; } catch { return {}; } };
  const markSeen = k => { try { const s = seen(); s[k] = 1; localStorage.setItem(seenKey, JSON.stringify(s)); } catch {} };
  const paper = (id.match(/listening|speaking|reading|writing/) || [])[0];
  const TECH = { listening: 'CLUE', speaking: 'PREP', reading: 'SCAN', writing: 'PEEL' };
  const NAME = { listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing' };

  /* ---------- tour steps per page: [selector, title, text] ---------- */
  const lab = [
    ['nav.steps', 'Six numbered steps', 'Do them in order: 01 Start → 02 I do (watch the model) → 03 We do (guided drills) → 04 You do (on your own) → 05 Check → 06 Reflect.'],
    ['#workspace', 'Your working space', 'Each step opens here. Read the yellow coach box first: it tells you exactly what to do.'],
    ['.step-footer', 'Move on when ready', 'Use Next step when you finish. Back always works, nothing is lost.']
  ];
  const vaultPaper = [
    ['.smh-band', 'Where you are', 'This is one paper inside the Vault. The bar shows the level and the paper code.'],
    ['main', 'Answer part by part', 'Work through each part. When you check a part, the explanation shows straight away so you learn from every question.']
  ];
  const T = {
    home: [
      ['.h-switch', 'Start here', 'Tap First MUET if this is your first time, or I\'ve sat MUET before to see your progress and continue.'],
      ['#h-target', 'Set your target band', 'Choose the band your programme asks for. The Hub uses it to show how far you are from your goal.'],
      ['#ebook', 'Read the eBook', 'Each chapter explains one part of MUET. Tap a chapter to open the book at that page.'],
      ['.h-stages-wrap', 'Five stages to your band', 'Follow the stages in order. The yellow card shows where you are now.'],
      ['.h-papers', 'Four papers, four techniques', 'CLUE, PREP, SCAN and PEEL. Tap a paper to learn its technique.']
    ],
    ebook: [
      ['#book-open', 'Open the book', 'Pages turn like a real book: drag a page, tap the edge or use the arrows.'],
      ['.pg-stats', 'Your reading record', 'Pages read, stars won and games played are counted for you.'],
      ['.h-chapters', 'Eight chapters', 'Tap a chapter to jump straight to its first page.'],
      ['.pg-routes', 'From page to practice', 'For each paper: read the chapter, learn the 6 steps, then try the Lab.']
    ],
    intro: [
      ['.chapter-nav', 'Pick a paper', 'Overview first, then one guide for each paper.'],
      ['#skills', 'Four learning folders', 'Open a folder to see what the paper tests and a small task to try today.'],
      ['#language', 'Language bank', 'Useful phrases for each paper. Tap to hear them, then use them in the Lab.'],
      ['#traps', 'Trap spotter', 'Common MUET traps. Spot them here so they do not catch you in the test.']
    ],
    vault: [
      ['#pc-check', 'Step 1 · Take the 10-minute check', 'Start here if you are new. It finds your strongest and weakest paper and builds a 3-week plan.'],
      ['#pc-review', 'Review again', 'Questions you missed come back after 3 days. Clear them before new work.'],
      ['.pf-grid', 'Three practice folders', '01 Lab (learn it) → 02 Vault (test it) → 03 Arcade (keep it sharp). Tap a folder to open it.'],
      ['.smh-tips', 'Four habits', 'Lab before Vault, one paper a day, clear your mistakes, and warm up with a game.']
    ],
    me: [
      ['#me-cert', 'Your certificate', 'Finish all nine activities and your certificate is made for you automatically.'],
      ['.me-profile', 'Your details', 'Type your name, class and target band once. They appear on your results and certificate.'],
      ['#me-summary', 'Your practice band', 'When all four papers in a level are done, your total out of 360 gives a practice band.'],
      ['#errors', 'Error log', 'Every question you missed is listed here, with the reason. Redo them in Review again.']
    ],
    certificate: [
      ['.ct-stats', 'How far you are', 'Nine activities make the full journey.'],
      ['#ct-list', 'The checklist', 'Each activity ticks itself when you finish it. Tap one to go there.']
    ],
    diagnostic: [
      ['#set-map', 'Four short sets', 'Listening, Reading, Writing, Speaking. About 10 minutes in total.'],
      ['#workspace', 'Answer and learn', 'Choose an answer. The explanation opens straight away in a dialogue box: read it, then go on.'],
      ['#begin', 'Ready?', 'Tap Start when you are ready. There is no timer.']
    ],
    listeninglab: lab, speakinglab: lab, readinglab: lab, writinglab: lab,
    review: [['main', 'Review again', 'These are questions you missed earlier. Answer them again; the explanation shows after each one.']],
    listening: [['.step-nav', 'Numbered steps', 'Work through the steps in order. The coach box under the steps tells you what to do.'], ['#lesson', 'Your lesson', 'Each step opens here. Mark it done to move on.']],
    vault1: [['#level-ring', 'Your level', 'Four papers make one level. The ring fills as you finish each one.'], ['#level-cards', 'Four paper folders', 'Tap a paper to see how to try it, then start. Listening first is a good order.']],
    arcade: [['.smh-folders', 'Pick a game', 'Each game trains one MUET skill in 3 minutes. Camera mode is optional.'], ['.smh-tips', 'How to play', 'Tap, drag or use the keyboard. Wrong answers go to Review again.']]
  };
  ['speaking', 'reading', 'writing'].forEach(k => { T[k] = T.listening; });
  ['vault2', 'mock1'].forEach(k => { T[k] = T.vault1; });
  Object.keys({ 'v1-': 1, 'v2-': 1, 'mock1-': 1 }).forEach(p => ['listening', 'speaking', 'reading', 'writing'].forEach(k => { T[p + k] = vaultPaper; }));

  /* ---------- tour engine ---------- */
  const steps = (T[id] || []).filter(([s]) => { const e = $(s); return e && e.getClientRects().length; });
  let idx = -1, ring = null, bubble = null, scrim = null;
  function place() {
    if (idx < 0) return;
    const target = $(steps[idx][0]); if (!target) return;
    const r = target.getBoundingClientRect(), pad = 8;
    Object.assign(ring.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: Math.min(r.height + pad * 2, innerHeight - 40) + 'px' });
    const bw = Math.min(360, innerWidth - 24), below = r.bottom + 16 + 200 < innerHeight || r.top < 220;
    let left = Math.min(Math.max(12, r.left + r.width / 2 - bw / 2), innerWidth - bw - 12);
    bubble.style.width = bw + 'px'; bubble.style.left = left + 'px';
    bubble.classList.toggle('above', !below);
    if (below) { bubble.style.top = Math.min(innerHeight - 220, Math.max(12, r.bottom + 14)) + 'px'; bubble.style.bottom = 'auto'; }
    else { bubble.style.top = 'auto'; bubble.style.bottom = Math.max(12, innerHeight - r.top + 14) + 'px'; }
    const arrowX = Math.min(bw - 28, Math.max(20, r.left + r.width / 2 - left));
    bubble.style.setProperty('--ax', arrowX + 'px');
  }
  function show(i) {
    idx = i; const [sel, title, text] = steps[i], target = $(sel);
    target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    bubble.querySelector('.cb-n').textContent = (i + 1) + ' of ' + steps.length;
    bubble.querySelector('h2').textContent = title;
    bubble.querySelector('p').textContent = text;
    bubble.querySelector('.cb-back').hidden = i === 0;
    bubble.querySelector('.cb-next').textContent = i === steps.length - 1 ? 'Got it ✓' : 'Next →';
    setTimeout(place, 350); place();
    bubble.querySelector('.cb-next').focus({ preventScroll: true });
  }
  function close() {
    idx = -1; [ring, bubble, scrim].forEach(e => e && e.remove()); ring = bubble = scrim = null;
    removeEventListener('scroll', place, true); removeEventListener('resize', place);
    markSeen(id);
  }
  function start() {
    if (!steps.length || bubble) return;
    scrim = el('div', 'coach-scrim'); scrim.onclick = close;
    ring = el('div', 'coach-ring');
    bubble = el('div', 'coach-bubble'); bubble.setAttribute('role', 'dialog'); bubble.setAttribute('aria-modal', 'false'); bubble.setAttribute('aria-label', 'Page guide');
    const head = el('div', 'cb-head'); head.append(el('span', 'cb-av', '✳'), el('span', 'cb-n'));
    const x = el('button', 'cb-x', '✕'); x.type = 'button'; x.setAttribute('aria-label', 'Close the guide'); x.onclick = close; head.append(x);
    const btns = el('div', 'cb-btns');
    const back = el('button', 'cb-back', '← Back'); back.type = 'button'; back.onclick = () => show(idx - 1);
    const next = el('button', 'cb-next', 'Next →'); next.type = 'button'; next.onclick = () => idx >= steps.length - 1 ? close() : show(idx + 1);
    btns.append(back, next);
    bubble.append(head, el('h2'), el('p'), btns);
    body.append(scrim, ring, bubble);
    addEventListener('scroll', place, true); addEventListener('resize', place);
    show(0);
  }
  addEventListener('keydown', e => { if (!bubble) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') bubble.querySelector('.cb-next').click(); else if (e.key === 'ArrowLeft' && idx > 0) show(idx - 1); });

  /* Guide me button */
  if (steps.length) {
    const g = el('button', 'coach-fab'); g.type = 'button'; g.setAttribute('aria-label', 'Guide me through this page');
    g.innerHTML = '<span aria-hidden="true">?</span><b>Guide me</b>';
    g.onclick = start; body.append(g);
    if (!seen()[id] && !location.hash.match(/^#(p|page=)/)) setTimeout(start, 900);
  }

  /* ---------- inline dialogue boxes ---------- */
  function say(where, how, title, text, cls = '') {
    const t = typeof where === 'string' ? $(where) : where; if (!t) return null;
    const d = el('aside', 'coach-say ' + cls); d.setAttribute('role', 'note');
    const av = el('span', 'cs-av', '✳'); av.setAttribute('aria-hidden', 'true');
    const tx = el('div', 'cs-tx'); tx.append(el('b', '', title), el('p', '', text));
    d.append(av, tx);
    if (how === 'after') t.after(d); else if (how === 'before') t.before(d); else t.append(d);
    return d;
  }
  if (id === 'vault') {
    say('.smh-hero-grid > div > p:last-of-type', 'after', 'New here? Start with step 1.', 'Take the 10-minute check first. It tells you which paper to practise first and builds your 3-week plan.');
    say('.smh-tips .board > div:first-child', 'in', 'Coach tip', 'Do one Lab, then the matching Vault paper on the same day. Your mistakes come back in Review again after 3 days.', 'sun');
  }
  if (id === 'me') say('.me-profile', 'before', 'Fill this in once', 'Your name and class go on your results PDF and your certificate. Your target band shows the gap you still need to close.');

  /* ---------- step coach for the Labs (six numbered steps) ---------- */
  if (/lab$/.test(id) && $('nav.steps')) {
    const tech = TECH[paper] || '', nm = NAME[paper] || '';
    const LAB = [
      ['01 · Start here', 'Read the goal and choose one focus. This takes 1 minute.'],
      ['02 · I do: watch the model', 'Follow the worked example. Tap each ' + tech + ' letter and see how a strong answer is built.'],
      ['03 · We do: guided drills', 'Try the three short drills. Check each one; the explanation appears straight away. You can change your answer.'],
      ['04 · You do: on your own', 'Now try a full ' + nm + ' task by yourself. Use the timer if you want exam pressure.'],
      ['05 · Check and improve', 'Compare your answer with the checklist. Fix one thing, not everything.'],
      ['06 · Reflect and next', 'Write one sentence: what will you do differently next time? Then go to Vault 1 ' + nm + '.']
    ];
    const box = el('aside', 'coach-say coach-step'); box.setAttribute('role', 'status');
    const av = el('span', 'cs-av', '✳'); av.setAttribute('aria-hidden', 'true');
    const tx = el('div', 'cs-tx'); const b = el('b'), p = el('p'); tx.append(b, p); box.append(av, tx);
    $('nav.steps').after(box);
    const paint = () => {
      const btns = $$('nav.steps [data-step]'); const i = Math.max(0, btns.findIndex(x => x.getAttribute('aria-current') === 'step'));
      const [t, s] = LAB[Math.min(i, 5)]; b.textContent = 'Step ' + t; p.textContent = s;
      box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop');
    };
    paint();
    new MutationObserver(paint).observe($('nav.steps'), { attributes: true, subtree: true, attributeFilter: ['aria-current'] });
  }
  /* guides: the step nav already has "What to do" boxes; label the numbers */
  if (['listening', 'speaking', 'reading', 'writing'].includes(id) && $('.step-nav')) {
    say('.step-nav', 'after', 'How this guide works', 'Open the steps in number order. Each one starts with a WHAT TO DO box. Mark it done to move to the next number.', 'slim');
  }
})();
