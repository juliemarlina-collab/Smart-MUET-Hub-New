/* Smart MUET Hub · Speaking marks: automatic estimate vs lecturer mark (speaking-assessment.js)
   Keeps machine indicators (transcript words, words per minute, pauses, keyword-based criteria) apart from the
   mark a lecturer gives with the rubric on the Me page.

   Rule: only a lecturer mark is the Speaking mark.
     muet_{level}_speaking_score90  ← written ONLY by setLecturer()  (level = v1 | v2 | mock1)
     muet_{level}_speaking_auto90   ← automatic estimate, never used as the mark
   Full records: smh.speaking.v1 = { v1: { auto: {...}, lecturer: {...} }, v2: {...}, mock1: {...} }

   window.MUETSpeaking.recordAuto(level, { score90, criteria, words, wpm, silence, durationSec, confidence, task })
   window.MUETSpeaking.setLecturer(level, { score90, parts, feedback })
   window.MUETSpeaking.get(level) → { auto, lecturer, official, shown, provisional }

   Note: marks live in the student's browser. "Lecturer" means the lecturer entered the mark with the student
   (Me page rubric) or in the lecturer sheet; the browser itself cannot prove who typed it. */
(() => {
  'use strict';
  if (window.MUETSpeaking) return;
  const KEY = 'smh.speaking.v1', LEVELS = ['v1', 'v2', 'mock1'];
  const raw = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const del = k => { try { localStorage.removeItem(k); } catch {} };
  const load = () => { try { const v = JSON.parse(raw(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
  const save = v => set(KEY, JSON.stringify(v));
  const clamp90 = n => { n = Math.round(Number(n)); return Number.isFinite(n) ? Math.max(0, Math.min(90, n)) : null; };
  const ok = lvl => LEVELS.includes(lvl);

  function recordAuto(level, a) {
    if (!ok(level) || !a) return null;
    const all = load(), rec = all[level] || {};
    rec.auto = {
      score90: clamp90(a.score90), criteria: a.criteria || null, task: a.task || '',
      words: Number(a.words) || 0, wpm: Number(a.wpm) || 0, silence: Number(a.silence) || 0,
      durationSec: Number(a.durationSec) || 0, confidence: a.confidence || '', date: new Date().toISOString()
    };
    all[level] = rec; save(all);
    if (rec.auto.score90 !== null) set('muet_' + level + '_speaking_auto90', String(rec.auto.score90));
    return rec.auto;
  }

  function setLecturer(level, g) {
    if (!ok(level) || !g) return null;
    const s = clamp90(g.score90); if (s === null) return null;
    const all = load(), rec = all[level] || {};
    rec.lecturer = { score90: s, parts: Array.isArray(g.parts) ? g.parts.slice(0, 6) : null, feedback: String(g.feedback || '').slice(0, 300), date: new Date().toISOString() };
    all[level] = rec; save(all);
    set('muet_' + level + '_speaking_score90', String(s));
    set('muet_' + level + '_speaking', 'true');
    return rec.lecturer;
  }

  function get(level) {
    const rec = load()[level] || {};
    const off = parseInt(raw('muet_' + level + '_speaking_score90'), 10), au = parseInt(raw('muet_' + level + '_speaking_auto90'), 10);
    const official = Number.isFinite(off) ? clamp90(off) : null, auto = rec.auto || (Number.isFinite(au) ? { score90: clamp90(au) } : null);
    const shown = official !== null ? official : auto && auto.score90 !== null ? auto.score90 : null;
    return { auto, lecturer: rec.lecturer || null, official, shown, provisional: official === null && shown !== null };
  }

  /* one-time clean-up: Speaking marks saved before this change came from the automatic estimate.
     Keep a mark only when the rubric log shows a lecturer gave it for that level; otherwise move it to *_auto90. */
  if (raw('smh.speaking.migrated.v1') !== '1') {
    let rubric = []; try { rubric = JSON.parse(raw('smh.me.rubric.v1') || '[]') || []; } catch {}
    const all = load();
    LEVELS.forEach(level => {
      const k = 'muet_' + level + '_speaking_score90', v = parseInt(raw(k), 10);
      if (!Number.isFinite(v)) return;
      const lec = rubric.find(r => r && r.paper === 'speaking' && r.level === level && r.by !== 'Self' && +r.score90 === v);
      if (lec) { (all[level] = all[level] || {}).lecturer = { score90: v, parts: lec.parts || null, feedback: lec.feedback || '', date: lec.date || '' }; return; }
      set('muet_' + level + '_speaking_auto90', String(v));
      (all[level] = all[level] || {}).auto = Object.assign({ score90: v, date: '' }, (all[level] || {}).auto || {});
      del(k);
    });
    save(all); set('smh.speaking.migrated.v1', '1');
  }

  window.MUETSpeaking = Object.freeze({ LEVELS, recordAuto, setLecturer, get });
})();
