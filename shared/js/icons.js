/* Smart MUET Hub – icon set v2 "Sticker" (shared/js/icons.js)
   Matches the hub theme: navy ink lines + offset colour fill (sticky-note feel).
   24px grid · 2.2px rounded strokes · line colour = currentColor · fill = --tone (set in icons.css)
   Usage:
     <span data-icon="home"></span>             → auto-replaced on load
     el.innerHTML = smhIcon('review', 'Review')  → from JS
     <body data-tab="learn">                     → highlights that nav tab
     smhSetBadge('lab', 4)                        → due-count bubble on a tab
*/
(function () {
  // f = colour fill (drawn slightly offset, like a misprinted sticker), s = ink lines
  const P = {
    // ── Main nav ─────────────────────────────
    home: {
      f: '<path d="M5 9.5 12 4l7 5.5V20H5z"/>',
      s: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-5.5a2 2 0 0 1 4 0V21h4a1 1 0 0 0 1-1V9.5"/>'
    },
    learn: {
      f: '<path d="M2 9l10-5 10 5-10 5z"/>',
      s: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v5.5"/><circle cx="22" cy="16" r=".6"/>'
    },
    lab: {
      f: '<path d="M7.6 14.5h8.8l3.1 4A1.7 1.7 0 0 1 18 21H6a1.7 1.7 0 0 1-1.5-2.5z"/>',
      s: '<path d="M9 3h6"/><path d="M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 14.5c1.5.8 3 .8 4.5 0s3-.8 4.5 0"/><path d="M11 18h.01M14 17h.01"/>'
    },
    vault: {
      f: '<rect x="3" y="3" width="18" height="16" rx="3"/>',
      s: '<rect x="3" y="3" width="18" height="16" rx="3"/><circle cx="12" cy="11" r="3.5"/><path d="M12 11l1.6-1.6"/><path d="M7 19v2M17 19v2"/>'
    },
    review: {
      f: '<circle cx="12.5" cy="12.5" r="7.5"/>',
      s: '<path d="M3.5 12a8.5 8.5 0 1 0 2.8-6.3L3.5 8.2"/><path d="M3.5 3.5v4.7h4.7"/><path d="M12 7.5V12l3 2"/>'
    },
    me: {
      f: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0z"/>',
      s: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M10.5 8.5c.8.7 2.2.7 3 0"/>'
    },
    ebook: {
      f: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-2.5H2z"/>',
      s: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/><path d="M15.5 8.5h3M15.5 12h3"/>'
    },
    arcade: {
      f: '<rect x="2" y="6" width="20" height="12" rx="6"/>',
      s: '<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/>'
    },
    diagnostic: {
      f: '<rect x="4" y="4" width="16" height="18" rx="2"/>',
      s: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m8.5 14 2.5 2.5 4.5-5"/>'
    },
    // ── Four skills ──────────────────────────
    listening: {
      f: '<rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
      s: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>'
    },
    speaking: {
      f: '<rect x="9" y="2" width="6" height="12" rx="3"/>',
      s: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4M8.5 22h7"/>'
    },
    reading: {
      f: '<circle cx="16" cy="15" r="4"/>',
      s: '<path d="M4 5h11M4 9h7M4 13h4M4 17h3"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 3"/>'
    },
    writing: {
      f: '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
      s: '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/><path d="m14.5 5.5 3 3"/><path d="M12 21c2-1.5 4 1 6-.5s2.5-.5 3.5 0"/>'
    },
    // ── Progress / gamification ──────────────
    streak: {
      f: '<path d="M12 2c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
      s: '<path d="M12 2c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/><path d="M12 19a2 2 0 0 1-2-2c0-1.2 1-2 2-3 1 1 2 1.8 2 3a2 2 0 0 1-2 2z"/>'
    },
    xp: {
      f: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
      s: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'
    },
    badge: {
      f: '<circle cx="12" cy="9" r="6"/>',
      s: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/><path d="m10 9 1.5 1.5L14.5 7.5"/>'
    },
    reflect: {
      f: '<path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
      s: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/><path d="M10 8.5a2.5 2.5 0 0 1 2-1.5"/>'
    },
    // ── Doodles & utility (ink only) ─────────
    spark:  { s: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>' },
    open:   { s: '<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>' },
    back:   { s: '<path d="m15 18-6-6 6-6"/>' },
    next:   { s: '<path d="m9 18 6-6-6-6"/>' },
    close:  { s: '<path d="M18 6 6 18M6 6l12 12"/>' },
    menu:   { s: '<path d="M9 5v14M15 5v14"/>' },          /* matches the hub header's "||" */
    settings: { s: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.5 14h5M9.5 8h5M17.5 16h5"/>' }
  };

  const INK = 'fill:none;stroke:currentColor;stroke-width:var(--ico-stroke,2.2);stroke-linecap:round;stroke-linejoin:round';
  const sprite = '<svg id="smh-icons" xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">' +
    Object.entries(P).map(([k, v]) =>
      `<symbol id="i-${k}" viewBox="0 0 24 24">` +
      (v.f ? `<g class="f" style="fill:var(--tone,#ffcc33);stroke:none;opacity:var(--tone-o,1)" transform="translate(1.4 1.4)">${v.f}</g>` : '') +
      `<g style="${INK}">${v.s}</g></symbol>`
    ).join('') + '</svg>';

  function smhIcon(name, label) {
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
    return `<svg class="ico ico-${name}" ${a11y}><use href="#i-${name}"/></svg>`;
  }

  function init() {
    if (!document.getElementById('smh-icons')) document.body.insertAdjacentHTML('afterbegin', sprite);
    document.querySelectorAll('[data-icon]').forEach(el => {
      el.outerHTML = smhIcon(el.dataset.icon, el.dataset.label);
    });
    const tab = document.body.dataset.tab;
    if (tab) document.querySelectorAll('.smh-nav a[data-tab]').forEach(a => {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
    });
  }

  window.smhIcon = smhIcon;
  window.SMH_ICON_NAMES = Object.keys(P);
  window.smhSetBadge = (tab, n) => {
    const a = document.querySelector(`.smh-nav a[data-tab="${tab}"]`);
    if (!a) return;
    let b = a.querySelector('.smh-badge');
    if (!n) { b && b.remove(); return; }
    if (!b) { b = document.createElement('span'); b.className = 'smh-badge'; a.appendChild(b); }
    b.textContent = n > 99 ? '99+' : n;
  };

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
