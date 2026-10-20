/* Smart MUET Hub · Learn page extras: Language bank (tap a phrase when you have used it)
   and Trap spotter (3 traps per paper, auto-marked, best score + misses saved for the Me page error log).
   Device records: smh.learn.bank.v1 {phraseId:true}, smh.learn.trap.v1 {paper:{best,total,last,misses[]}} */
(() => {
  'use strict';
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; };
  const PAPERS = [['listening', 'Listening', 'CLUE'], ['speaking', 'Speaking', 'PREP'], ['reading', 'Reading', 'SCAN'], ['writing', 'Writing', 'PEEL']];

  const BANK = {
    listening: [
      ['Signposts that change the answer', ['However, …', 'But actually, …', 'What really mattered was …', 'We ruled out X in favour of Y.']],
      ['Numbers and time said another way', ['a fortnight = two weeks', 'a decade and a half = 15 years', 'a quarter past = :15', 'twice a month = every two weeks (about)']],
      ['Speaker attitude', ['I was rather sceptical at first …', 'To be fair, …', 'I can’t say I agree …', 'What surprised me most was …']]
    ],
    speaking: [
      ['Point and reason (P, R)', ['I believe … because …', 'The main reason is that …', 'This matters because …', 'From my point of view, …']],
      ['Example (E)', ['For example, in my polytechnic …', 'A good example is …', 'I have seen this when …', 'Take … for instance.']],
      ['Group discussion moves', ['Building on Aina’s point, …', 'May I add something?', 'I see it differently because …', 'So, do we agree that …?']]
    ],
    reading: [
      ['Reference words to track', ['this / these + noun', 'such measures', 'the former … the latter', 'it / they (check the noun before)']],
      ['Words that limit meaning', ['only, mainly, partly', 'few (= not many) vs a few (= some)', 'not necessarily', 'unless, except']],
      ['Writer’s view verbs', ['suggests, implies', 'argues, claims', 'attributes X to Y', 'stems from = is caused by']]
    ],
    writing: [
      ['Task 1 email', ['Thank you for your email about …', 'I would recommend … because …', 'Could you please confirm whether …?', 'I look forward to hearing from you.']],
      ['Task 2 connectors', ['Furthermore, …', 'However, … / Nevertheless, …', 'As a result, … / Consequently, …', 'In conclusion, …']],
      ['Developing a point (PEEL)', ['This is because …', 'For instance, …', 'This shows that …', 'Therefore, …']]
    ]
  };

  const TRAPS = {
    listening: [
      ['“Most people think the library closes at 5, but actually it stays open until 9 during exam week.” When does it close during exam week?', ['5 pm', '9 pm', 'It does not close'], 1, 'The first number is what “most people think”. “But actually” gives the real answer: 9 pm.'],
      ['“The workshop was planned for Tuesday. However, the hall is being repainted, so we’ve moved it to Thursday morning.” When is the workshop?', ['Tuesday morning', 'Thursday morning', 'Tuesday afternoon'], 1, '“However” signals a change. The final plan is Thursday morning.'],
      ['“The fee is RM150 for a regular session and RM350 for MUET on Demand.” How much does a regular session cost?', ['RM350', 'RM500', 'RM150'], 2, 'Both numbers are heard. Match each number to its label: regular = RM150.']
    ],
    speaking: [
      ['Topic: Should students work part-time? Which opening follows PREP?', ['Yes. Money.', 'I believe students should work part-time because it teaches them to manage time.', 'Part-time work is a job that is part-time.'], 1, 'A strong opening gives the Point and the Reason in one clear sentence.'],
      ['In a group discussion, which reply builds on a friend’s idea?', ['I disagree with everyone.', 'Building on Aina’s point about cost, a shuttle bus would also save time.', 'My idea is better than yours.'], 1, 'Name the speaker and their idea, then add your own. That shows interaction.'],
      ['Which example is the strongest?', ['For example, many things happen.', 'For example, it is good.', 'For example, my cousin saved RM200 in one semester by cycling to class.'], 2, 'A strong example is specific: a person, a number, a real situation.']
    ],
    reading: [
      ['Text: “The new policy reduced waste by 30%. However, critics argue this was mainly due to fewer events on campus.” Which statement is supported?', ['The policy alone reduced waste by 30%.', 'Some people believe fewer events explain the drop.', 'Critics want more events on campus.'], 1, 'Option 1 repeats words from the text but ignores “However … critics argue”.'],
      ['Text: “Online classes saved travel time. This benefit, however, came at the cost of social interaction.” What does “This benefit” refer to?', ['online classes', 'saving travel time', 'social interaction'], 1, 'Track the reference word back to the idea just before it: saving travel time.'],
      ['“Few students chose the evening slot.” This means …', ['many students chose it', 'not many students chose it', 'no student chose it'], 1, '“Few” means not many. “A few” means some. Neither means none.']
    ],
    writing: [
      ['Which Task 2 point is fully developed with PEEL?', ['Social media is bad. It is very bad.', 'Social media can harm focus because alerts break concentration; for instance, students who check phones every 10 minutes take longer to finish tasks, so limits are needed.', 'There are many reasons for this.'], 1, 'It has a Point, Explanation, Example and a Link back to the question.'],
      ['Task 1: a friend asks for advice about a club trip. Which opening fits?', ['Dear Sir/Madam, I am writing to complain.', 'Hi Hana, thanks for your email about the club trip. Here’s what I think.', 'To whom it may concern,'], 1, 'Match the reader: a friend gets a friendly, informal opening.'],
      ['“The plan is cheap. ___, it may not be safe.” Choose the connector.', ['Therefore', 'However', 'For example'], 1, 'The second idea contrasts with the first, so use “However”.']
    ]
  };

  /* ---------- language bank ---------- */
  const lb = document.getElementById('lb');
  if (lb) {
    const used = get('smh.learn.bank.v1', {}) || {};
    const tabs = el('div', 'lb-tabs'); tabs.setAttribute('role', 'tablist');
    const panel = el('div', 'lb-panel');
    const count = el('p', 'lb-count');
    const show = k => {
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.k === k ? 'true' : 'false'));
      panel.className = 'lb-panel p-' + k; panel.replaceChildren();
      BANK[k].forEach(([h, list], gi) => {
        const g = el('div', 'lb-group'); g.append(el('h3', '', h));
        const ul = el('ul');
        list.forEach((p, pi) => {
          const id = k + '.' + gi + '.' + pi, b = el('button', 'lb-phrase', p); b.type = 'button';
          b.setAttribute('aria-pressed', used[id] ? 'true' : 'false');
          b.addEventListener('click', () => { used[id] = !used[id]; if (!used[id]) delete used[id]; put('smh.learn.bank.v1', used); b.setAttribute('aria-pressed', used[id] ? 'true' : 'false'); tally(); });
          const li = el('li'); li.append(b); ul.append(li);
        });
        g.append(ul); panel.append(g);
      });
    };
    const tally = () => { const n = Object.keys(used).length; count.textContent = n ? n + ' of 48 phrases used in your own practice.' : 'Tap a phrase after you have used it in your own speaking or writing.'; };
    PAPERS.forEach(([k, name, tech], i) => {
      const b = el('button', 'lb-tab t-' + k, name + ' · ' + tech); b.type = 'button'; b.dataset.k = k; b.setAttribute('role', 'tab');
      b.addEventListener('click', () => show(k)); tabs.append(b);
    });
    lb.append(tabs, panel, count); show('listening'); tally();
  }

  /* ---------- trap spotter ---------- */
  const ts = document.getElementById('ts');
  if (ts) {
    const store = get('smh.learn.trap.v1', {}) || {};
    const tabs = el('div', 'lb-tabs'); const box = el('div', 'ts-box');
    let paper = 'reading';
    const run = k => {
      paper = k;
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.k === k ? 'true' : 'false'));
      box.className = 'ts-box p-' + k; box.replaceChildren();
      const items = TRAPS[k]; let i = 0, score = 0; const misses = [];
      const prev = store[k];
      const head = el('div', 'ts-head');
      const prog = el('span', 'ts-prog'); const best = el('span', 'ts-best', prev ? 'Best ' + prev.best + ' / ' + prev.total : 'Not tried yet');
      head.append(prog, best);
      const q = el('p', 'ts-q'), opts = el('div', 'ts-opts'), fb = el('p', 'ts-fb'); fb.setAttribute('aria-live', 'polite');
      const next = el('button', 'ts-next', 'Next trap →'); next.type = 'button'; next.hidden = true;
      box.append(head, q, opts, fb, next);
      const ask = () => {
        const [text, choices, ans, why] = items[i];
        prog.textContent = 'Trap ' + (i + 1) + ' of ' + items.length;
        q.textContent = text; fb.textContent = ''; fb.className = 'ts-fb'; next.hidden = true; opts.replaceChildren();
        choices.forEach((c, ci) => {
          const b = el('button', 'ts-opt', c); b.type = 'button';
          b.addEventListener('click', () => {
            opts.querySelectorAll('button').forEach(x => (x.disabled = true));
            const ok = ci === ans;
            b.classList.add(ok ? 'right' : 'wrong'); opts.children[ans].classList.add('right');
            if (ok) score++; else misses.push({ q: text, picked: c, right: choices[ans], why, date: new Date().toISOString().slice(0, 10) });
            fb.textContent = (ok ? 'You spotted it. ' : 'That was the trap. ') + why; fb.className = 'ts-fb ' + (ok ? 'ok' : 'no');
            next.hidden = false; next.textContent = i < items.length - 1 ? 'Next trap →' : 'See my score →'; next.focus();
          });
          opts.append(b);
        });
      };
      next.addEventListener('click', () => {
        if (++i < items.length) return ask();
        const r = store[k] || { best: 0, total: items.length, attempts: 0 };
        r.best = Math.max(r.best || 0, score); r.total = items.length; r.last = score; r.attempts = (r.attempts || 0) + 1;
        r.date = new Date().toISOString().slice(0, 10); r.misses = misses.concat(r.misses || []).slice(0, 12);
        store[k] = r; put('smh.learn.trap.v1', store);
        box.replaceChildren();
        const end = el('div', 'ts-end');
        end.append(el('b', '', score + ' / ' + items.length), el('p', '', score === items.length ? 'All three traps spotted. Stars saved to your Me page.' : 'Missed traps are saved to the error log on your Me page, so you can come back to them.'));
        const again = el('button', 'ts-next', 'Try again'); again.type = 'button'; again.addEventListener('click', () => run(k));
        const go = el('a', 'ts-link', 'Open the ' + PAPERS.find(p => p[0] === k)[1] + ' guide →'); go.href = 'guides/' + k + '.html';
        end.append(again, go); box.append(end);
        if (score === items.length && window.matchMedia && !matchMedia('(prefers-reduced-motion: reduce)').matches) burst(box);
        if (window.SMHApp && SMHApp.refresh) try { SMHApp.refresh(); } catch {}
      });
      ask();
    };
    PAPERS.forEach(([k, name]) => { const b = el('button', 'lb-tab t-' + k, name); b.type = 'button'; b.dataset.k = k; b.addEventListener('click', () => run(k)); tabs.append(b); });
    ts.append(tabs, box); run('reading');
  }

  function burst(host) {
    const c = el('canvas', 'ts-confetti'); host.append(c);
    const ctx = c.getContext('2d'), W = (c.width = host.clientWidth), H = (c.height = host.clientHeight);
    const cols = ['#ffcc33', '#3b5bff', '#ff754a', '#4cc9a6', '#e0479e', '#142b68'];
    const bits = Array.from({ length: 120 }, () => ({ x: W / 2, y: H * .4, vx: (Math.random() - .5) * 10, vy: -Math.random() * 9 - 3, r: Math.random() * 6 + 4, c: cols[Math.random() * cols.length | 0], a: 0, s: (Math.random() - .5) * .3 }));
    let f = 0;
    (function draw() { ctx.clearRect(0, 0, W, H); bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .3; b.a += b.s; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore(); }); if (++f < 130) requestAnimationFrame(draw); else c.remove(); })();
  }
})();
