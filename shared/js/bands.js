/* Smart MUET Hub · MUET band and CEFR table (bands.js)
   Single source of truth for score → band → CEFR, for the 2021 MUET format onwards.
   Matches the MPM aggregated-score table and the eBook p. 7 (1.3 Bands, CEFR and your score).
   Load before any script that shows a band (me.js, certificate.js).

   window.MUETBands.getBand(total)  → { min, max, band, short, cefr, user } or null when total < 1
   window.MUETBands.TABLE           → all rows, highest band first
   window.MUETBands.ORDER           → band names, lowest first (for charts and "gap to target") */
(() => {
  'use strict';
  const TABLE = Object.freeze([
    { min: 331, max: 360, band: 'Band 5+',  short: '5+',  cefr: 'C1+', user: 'Proficient' },
    { min: 294, max: 330, band: 'Band 5.0', short: '5.0', cefr: 'C1',  user: 'Proficient' },
    { min: 258, max: 293, band: 'Band 4.5', short: '4.5', cefr: 'B2',  user: 'Independent' },
    { min: 211, max: 257, band: 'Band 4.0', short: '4.0', cefr: 'B2',  user: 'Independent' },
    { min: 164, max: 210, band: 'Band 3.5', short: '3.5', cefr: 'B1',  user: 'Independent' },
    { min: 123, max: 163, band: 'Band 3.0', short: '3.0', cefr: 'B1',  user: 'Independent' },
    { min: 82,  max: 122, band: 'Band 2.5', short: '2.5', cefr: 'A2',  user: 'Basic' },
    { min: 36,  max: 81,  band: 'Band 2.0', short: '2.0', cefr: 'A2',  user: 'Basic' },
    { min: 1,   max: 35,  band: 'Band 1.0', short: '1.0', cefr: 'A2',  user: 'Basic' }
  ].map(Object.freeze));
  const ORDER = Object.freeze(TABLE.map(r => r.band).reverse());
  function getBand(total) {
    const t = Math.round(Number(total));
    if (!Number.isFinite(t) || t < 1) return null;
    const s = Math.min(360, t);
    return TABLE.find(r => s >= r.min) || null;
  }
  /* the old [min, band, cefr] shape some scripts use */
  const LEGACY = Object.freeze(TABLE.map(r => [r.min, r.band, r.cefr]));
  window.MUETBands = Object.freeze({ TABLE, ORDER, LEGACY, getBand });
})();
