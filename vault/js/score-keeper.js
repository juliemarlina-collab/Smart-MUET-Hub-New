/* Smart MUET · Vault score keeper (all 12 Vault 1, Vault 2 and Mock 1 papers).
   1. Vault 1 and Vault 2 Speaking and Writing already mark each task with the rubric, but never saved a paper
      score. When the paper is completed, this adds it up out of 90 (Writing: Task 1 /30 + Task 2 /60;
      Speaking: Task A + Task B rubric /36 scaled to 90) and saves muet_{stage}_{paper}_score90.
   2. Every completed paper gets a score card with confetti, and a link to the results on the Me page.
   Listening and Reading keep their own marking (and Mock 1 keeps its answer-key marking on the server). */
(() => {
  'use strict';
  const m = location.pathname.match(/(vault1|vault2|mock1)-(listening|speaking|reading|writing)\.html$/);
  if (!m) return;
  const stage = m[1] === 'vault1' ? 'v1' : m[1] === 'vault2' ? 'v2' : 'mock1', paper = m[2];
  const NAME = { v1: 'Vault 1', v2: 'Vault 2', mock1: 'Mock 1' }[stage], P = paper[0].toUpperCase() + paper.slice(1);
  const flagKey = 'muet_' + stage + '_' + paper;
  const raw = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const json = k => { try { return JSON.parse(raw(k)); } catch { return null; } };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function computeScore() {
    if (stage === 'mock1' || paper === 'listening' || paper === 'reading') return null; // marked elsewhere
    if (paper === 'writing') {
      const t1 = json(flagKey + '_task1'), t2 = json(flagKey + '_task2');
      if (!t1 || !t2 || !Number.isFinite(+t1.scaledScore) || !Number.isFinite(+t2.scaledScore)) return null;
      return Math.max(0, Math.min(90, Math.round(+t1.scaledScore + +t2.scaledScore)));
    }
    const a = json(flagKey + '_taskA'), b = json(flagKey + '_taskB');
    if (!a || !b || !Number.isFinite(+a.rubricRaw) || !Number.isFinite(+b.rubricRaw)) return null;
    const max = (+a.rubricMax || 18) + (+b.rubricMax || 18);
    return Math.max(0, Math.min(90, Math.round((+a.rubricRaw + +b.rubricRaw) / max * 90)));
  }

  function onComplete() {
    let s = computeScore();
    if (s !== null) { try { localStorage.setItem(flagKey + '_score90', String(s)); } catch {} }
    else { const v = parseInt(raw(flagKey + '_score90'), 10); s = Number.isFinite(v) ? v : null; }
    card(s);
  }

  /* notice when the page marks this paper complete */
  try {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      const r = orig.apply(this, arguments);
      if (this === localStorage && k === flagKey && String(v) === 'true') setTimeout(onComplete, 250);
      return r;
    };
  } catch {}

  /* ---------- score card + confetti ---------- */
  const css = document.createElement('style');
  css.textContent = `.sk-card{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9000;width:min(440px,92vw);background:#fff;color:#142b68;border:3px solid #142b68;border-radius:24px;box-shadow:0 8px 0 #142b68;padding:18px 20px;font-family:"DM Sans",Arial,sans-serif;text-align:center;animation:sk-up .45s ease both}
@keyframes sk-up{from{opacity:0;transform:translate(-50%,30px)}to{opacity:1;transform:translate(-50%,0)}}
.sk-card .sk-tag{display:inline-block;font:800 12px "DM Sans",Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;background:var(--paper,#3b5bff);color:var(--paper-fg,#fff);border-radius:99px;padding:6px 11px}
.sk-card h2{font:800 24px/1.15 Poppins,Arial,sans-serif;margin:10px 0 2px}
.sk-card .sk-big{font:800 52px/1 Poppins,Arial,sans-serif;margin:8px 0 2px}
.sk-card .sk-big small{font-size:20px;color:#44507a}
.sk-card p{margin:6px 0;font-size:15px;color:#4a4e5c}
.sk-dots{display:flex;justify-content:center;gap:6px;margin:10px 0}
.sk-dots i{width:34px;height:10px;border-radius:99px;background:#e1e4ef}.sk-dots i.on{background:#142b68}
.sk-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px}
.sk-row a,.sk-row button{min-height:46px;padding:0 18px;border-radius:99px;border:2px solid #142b68;background:#fff;color:#142b68;font:700 15px "DM Sans",Arial,sans-serif;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}
.sk-row a{background:#ffcc33;box-shadow:0 3px 0 #142b68}
.sk-confetti{position:fixed;inset:0;pointer-events:none;z-index:8999}
@media (prefers-reduced-motion:reduce){.sk-card{animation:none}}`;
  document.head.append(css);

  function card(score) {
    document.querySelector('.sk-card')?.remove();
    const done = ['listening', 'speaking', 'reading', 'writing'].filter(c => raw('muet_' + stage + '_' + c) === 'true').length;
    const c = document.createElement('div'); c.className = 'sk-card'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', P + ' paper complete');
    const msg = score === null ? 'Your paper is saved. Its score appears on your Me page when marking is ready.'
      : score >= 72 ? 'Excellent work! That is a strong practice score.' : score >= 54 ? 'Great effort! You are building solid control.' : 'Well done for finishing. Review the feedback and try again to lift your score.';
    c.innerHTML = '<span class="sk-tag"></span><h2></h2><div class="sk-big"></div><p class="sk-msg"></p><div class="sk-dots" aria-hidden="true"></div><p class="sk-count"></p><div class="sk-row"><a href="../me.html#res-title">See my results ↗</a><button type="button">Keep reviewing</button></div>';
    c.querySelector('.sk-tag').textContent = NAME + ' · ' + P;
    c.querySelector('h2').textContent = P + ' paper complete!';
    const big = c.querySelector('.sk-big');
    if (score === null) big.textContent = '✓';
    else { big.textContent = String(score); const s = document.createElement('small'); s.textContent = ' / 90'; big.append(s); }
    c.querySelector('.sk-msg').textContent = msg;
    const dots = c.querySelector('.sk-dots');
    for (let i = 0; i < 4; i++) { const d = document.createElement('i'); if (i < done) d.className = 'on'; dots.append(d); }
    c.querySelector('.sk-count').textContent = done + ' of 4 ' + NAME + ' papers done' + (done === 4 ? ' · your practice band is ready on the Me page!' : '.');
    c.querySelector('button').onclick = () => c.remove();
    document.body.append(c);
    confetti(score === null || score >= 54 || done === 4 ? 160 : 70);
  }

  function confetti(n) {
    if (reduced()) return;
    const cv = document.createElement('canvas'); cv.className = 'sk-confetti'; document.body.append(cv);
    const ctx = cv.getContext('2d'), W = (cv.width = innerWidth), H = (cv.height = innerHeight);
    const cols = ['#ffcc33', '#4cc9a6', '#ff754a', '#e0479e', '#3b5bff', '#3b5bff'];
    const bits = Array.from({ length: n }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * .4, vx: (Math.random() - .5) * 3, vy: Math.random() * 3 + 2, r: Math.random() * 7 + 5, c: cols[Math.floor(Math.random() * 6)], a: Math.random() * 6, s: (Math.random() - .5) * .25 }));
    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .05; b.a += b.s; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore(); });
      if (++f < 220) requestAnimationFrame(draw); else cv.remove();
    })();
  }

  /* Speaking and Writing papers finished before this update: work out their score once */
  if (raw(flagKey) === 'true' && !raw(flagKey + '_score90')) { const s = computeScore(); if (s !== null) try { localStorage.setItem(flagKey + '_score90', String(s)); } catch {} }
})();
