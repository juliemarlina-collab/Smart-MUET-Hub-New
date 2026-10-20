/* Smart MUET Hub · shared shell.
   Builds the same header, page band and footer on every page and hides the old per-page header/footer.
   Motion always plays and the 3D view is always used (no Pause motion / Use 2D view buttons);
   only the Arcade's Sound button is kept, in the band. Visitors who ask their device for reduced motion still get it.
   Loaded by shared/js/navigation.js. */
(() => {
  'use strict';
  if (document.querySelector('.smh-header')) return;
  const THEME_KEY = 'smh.theme';
  const readTheme = () => { try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } };
  document.documentElement.dataset.smhTheme = readTheme();
  /* motion on, 3D view on: clear old saved "paused" choices and keep the page classes off */
  try { localStorage.removeItem('smh.rebuild.motionPaused'); } catch {}
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const strip = () => { const c = document.documentElement.classList; ['no-motion', 'motion-paused', 'flat'].forEach(k => c.contains(k) && c.remove(k)); };
    strip();
    new MutationObserver(strip).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
  const body = document.body, root = body.dataset.appRoot || '../', id = body.dataset.pageId || '';

  // id: [crumbs, type, exit (activity pages), tab, code]
  const L = (t, p) => [t, p];
  const learn = L('Learn', 'learn.html'), vault = L('Practice', 'practice.html'),
        v1 = L('Vault 1', 'vault/vault1.html'), v2 = L('Vault 2', 'vault/vault2.html'), m1 = L('Mock 1', 'vault/mock1.html'),
        arc = L('Arcade', 'arcade/index.html'), me = L('Me', 'me.html');
  const P = {
    home:        [[], 'hub', '', 'home', ''],
    welcome:     [[['Know MUET']], 'hub', '', 'home', 'Step 00'],
    account:     [[me, ['My account']], 'hub', '', 'me', ''],
    intro:       [[learn, ['Know your MUET']], 'hub', '', 'learn', 'Chapter 1'],
    listening:   [[learn, ['Listening · CLUE']], 'lesson', '', 'learn', 'Chapter 3'],
    speaking:    [[learn, ['Speaking · PREP']], 'lesson', '', 'learn', 'Chapter 4'],
    reading:     [[learn, ['Reading · SCAN']], 'lesson', '', 'learn', 'Chapter 5'],
    writing:     [[learn, ['Writing · PEEL']], 'lesson', '', 'learn', 'Chapter 6'],
    diagnostic:  [[['10-minute check']], 'activity', 'index.html', 'home', 'Step 01'],
    vault:       [[['Practice · Lab, MUET Vault & Arcade']], 'hub', '', 'vault', ''],
    listeninglab:[[vault, ['Listening CLUE Lab']], 'activity', 'practice.html', 'vault', 'Lab · 800/1'],
    speakinglab: [[vault, ['Speaking PREP Lab']], 'activity', 'practice.html', 'vault', 'Lab · 800/2'],
    readinglab:  [[vault, ['Reading SCAN Lab']], 'activity', 'practice.html', 'vault', 'Lab · 800/3'],
    writinglab:  [[vault, ['Writing PEEL Lab']], 'activity', 'practice.html', 'vault', 'Lab · 800/4'],
    review:      [[vault, ['Review again']], 'activity', 'practice.html', 'vault', 'Daily'],
    vault1:      [[vault, ['Vault 1 · Guided']], 'hub', '', 'vault', 'Level 1'],
    vault2:      [[vault, ['Vault 2 · Less support']], 'hub', '', 'vault', 'Level 2'],
    mock1:       [[vault, ['Mock 1 · Exam conditions']], 'hub', '', 'vault', 'Level 3'],
    'v1-listening': [[vault, v1, ['Listening']], 'activity', 'vault/vault1.html', 'vault', '800/1'],
    'v1-speaking':  [[vault, v1, ['Speaking']], 'activity', 'vault/vault1.html', 'vault', '800/2'],
    'v1-reading':   [[vault, v1, ['Reading']], 'activity', 'vault/vault1.html', 'vault', '800/3'],
    'v1-writing':   [[vault, v1, ['Writing']], 'activity', 'vault/vault1.html', 'vault', '800/4'],
    'v2-listening': [[vault, v2, ['Listening']], 'activity', 'vault/vault2.html', 'vault', '800/1'],
    'v2-speaking':  [[vault, v2, ['Speaking']], 'activity', 'vault/vault2.html', 'vault', '800/2'],
    'v2-reading':   [[vault, v2, ['Reading']], 'activity', 'vault/vault2.html', 'vault', '800/3'],
    'v2-writing':   [[vault, v2, ['Writing']], 'activity', 'vault/vault2.html', 'vault', '800/4'],
    'mock1-listening': [[vault, m1, ['Listening']], 'activity', 'vault/mock1.html', 'vault', '800/1'],
    'mock1-speaking':  [[vault, m1, ['Speaking']], 'activity', 'vault/mock1.html', 'vault', '800/2'],
    'mock1-reading':   [[vault, m1, ['Reading']], 'activity', 'vault/mock1.html', 'vault', '800/3'],
    'mock1-writing':   [[vault, m1, ['Writing']], 'activity', 'vault/mock1.html', 'vault', '800/4'],
    arcade:        [[vault, ['Arcade']], 'hub', '', 'vault', '3-min games'],
    'arcade-grab': [[vault, arc, ['Grab & Throw']], 'activity', 'arcade/index.html', 'vault', 'Arcade'],
    'arcade-slice':[[vault, arc, ['Air Slice']], 'activity', 'arcade/index.html', 'vault', 'Arcade'],
    'arcade-boss': [[vault, arc, ['Monster Punch']], 'activity', 'arcade/index.html', 'vault', 'Boss battle'],
    me:          [[['Me · My progress']], 'hub', '', 'me', ''],
    ebook:       [[['eBook']], 'hub', '', 'book', ''],
    certificate: [[me, ['Certificate']], 'hub', '', 'me', ''],
    'arcade-thunder': [[vault, arc, ['Thunder Lock']], 'activity', 'arcade/index.html', 'vault', 'Arcade']
  };
  const meta = P[id];
  if (!meta) return;
  const [crumbs, type, exit, tab, code] = meta;
  const html = document.documentElement;
  html.classList.add('smh-shell');
  if (type === 'activity') html.classList.add('smh-focus');
  /* paper colour, the same as the eBook chapters: Listening cobalt · Speaking teal · Reading orange · Writing magenta */
  const paper = /^arcade/.test(id) ? 'arcade' : (id.match(/listening|speaking|reading|writing/) || [])[0];
  if (paper) html.dataset.paper = paper;
  /* one main colour per page: a frame behind the hero picture, the hero heading accent and the page buttons */
  /* style v6: Home blue · Learn the paper's own colour · Practice coral · Me mint (eBook navy lives in book) */
  const MAIN = { ebook: 'navy', certificate: 'navy', home: 'blue', intro: 'blue', welcome: 'blue', account: 'blue', diagnostic: 'blue',
    vault: 'coral', review: 'coral', vault1: 'coral', vault2: 'coral', mock1: 'coral', arcade: 'coral', me: 'mint' };
  html.dataset.main = paper && paper !== 'arcade' ? paper : (MAIN[id] || (/^arcade/.test(id) ? 'coral' : 'blue'));
  if (/^(v1|v2|mock1)-/.test(id)) html.classList.add('smh-paperpage');
  /* pages that open with the handwritten greeting share one hero style */
  const markHero = () => {
    const hero = !!document.querySelector('main :is(.hello,.red-hello,.handwritten)');
    if (hero) html.classList.add('smh-hero');
    const h1 = document.querySelector('main h1');
    if (h1 && (hero || type !== 'activity')) h1.classList.add('smh-h1');
  };
  markHero();

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const link = (text, path, cls) => { const a = el('a', cls, text); a.href = root + path; return a; };
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const safe = p => typeof p === 'string' && /^(?:(?:welcome|account|guides|book|labs|vault|arcade)\/[a-z0-9-]+|learn|practice|me|ebook|certificate)\.html(?:#[a-z0-9=.-]+)?$/i.test(p);

  /* old frame: keep its working buttons, its skip link and its back link */
  const oldHeader = document.querySelector('body>header:not(.smh-header)');
  const tools = oldHeader ? [...oldHeader.querySelectorAll('button#sound')] : [];
  const oldSkip = document.querySelector('a.skip, a[class*="skip"]');
  const oldBack = oldHeader && [...oldHeader.querySelectorAll('a')].find(a => /←/.test(a.textContent));
  const mainTarget = document.querySelector('main[id]') || document.querySelector('main');

  /* ---------- header ---------- */
  const header = el('header', 'smh-header');
  const hin = el('div', 'in');
  const logo = link('', 'index.html', 'smh-logo');
  const img = el('img'); img.src = root + 'shared/assets/logo.svg'; img.alt = '';
  const words = el('span', 'smh-name'); words.append(el('b', '', 'Smart MUET'), el('b', '', 'Hub'));
  logo.append(img, words); logo.setAttribute('aria-label', 'Smart MUET Hub home');
  hin.append(logo);

  if (type === 'activity') {
    const back = link('✕  Exit', exit, 'smh-exit');
    if (oldBack && oldBack.getAttribute('href')) back.href = oldBack.href;
    back.setAttribute('aria-label', 'Exit to ' + (crumbs[crumbs.length - 2]?.[0] || 'Home'));
    hin.append(back);
  } else {
    const nav = el('nav', 'smh-menu'); nav.setAttribute('aria-label', 'Hub sections');
    /* line icons, the same shapes as the bottom app bar (shared/js/icons.js) */
    const ICO = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-5.5a2 2 0 0 1 4 0V21h4a1 1 0 0 0 1-1V9.5"/>',
      book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
      learn: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v5.5"/>',
      vault: '<path d="M9 3h6"/><path d="M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 14.5c1.5.8 3 .8 4.5 0s3-.8 4.5 0"/>',
      me: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
    };
    [['home', 'Home', 'index.html'], ['book', 'eBook', 'ebook.html'], ['learn', 'Learn', 'learn.html'], ['vault', 'Practice', 'practice.html'], ['me', 'Me', 'me.html']]
      .forEach(([t, label, path]) => {
        const a = link('', path);
        a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICO[t] + '</svg>';
        a.append(el('span', '', label));
        if (t === tab) a.setAttribute('aria-current', 'page');
        nav.append(a);
      });
    hin.append(nav);
    const last = get('smh.flow.last', {});
    const cta = safe(last.path) && last.id !== id ? link('Continue →', last.path, 'smh-cta') : link('Start here →', id === 'home' ? 'welcome/index.html' : 'index.html#start', 'smh-cta');
    if (safe(last.path) && last.label) cta.title = 'Continue: ' + last.label;
    hin.append(cta);
  }
  /* theme setting: light (default) or dark, remembered on this device */
  const tbtn = el('button', 'smh-theme'); tbtn.type = 'button';
  const tbtn2 = el('button', 'smh-theme smh-theme-foot'); tbtn2.type = 'button';
  const paintTheme = () => { paintOne(tbtn); paintOne(tbtn2); };
  const paintOne = tbtn => {
    const dark = document.documentElement.dataset.smhTheme === 'dark';
    tbtn.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><span>Light</span>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><span>Dark</span>';
    tbtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    tbtn.title = tbtn.getAttribute('aria-label');
  };
  const flip = () => {
    const next = document.documentElement.dataset.smhTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.smhTheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    paintTheme();
  };
  tbtn.addEventListener('click', flip);
  tbtn2.addEventListener('click', flip);
  paintTheme();
  const endBtn = hin.querySelector('.smh-cta, .smh-exit');
  hin.insertBefore(tbtn, endBtn);
  /* Back: the page you came from on this site, otherwise one level up */
  if (id !== 'home') {
    const up = crumbs.length > 1 && crumbs[crumbs.length - 2][1] ? crumbs[crumbs.length - 2][1] : 'index.html';
    const back = link('', up, 'smh-back');
    back.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Back</span>';
    back.setAttribute('aria-label', 'Go back');
    back.addEventListener('click', e => {
      let same = false;
      try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch {}
      if (same && history.length > 1) { e.preventDefault(); history.back(); }
    });
    hin.insertBefore(back, tbtn);
  }
  header.append(hin);

  /* ---------- band ---------- */
  let band = null;
  /* no band on the Learn pages (no breadcrumb or chapter chip there) */
  /* the strip under the header only carries game tools now (the header and Back already show where you are) */
  if (tools.length) {
    band = el('div', 'smh-band');
    const bin = el('div', 'in');
    const c = el('nav', 'smh-crumbs'); c.setAttribute('aria-label', 'You are here');
    c.append(link('Home', 'index.html'));
    crumbs.forEach(([t, p], i) => {
      const s = el('span', '', '›'); s.setAttribute('aria-hidden', 'true'); c.append(s);
      if (p && i < crumbs.length - 1) c.append(link(t, p)); else c.append(el('b', '', t));
    });
    bin.append(c);
    if (tools.length) { const t = el('div', 'smh-tools'); tools.forEach(b => t.append(b)); bin.append(t); }
    if (code) bin.append(el('span', 'code', code));
    band.append(bin);
  }

  /* ---------- footer ---------- */
  let footer = null;
  if (type !== 'activity') {
    footer = el('footer', 'smh-footer');
    const fin = el('div', 'in');
    const a = el('div'); const fb = el('b', 'smh-foot-name', 'Smart MUET '); fb.append(el('span', '', 'Hub')); a.append(fb, el('p', '', 'Know the test. Build your skills. Band up. Free MUET practice by the English Language Unit, Jabatan Pengajian Am, Politeknik Port Dickson.'));
    const b = el('div'); b.append(el('h2', '', 'Your route'), link('Know MUET', 'welcome/index.html'), link('10-minute check', 'labs/diagnostic.html'), link('Learn the skills', 'learn.html'), link('Practice: Labs, Vault & Arcade', 'practice.html'));
    const d = el('div'); d.append(el('h2', '', 'More'), link('eBook', 'ebook.html'), link('Arcade', 'arcade/index.html'), link('My progress', 'me.html'), link('My certificate', 'certificate.html'), link('My account', 'account/index.html'));
    const fine = el('p', 'fine', 'Your practice is saved on this device only. © 2027 English Language Unit, JPA, Politeknik Port Dickson.');
    const set = el('div', 'smh-foot-theme'); set.append(el('h2', '', 'Display'), tbtn2); // phone: the theme switch lives here so the header fits
    fin.append(a, b, d, set, fine); footer.append(fin);
  }

  /* ---------- folders: closed until tapped, one open at a time (works for folders built later too) ---------- */
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (!(d instanceof Element) || !d.matches('.smh-folder') || !d.open) return;
    const group = d.closest('.smh-folders');
    if (group) group.querySelectorAll('.smh-folder[open]').forEach(o => { if (o !== d) o.open = false; });
  }, true);

  /* ---------- mount ---------- */
  const skip = el('a', 'smh-skip', 'Skip to content');
  if (mainTarget) { if (!mainTarget.id) mainTarget.id = 'main'; skip.href = '#' + mainTarget.id; }
  else skip.href = '#';
  if (oldSkip) oldSkip.hidden = true; // keep it: some pages update its link
  body.prepend(skip, header);
  if (band) header.after(band);
  if (footer) {
    const nav = document.querySelector('.smh-nav');
    if (nav) nav.before(footer); else body.append(footer);
    // pages append the bottom nav after this script runs; keep the footer above it
    new MutationObserver(() => { const n = document.querySelector('.smh-nav'); if (n && n.previousElementSibling !== footer && footer.nextElementSibling !== n) n.before(footer); })
      .observe(body, { childList: true });
  }
})();
