/* Smart MUET Hub · Certificate of accomplishment.
   Checks nine Hub activities from this device's records; when all are done, the certificate is issued
   (date + ID saved once in smh.cert.v1) and can be printed or saved as PDF.
   Add ?preview to the address to see a sample certificate (marked SAMPLE). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const raw = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; };
  const P = ['listening', 'speaking', 'reading', 'writing'];
  const BANDS = [[331, 'Band 5+', 'C1+'], [294, 'Band 5.0', 'C1'], [258, 'Band 4.5', 'B2'], [211, 'Band 4.0', 'B2'], [164, 'Band 3.5', 'B1'], [123, 'Band 3.0', 'B1'], [82, 'Band 2.5', 'A2'], [36, 'Band 2.0', 'A2'], [1, 'Band 1.0', 'A1']];
  const preview = /[?&]preview\b/.test(location.search);

  const state = () => window.SMHCert.state();

  function paint() {
    const s = state();
    const n = preview ? 9 : s.done;
    $('ct-done').textContent = n; $('ct-pct').textContent = Math.round(n / 9 * 100) + '%';
    $('ct-bar').style.width = (n / 9 * 100) + '%';
    const list = $('ct-list'); list.replaceChildren();
    s.L.forEach(([t, d, ok, got, max, href], i) => {
      const li = el('li', 'ct-item' + (ok ? ' ok' : ''));
      const a = el(ok ? 'div' : 'a', 'ct-row'); if (!ok) a.href = href;
      const mark = el('span', 'ct-mark', ok ? '✓' : String(i + 1));
      const txt = el('span', 'ct-txt'); txt.append(el('b', '', t), el('small', '', d));
      const prog = el('span', 'ct-prog', ok ? 'Done' : got + ' / ' + max);
      a.append(mark, txt, prog); li.append(a); list.append(li);
    });
    const complete = s.done === 9;
    $('ct-lead').textContent = complete ? 'All nine activities are done. Your certificate is ready below.' : preview ? 'This is a sample so you can see the certificate. Your own appears when all nine activities are ticked.' : 'Complete the nine Hub activities below. Your certificate is made for you automatically, with your name, your Mock 1 practice band and the date.';
    const out = $('certificate');
    if (!complete && !preview) { out.hidden = true; return; }
    out.hidden = false;
    let cert = get('smh.cert.v1', null);
    if (complete && !cert) {
      const d = new Date(), date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      const seed = (get('smh.me.profile', {}) || {}).name + date + s.total + Math.random();
      let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      cert = { date, id: 'SMH-' + d.getFullYear() + '-' + h.toString(36).toUpperCase().padStart(6, '0').slice(0, 6) };
      put('smh.cert.v1', cert);
      celebrate();
    }
    const prof = get('smh.me.profile', {}) || {};
    const nameIn = $('ct-name'), clsIn = $('ct-class');
    if (document.activeElement !== nameIn) nameIn.value = prof.name || '';
    if (document.activeElement !== clsIn) clsIn.value = prof.cls || '';
    $('cert-name').textContent = nameIn.value.trim() || (preview ? 'Nur Aisyah binti Ahmad' : 'Type your name above');
    $('cert-class').textContent = clsIn.value.trim() || (preview ? 'Diploma in Electrical Engineering · DEE 3A' : '');
    const total = preview && s.total == null ? 178 : s.total;
    const b = total ? (BANDS.find(([min]) => total >= min) || [0, '—', '—']) : null;
    $('cert-total').textContent = total ? total + ' / 360' : '—';
    $('cert-band').textContent = b ? b[1] : '—';
    $('cert-cefr').textContent = b ? b[2] : '—';
    $('cert-xp').textContent = preview && !s.xp ? '1,240' : s.xp.toLocaleString('en-GB');
    const dt = cert ? new Date(cert.date + 'T00:00:00') : new Date();
    $('cert-date').textContent = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    $('cert-id').textContent = cert ? cert.id : 'SMH-SAMPLE';
    $('cert').classList.toggle('sample', !complete);
  }

  ['ct-name', 'ct-class'].forEach((id, i) => $(id).addEventListener('input', e => {
    const p = get('smh.me.profile', {}) || {}; p[i ? 'cls' : 'name'] = e.target.value.slice(0, 60);
    put('smh.me.profile', p); paint();
  }));
  $('ct-print').addEventListener('click', () => { paint(); window.print(); });

  function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = el('canvas', 'ct-confetti'); document.body.append(c);
    const ctx = c.getContext('2d'), W = (c.width = innerWidth), H = (c.height = innerHeight);
    const cols = ['#ffcc33', '#3b5bff', '#ff754a', '#4cc9a6', '#e0479e', '#fff'];
    const bits = Array.from({ length: 220 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * .5, vx: (Math.random() - .5) * 3, vy: Math.random() * 3 + 2, r: Math.random() * 7 + 4, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, s: (Math.random() - .5) * .2 }));
    let f = 0;
    (function draw() { ctx.clearRect(0, 0, W, H); bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.a += b.s; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore(); }); if (++f < 260) requestAnimationFrame(draw); else c.remove(); })();
  }

  paint();
  if (location.hash === '#certificate' && !$('certificate').hidden) $('certificate').scrollIntoView();
  window.addEventListener('storage', paint);
  setTimeout(paint, 600);
})();
