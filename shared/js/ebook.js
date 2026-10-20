/* Smart MUET Hub · eBook page: pages read, stars and games, chapter tags. Reads this device's records only. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const G = { 4: [['1.4', 8]], 17: [['3.3', 3], ['3.4', 14], ['3.5', 2]], 24: [['4.3', 4], ['4.4', 8], ['4.5', 2]], 31: [['5.3', 3], ['5.4', 10], ['5.5', 2]], 38: [['6.3', 4], ['6.4', 12], ['6.5', 2]], 45: [['7', 8]] };
  function paint() {
    const read = new Set((get('smh.pdfbook.v1.read', []) || []).filter(Number.isInteger));
    const last = get('smh.pdfbook.v1.last', null);
    const q = get('smh.ebook.quiz.v1', {}) || {};
    const n = Math.min(53, read.size);
    $('#eb-pages').textContent = n;
    $('#book-bar').style.width = (n / 53 * 100) + '%';
    let stars = 0, games = 0;
    Object.values(q).forEach(v => { if (v && typeof v.best === 'number') { stars += v.best; games++; } });
    $('#eb-stars').textContent = stars;
    $('#eb-games').textContent = Math.min(14, games);
    const btn = $('#book-open');
    if (Number.isInteger(last) && last > 1 && last <= 53) { btn.href = 'book/index.html#page=' + last; btn.textContent = 'Continue at page ' + last + ' →'; }
    $$('.h-ch').forEach(a => {
      const from = +a.dataset.from, to = +a.dataset.to, all = to - from + 1; let got = 0;
      for (let p = from; p <= to; p++) if (read.has(p)) got++;
      a.classList.toggle('done', got === all);
      a.querySelector('.h-ch-st').textContent = got === all ? '✓ read' : got ? got + ' / ' + all + ' pages' : 'p. ' + from + '–' + to;
      const g = G[from]; if (!g) return;
      let s = a.querySelector('.h-ch-star');
      if (!s) { s = document.createElement('span'); s.className = 'h-ch-star'; a.append(s); }
      const won = g.reduce((t, [id, m]) => t + (q[id] ? Math.min(q[id].best, m) : 0), 0), max = g.reduce((t, [, m]) => t + m, 0), played = g.some(([id]) => q[id]);
      s.textContent = played ? '★ ' + won + ' / ' + max : '▶ ' + g.length + (g.length > 1 ? ' games' : ' game');
      s.classList.toggle('won', played);
    });
  }
  paint();
  window.addEventListener('storage', paint);
})();
