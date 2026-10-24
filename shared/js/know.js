/* Smart MUET Hub · Learn › Know MUET (replaces the old welcome/ tour).
   Ticks "Know MUET" (smh.home.know, used by the certificate, Home and the journey) once the section is seen,
   and saves the target band (smh.me.profile.target, shared with Home and Me) and first skill (smh.flow.focus). */
(() => {
  'use strict';
  const sec = document.getElementById('know'); if (!sec) return;
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); return true; } catch { return false; } };
  const seen = () => put('smh.home.know', 'true');
  if (location.hash === '#know') seen();
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { seen(); io.disconnect(); } }, { threshold: .35 }); io.observe(sec.querySelector('.kn-papers') || sec); }
  else seen();
  const form = document.getElementById('kn-goal'), tgt = document.getElementById('kn-target'), sk = document.getElementById('kn-skill'), out = document.getElementById('kn-saved');
  const NAME = { listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing' };
  const prof = get('smh.me.profile', {}) || {};
  if (prof.target) tgt.value = prof.target;
  const f = get('smh.flow.focus', null) || (get('smh.rebuild.goal', {}) || {}).skill; if (NAME[f]) sk.value = f;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const p = get('smh.me.profile', {}) || {}; if (tgt.value) p.target = tgt.value;
    const ok = put('smh.me.profile', p) && put('smh.flow.focus', sk.value);
    put('smh.rebuild.goal', { target: tgt.value, skill: sk.value }); seen();
    out.textContent = '';
    const t = document.createTextNode((ok ? 'Saved. ' : 'Shown for this visit only. ') + (tgt.value ? 'Target ' + tgt.value + ' · ' : '') + 'first skill ' + NAME[sk.value] + '. ');
    const a = document.createElement('a'); a.href = 'guides/' + sk.value + '.html'; a.textContent = 'Open the ' + NAME[sk.value] + ' guide →';
    out.append(t, a);
  });
})();
