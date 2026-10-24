/* Smart MUET Hub · one student profile for every page (profile.js)
   Master record:  smh.me.profile = { name, cls, regNo, email, target }   (Me, Home, Learn, eBook, certificate)
   Mirror for the Vault / Mock pages and the lecturer sheet:
                   muet_profile   = { name, group, regNo, email, targetBand, ... }   (other old fields kept)

   On every page load the two are merged (the master wins; empty master fields are filled from an older
   muet_profile, so a name typed on the old site is not lost), then the mirror is rewritten.
   Vault and Mock paper pages get a small "Who is submitting?" card, and a submit / check button
   waits until a name is given, so the lecturer sheet never receives an attempt with no name.

   window.SMHProfile.get()          → master record
   window.SMHProfile.set({ ... })   → merge, save both, fire 'smh:profile' */
(() => {
  'use strict';
  if (window.SMHProfile) return;
  const MASTER = 'smh.me.profile', LEGACY = 'muet_profile', FIELDS = ['name', 'cls', 'regNo', 'email', 'target'];
  const read = k => { try { const v = JSON.parse(localStorage.getItem(k) || '{}'); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch { return {}; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  const s = v => (typeof v === 'string' ? v : v == null ? '' : String(v)).trim().slice(0, 80);

  function sync() {
    const m = read(MASTER), l = read(LEGACY);
    const fromL = { name: l.name, cls: l.group || l.classGroup, regNo: l.regNo || l.studentRegNo, email: l.email || l.studentEmail, target: l.targetBand };
    let changed = false;
    FIELDS.forEach(f => { if (!s(m[f]) && s(fromL[f])) { m[f] = s(fromL[f]); changed = true; } });
    if (m.target && !/^Band /.test(m.target) && /^\d/.test(m.target)) { m.target = 'Band ' + m.target; changed = true; }
    if (changed) write(MASTER, m);
    const next = Object.assign({}, l, { name: s(m.name), group: s(m.cls), regNo: s(m.regNo), email: s(m.email), targetBand: s(m.target) });
    if (JSON.stringify(next) !== JSON.stringify(l)) write(LEGACY, next);
    return m;
  }
  const get = () => sync();
  function set(patch) {
    const m = read(MASTER);
    Object.keys(patch || {}).forEach(f => { if (FIELDS.includes(f)) m[f] = s(patch[f]); });
    write(MASTER, m); sync();
    try { dispatchEvent(new CustomEvent('smh:profile', { detail: m })); } catch {}
    return m;
  }
  sync();
  /* pages that still write smh.me.profile themselves (Me, certificate, Learn, eBook) are mirrored straight after */
  let t; const later = () => { clearTimeout(t); t = setTimeout(sync, 150); };
  document.addEventListener('input', later, true); document.addEventListener('change', later, true);
  addEventListener('pagehide', sync); addEventListener('storage', e => { if (e.key === MASTER || e.key === LEGACY) sync(); });
  window.SMHProfile = Object.freeze({ get, set, sync });

  /* ---------- Vault / Mock paper pages: who is submitting ---------- */
  const pid = (document.body && document.body.dataset.pageId) || '';
  if (!/^(v1|v2|mock1)-(listening|speaking|reading|writing)$/.test(pid)) return;
  const SUBMIT = '.mock-submit-btn,button.submit,#finishBtn,#finishWriting,#finish,#finalSubmit,#submitExam,#submitMock,#finishMock';
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
  const root = document.body.dataset.appRoot || '../';

  function card() {
    const box = h('section', 'smh-who'); box.id = 'smh-who'; box.setAttribute('aria-label', 'Who is submitting');
    const av = h('span', 'smh-who-av', '👤'); av.setAttribute('aria-hidden', 'true');
    const tx = h('div', 'smh-who-tx'), view = h('div', 'smh-who-view'), form = h('form', 'smh-who-form');
    const line = h('p'), edit = h('button', 'smh-who-edit', 'Change'); edit.type = 'button';
    view.append(line, edit);
    const field = (label, key, ph, req) => { const l = h('label'); l.append(h('span', '', label)); const i = h('input'); i.name = key; i.placeholder = ph; i.maxLength = 80; if (req) i.required = true; if (key === 'name') i.autocomplete = 'name'; l.append(i); return l; };
    form.append(field('Full name', 'name', 'As in your IC', true), field('Matric no.', 'regNo', 'e.g. 18DEE23F1001'), field('Class', 'cls', 'e.g. DEE 3A'));
    const save = h('button', 'smh-who-save', 'Save my details'); save.type = 'submit'; form.append(save);
    const note = h('small', 'smh-who-note'); note.append('Your lecturer sees these with your answers. Also saved on your ');
    const a = h('a', '', 'Me page'); a.href = root + 'me.html'; note.append(a, '.'); form.append(note);
    tx.append(h('b', '', 'Who is submitting?'), view, form); box.append(av, tx);

    const paint = () => {
      const p = read(MASTER), has = !!s(p.name);
      box.classList.toggle('is-missing', !has);
      view.hidden = !has; form.hidden = has;
      line.textContent = has ? [s(p.name), s(p.regNo), s(p.cls)].filter(Boolean).join(' · ') : '';
      if (has && !s(p.regNo)) line.append(h('em', '', ' · add your matric no.'));
      ['name', 'regNo', 'cls'].forEach(k => { form.elements[k].value = s(p[k]); });
    };
    edit.addEventListener('click', () => { view.hidden = true; form.hidden = false; form.elements.name.focus(); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!s(form.elements.name.value)) { form.elements.name.focus(); return; }
      set({ name: form.elements.name.value, regNo: form.elements.regNo.value, cls: form.elements.cls.value });
      paint(); box.classList.add('is-saved'); setTimeout(() => box.classList.remove('is-saved'), 1200);
    });
    addEventListener('smh:profile', paint);
    paint();
    return box;
  }

  function place() {
    if (document.getElementById('smh-who')) return;
    const box = card();
    const main = document.querySelector('main') || document.body;
    const anchor = main.querySelector('.smh-band, .coach-step') ;
    const first = [...main.children].find(c => !/^(SCRIPT|STYLE|LINK)$/.test(c.tagName) && !c.classList.contains('smh-band') && !c.classList.contains('coach-step'));
    if (anchor && anchor.parentNode === main) anchor.after(box); else if (first) main.insertBefore(box, first); else main.prepend(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place();

  /* a submit or check button waits for a name */
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest(SUBMIT);
    if (!b || s(read(MASTER).name)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    place();
    const box = document.getElementById('smh-who'), f = box.querySelector('form');
    box.classList.add('is-missing', 'is-nudge'); setTimeout(() => box.classList.remove('is-nudge'), 900);
    box.querySelector('.smh-who-view').hidden = true; f.hidden = false;
    let msg = box.querySelector('.smh-who-msg');
    if (!msg) { msg = h('p', 'smh-who-msg'); msg.setAttribute('role', 'alert'); f.before(msg); }
    msg.textContent = 'Type your name first so your lecturer knows whose answers these are. Then press the button again.';
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => f.elements.name.focus({ preventScroll: true }), 350);
  }, true);
  addEventListener('smh:profile', () => { const m = document.querySelector('.smh-who-msg'); if (m && s(read(MASTER).name)) m.textContent = 'Saved. You can submit now.'; });
})();
