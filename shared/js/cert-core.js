/* Smart MUET Hub · certificate rules (shared by certificate.html, Me and Home).
   window.SMHCert.state() → { L: [[title, how, done, got, max, link]...9], done, total (Mock 1 /360 or null), xp } */
(() => {
  'use strict';
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const raw = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const P = ['listening', 'speaking', 'reading', 'writing'];
  function state() {
    const sum = window.SMHApp ? window.SMHApp.summary() : { total: 0, badges: [] };
    const has = id => (sum.badges || []).includes(id);
    const read = new Set((get('smh.pdfbook.v1.read', []) || []).filter(Number.isInteger));
    const guides = P.filter(k => (get('smh.rebuild.guide.' + k + '.done', []) || []).length >= 6).length;
    const labs = ['sharp-ears', 'confident-speaker', 'speed-reader', 'word-smith'].filter(has).length;
    const trap = get('smh.learn.trap.v1', {}) || {};
    const traps = P.filter(k => trap[k]).length;
    const flags = id => P.filter(k => raw('muet_' + id + '_' + k) === 'true').length;
    const rounds = ((get('smh.arcade.v1', {}) || {}).rounds || []).length;
    const know = raw('smh.home.know') === 'true' || [4, 5, 6, 7].some(p => read.has(p));
    const L = [
      ['Know MUET', 'Open the Know MUET tour or eBook chapter 1', know, know ? 1 : 0, 1, 'welcome/index.html'],
      ['10-minute check', 'Finish the check and get your plan', has('test-expert'), has('test-expert') ? 1 : 0, 1, 'labs/diagnostic.html'],
      ['Read the eBook', 'Read at least 40 of the 53 pages', read.size >= 40, Math.min(read.size, 40), 40, 'ebook.html'],
      ['Four skill guides', 'Mark all 6 steps done in each guide', guides === 4, guides, 4, 'learn.html'],
      ['Four Labs', 'Earn Sharp Ears, Confident Speaker, Speed Reader and Word Smith', labs === 4, labs, 4, 'practice.html'],
      ['Trap spotter', 'Try the traps for all four papers', traps === 4, traps, 4, 'learn.html#traps'],
      ['Vault 1 and Vault 2', 'Complete all 8 Vault papers', flags('v1') + flags('v2') === 8, flags('v1') + flags('v2'), 8, 'practice.html'],
      ['Mock 1', 'Complete all 4 papers under exam conditions', flags('mock1') === 4, flags('mock1'), 4, 'vault/mock1.html'],
      ['Arcade', 'Finish 3 Arcade rounds', rounds >= 3, Math.min(rounds, 3), 3, 'arcade/index.html']
    ];
    const m = P.map(k => parseInt(raw('muet_mock1_' + k + '_score90'), 10));
    const total = m.every(Number.isFinite) ? m.reduce((a, b) => a + Math.max(0, Math.min(90, b)), 0) : null;
    return { L, done: L.filter(x => x[2]).length, total, xp: sum.total || 0 };
  }

  window.SMHCert = { state, issued: () => get('smh.cert.v1', null) };
})();
