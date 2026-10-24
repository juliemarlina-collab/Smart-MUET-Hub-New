/* Smart MUET Hub · Me page: MUET practice results (Vault 1, Vault 2, Mock 1), learning records,
   print / save as PDF and a results download. Reads only records saved on this device. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const raw = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; };

  const PAPERS = [['listening', 'Listening', '800/1'], ['speaking', 'Speaking', '800/2'], ['reading', 'Reading', '800/3'], ['writing', 'Writing', '800/4']];
  const LEVELS = [['v1', 'Vault 1', 'Guided practice', 'f-yellow'], ['v2', 'Vault 2', 'Less support', 'f-purple'], ['mock1', 'Mock 1', 'Exam conditions', 'f-ink']];
  /* MUET aggregated score (out of 360) to band, as published by MPM for the 2021 format onwards */
  const BANDS = (window.MUETBands ? window.MUETBands.LEGACY : [[331, 'Band 5+', 'C1+'], [294, 'Band 5.0', 'C1'], [258, 'Band 4.5', 'B2'], [211, 'Band 4.0', 'B2'], [164, 'Band 3.5', 'B1'], [123, 'Band 3.0', 'B1'], [82, 'Band 2.5', 'A2'], [36, 'Band 2.0', 'A2'], [1, 'Band 1.0', 'A2']]);
  const BAND_ORDER = window.MUETBands ? window.MUETBands.ORDER.slice() : ['Band 1.0', 'Band 2.0', 'Band 2.5', 'Band 3.0', 'Band 3.5', 'Band 4.0', 'Band 4.5', 'Band 5.0', 'Band 5+'];
  const bandOf = t => (BANDS.find(([min]) => t >= min) || [0, '—', '']);

  function level(id) {
    const papers = PAPERS.map(([k, name, code]) => {
      const done = raw('muet_' + id + '_' + k) === 'true', s = parseInt(raw('muet_' + id + '_' + k + '_score90'), 10);
      return { k, name, code, done, score: Number.isFinite(s) ? Math.max(0, Math.min(90, s)) : null };
    });
    const scored = papers.filter(p => p.score !== null), complete = scored.length === 4;
    const total = scored.reduce((n, p) => n + p.score, 0);
    return { papers, complete, total, scoredCount: scored.length, band: complete ? bandOf(total) : null };
  }

  /* ---------- profile (name, class, target) for the printed record ---------- */
  const prof = get('smh.me.profile', {}) || {};
  [['me-name', 'name'], ['me-class', 'cls'], ['me-target', 'target']].forEach(([id, key]) => {
    const f = $(id); if (!f) return;
    f.value = typeof prof[key] === 'string' ? prof[key] : '';
    f.addEventListener('input', () => { prof[key] = f.value.slice(0, 80); put('smh.me.profile', JSON.stringify(prof)); render(); });
  });

  function render() {
    const L = LEVELS.map(([id, name, sub, cls]) => ({ id, name, sub, cls, ...level(id) }));
    const latest = [...L].reverse().find(x => x.complete);
    const target = prof.target || '';

    /* summary tiles */
    const sum = $('me-summary'); sum.replaceChildren();
    const gap = () => {
      if (!latest || !target) return '—';
      const d = BAND_ORDER.indexOf(target) - BAND_ORDER.indexOf(latest.band[1]);
      return d <= 0 ? 'Target reached ✓' : d + ' band step' + (d > 1 ? 's' : '') + ' to go';
    };
    [['Latest complete level', latest ? latest.name : 'None yet'], ['Practice band', latest ? latest.band[1] + ' · CEFR ' + latest.band[2] : '—'],
     ['Total', latest ? latest.total + ' / 360' : '—'], ['Target band', target || 'Not set'], ['Gap to target', gap()],
     ['Papers done', L.reduce((n, x) => n + x.papers.filter(p => p.done).length, 0) + ' / 12']]
      .forEach(([k, v]) => { const t = el('div', 'me-tile'); t.append(el('span', '', k), el('b', '', v)); sum.append(t); });

    /* level cards */
    const box = $('me-levels'); box.replaceChildren();
    L.forEach(x => {
      const card = el('article', 'me-level ' + x.cls);
      const head = el('div', 'me-level-head');
      const t = el('div'); t.append(el('span', 'me-tag', x.name.toUpperCase()), el('h3', '', x.name + ' · ' + x.sub));
      const tot = el('div', 'me-total');
      tot.append(el('b', '', x.scoredCount ? String(x.total) : '—'), el('span', '', '/ 360'));
      head.append(t, tot);
      const grid = el('div', 'me-papers');
      x.papers.forEach(p => {
        const c = el('div', 'me-paper p-' + p.k);
        c.append(el('span', '', p.name + ' · ' + p.code), el('b', '', p.score !== null ? String(p.score) : p.done ? 'Done' : '—'), el('small', '', p.score !== null ? '/ 90' : p.done ? 'no score saved' : 'not yet'));
        const bar = el('i'); bar.style.setProperty('--w', (p.score || 0) / 90 * 100 + '%'); c.append(bar);
        grid.append(c);
      });
      const foot = el('div', 'me-level-foot');
      foot.append(el('span', 'me-chip', x.papers.filter(p => p.done).length + ' / 4 papers'),
        el('b', '', x.complete ? 'Practice ' + x.band[1] + ' (CEFR ' + x.band[2] + ')' : x.scoredCount ? 'Finish all 4 papers for a band' : 'No results yet'));
      const go = el('a', 'me-go', x.complete ? 'Review ' + x.name + ' ↗' : 'Open ' + x.name + ' ↗');
      go.href = '../vault/' + (x.id === 'v1' ? 'vault1' : x.id === 'v2' ? 'vault2' : 'mock1') + '.html';
      foot.append(go);
      card.append(head, grid, foot); box.append(card);
    });

    /* totals chart: one bar per level, out of 360 */
    const ch = $('me-chart'); ch.replaceChildren();
    L.forEach(x => {
      const row = el('div', 'me-bar ' + x.cls);
      row.append(el('span', '', x.name));
      const track = el('div', 'me-track'), fill = el('i');
      fill.style.setProperty('--w', (x.total / 360 * 100) + '%'); track.append(fill);
      row.append(track, el('b', '', x.scoredCount ? x.total + ' / 360' + (x.complete ? ' · ' + x.band[1] : ' · ' + x.scoredCount + '/4 papers') : '—'));
      ch.append(row);
    });

    /* learning records */
    const rec = $('me-records'); rec.replaceChildren();
    const badges = window.SMHApp ? (window.SMHApp.summary().badges || []) : [];
    const labBadge = { listening: 'sharp-ears', speaking: 'confident-speaker', reading: 'speed-reader', writing: 'word-smith' };
    PAPERS.forEach(([k, name]) => {
      const steps = new Set((get('smh.rebuild.guide.' + k + '.done', []) || []).filter(Number.isInteger)).size;
      const lab = badges.includes(labBadge[k]) ? 'Lab done ✓' : raw('smh.lab.' + k + '.v1') ? 'Lab started' : 'Lab not started';
      const c = el('article', 'me-rec p-' + k);
      c.append(el('span', 'me-tag', name.toUpperCase()), el('b', '', steps + ' / 6'), el('small', '', 'guide steps done · ' + lab));
      const bar = el('i'); bar.style.setProperty('--w', steps / 6 * 100 + '%'); c.append(bar);
      rec.append(c);
    });
    const read = new Set(get('smh.pdfbook.v1.read', []) || []).size;
    const book = el('article', 'me-rec p-book');
    book.append(el('span', 'me-tag', 'EBOOK'), el('b', '', read + ' / 53'), el('small', '', 'eBook pages read'));
    const bb = el('i'); bb.style.setProperty('--w', Math.min(100, read / 53 * 100) + '%'); book.append(bb);
    rec.append(book);
    const games = { '1.4': 8, '3.3': 3, '3.4': 14, '3.5': 2, '4.3': 4, '4.4': 8, '4.5': 2, '5.3': 3, '5.4': 10, '5.5': 2, '6.3': 4, '6.4': 12, '6.5': 2, '7': 8 };
    const qz = get('smh.ebook.quiz.v1', {}) || {};
    const got = Object.keys(games).reduce((n, k) => n + (qz[k] && Number.isFinite(qz[k].best) ? Math.min(qz[k].best, games[k]) : 0), 0);
    const max = Object.values(games).reduce((a, b) => a + b, 0), played = Object.keys(games).filter(k => qz[k]).length;
    const gm = el('article', 'me-rec p-games');
    gm.append(el('span', 'me-tag', 'EBOOK GAMES'), el('b', '', '★ ' + got + ' / ' + max), el('small', '', played + ' of 14 games played · ' + Object.keys(games).filter(k => qz[k]).map(k => k + ' ' + qz[k].best + '/' + games[k]).join(' · ')));
    const gb = el('i'); gb.style.setProperty('--w', got / max * 100 + '%'); gm.append(gb);
    rec.append(gm);
    const sc = get('smh.ebook.selfcheck.v1', null);
    if (sc && sc.focus) {
      const names = { listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing' };
      const c = el('article', 'me-rec p-' + sc.focus);
      const conf = Object.entries(sc.ticks || {}).map(([k, t]) => names[k][0] + ' ' + (Array.isArray(t) ? t.filter(Boolean).length : 0) + '/3').join(' · ');
      c.append(el('span', 'me-tag', 'SELF-CHECK 1.6'), el('b', '', 'Focus: ' + (names[sc.focus] || sc.focus)), el('small', '', 'Confidence ticks ' + conf + (sc.target ? ' · target ' + sc.target : '')));
      rec.append(c);
    }

    const meta = $('print-meta');
    if (meta) meta.textContent = [prof.name, prof.cls, 'Printed ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })].filter(Boolean).join(' · ');
    return L;
  }

  /* ---------- print / save as PDF ---------- */
  $('me-print')?.addEventListener('click', () => { render(); window.print(); });

  /* ---------- download results as a spreadsheet (CSV) ---------- */
  $('me-csv')?.addEventListener('click', () => {
    const L = render(), q = v => '"' + String(v).replace(/"/g, '""') + '"';
    const rows = [['Smart MUET Hub · practice results'], ['Name', prof.name || ''], ['Class', prof.cls || ''], ['Target band', prof.target || ''], ['Date', new Date().toISOString().slice(0, 10)], [],
      ['Level', 'Listening /90', 'Speaking /90', 'Reading /90', 'Writing /90', 'Total /360', 'Practice band', 'CEFR']];
    L.forEach(x => rows.push([x.name, ...x.papers.map(p => p.score ?? ''), x.scoredCount ? x.total : '', x.complete ? x.band[1] : '', x.complete ? x.band[2] : '']));
    rows.push([], ['Practice estimates from Smart MUET papers; not an official MPM result.']);
    const csv = '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = el('a'); a.href = url; a.download = 'Smart-MUET-results' + (prof.name ? '-' + prof.name.replace(/[^a-z0-9]+/gi, '-') : '') + '.csv';
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  });

  render();
  setTimeout(render, 700); // badges come from SMHApp, which finishes shortly after load
  window.addEventListener('storage', render);
})();
