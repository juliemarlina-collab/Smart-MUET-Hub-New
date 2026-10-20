/* Smart MUET Guide eBook · interactive page games.
   On the eBook's question pages (1.4, 3.4, 4.4, 5.4, 6.4 and the 7 Quiz Show) a "Play" button opens the same
   questions as a tap-to-answer game: instant feedback, auto-scored stars, best score saved, confetti for a high score.
   Questions and answers come from the eBook and its answer key on p. 49.
   Storage: smh.ebook.quiz.v1 = { "3.4": { best, total, last, attempts, date }, … } (read by the Hub's XP, Me and Home). */
(() => {
  'use strict';
  const KEY = 'smh.ebook.quiz.v1';
  const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x !== undefined) n.textContent = x; return n; };

  const GAMES = {
    '1.4': { pages: [8], title: 'Fact or Cap?', colour: '#3b5bff', note: '“Cap” means it’s not true! Tap FACT or CAP for each card.', parts: [
      { type: 'tf', label: 'Fact or Cap', items: [
        ['MUET is set and run by Majlis Peperiksaan Malaysia.', 0, 'MPM sets and runs MUET.'],
        ['The total MUET score is 300 marks.', 1, 'The total is 360: four papers × 90.'],
        ['Each of the four papers is worth 90 marks.', 0, 'Listening, Speaking, Reading and Writing are 90 each.'],
        ['A total of 260 gives Band 4.0.', 1, '260 is Band 4.5 (258–293).'],
        ['Speaking is taken on a different day from the written papers.', 0, 'Speaking has its own day.'],
        ['A MUET result is valid for 3 years.', 1, 'A result is valid for 5 years.'],
        ['You need SPM to register for MUET.', 1, 'MPM sets no entry conditions.'],
        ['Band 5.0 is CEFR level C1.', 0, 'Band 5.0 = C1.']] }] },
    '3.4': { pages: [21], title: 'Catch the clue', colour: '#b88a00', note: 'Four quick questions, then sort the signposts.', parts: [
      { type: 'mcq', label: 'Quick check', items: [
        ['Before you hear “Where will the talk take place?”, predict the answer type.', ['a time', 'a place', 'a reason'], 1, '“Where” asks for a place.'],
        ['“I wanted the blue one, but in the end I bought the black one.” Which did the speaker buy?', ['the blue one', 'the black one', 'both'], 1, '“but in the end” gives the final choice.'],
        ['Which word often signals a change of mind?', ['also', 'actually', 'for instance'], 1, '“Actually” often corrects what came before.'],
        ['“I’d love to come, but I’ve got a test tomorrow.” The speaker is…', ['accepting', 'refusing politely', 'asking a question'], 1, '“I’d love to… but” is a polite refusal.']] },
      { type: 'sort', label: 'Signpost sort', cats: ['Contrast', 'Adding', 'Example', 'Reason', 'Conclusion'],
        items: [['however', 0], ['moreover', 1], ['for instance', 2], ['because', 3], ['overall', 4], ['instead', 0], ['also', 1], ['such as', 2], ['due to', 3], ['in the end', 4]] }] },
    '4.4': { pages: [28], title: 'Build it, then say it', colour: '#0b9b55', note: 'Four quick questions, then Roll & Talk.', parts: [
      { type: 'mcq', label: 'Quick check', items: [
        ['PREP starts with…', ['an example', 'your point', 'a question'], 1, 'P = Point: say your answer first.'],
        ['Best Reason for “Join a club”:', ['Clubs are fun.', 'You work with people who share your interests.', 'My friend joined one.'], 1, 'A reason explains why the point is true.'],
        ['Which phrase invites a partner to speak?', ['What do you think, Aina?', 'In conclusion…', 'For example…'], 0, 'Asking by name invites a partner in.'],
        ['Preparation time for Part 1:', ['1 minute', '2 minutes', '3 minutes'], 1, 'You have 2 minutes to prepare.']] },
      { type: 'speak', label: 'Roll & Talk', topics: ['Your favourite place on campus', 'A skill every student needs', 'The best way to relax after class', 'Should phones be allowed in class?', 'A useful app for students', 'Your dream job and why'] }] },
    '5.4': { pages: [35], title: 'Find the evidence', colour: '#e2620e', note: 'Read the notice, answer four questions, then play Word Detective.',
      text: 'LIBRARY NOTICE · From 1 March, the library will open at 8 a.m. instead of 9 a.m. on weekdays. Weekend hours stay the same. Students who want to book discussion rooms must now do so online at least one day in advance.', parts: [
      { type: 'mcq', label: 'Quick check', items: [
        ['What changes on weekdays?', ['the closing time', 'the opening time', 'the weekend hours'], 1, 'It opens at 8 a.m. instead of 9 a.m.'],
        ['“do so” refers to…', ['booking discussion rooms', 'opening earlier', 'studying online'], 0, '“do so” points back to booking discussion rooms.'],
        ['Which statement is true?', ['Same-day room bookings are fine.', 'Weekend hours will change.', 'Bookings must be made online.'], 2, '“must now do so online”.'],
        ['In SCAN, “Circle” means…', ['circle every word', 'mark the key meaning', 'circle the answer letter'], 1, 'Circle the key meaning of the question.']] },
      { type: 'match', label: 'Word Detective', left: ['in advance', 'qualifier', 'paraphrase', 'relocate', 'evidence', 'inference'],
        right: ['move to a new place', 'a conclusion the text supports', 'before a set time', 'the words that prove an answer', 'same idea, different words', 'a small word that limits meaning (only, most)'],
        key: [2, 5, 4, 0, 3, 1] }] },
    '6.4': { pages: [42], title: 'Pitch it right', colour: '#e0479e', note: 'Four quick questions, then sort formal and informal phrases.', parts: [
      { type: 'mcq', label: 'Quick check', items: [
        ['In PEEL, the second E stands for…', ['Evidence', 'Example', 'Essay'], 1, 'Point, Explain, Example, Link.'],
        ['Which sentence EXPLAINS “Internships help”?', ['Internships are good.', 'Students apply theory to real work.', 'I like internships.'], 1, 'It shows how internships help.'],
        ['Best opening for an email to a lecturer:', ['Hey sir!', 'Dear Encik Rahman,', 'Yo, got your message.'], 1, 'Formal: Dear + title + name.'],
        ['Minimum length for Task 2:', ['100 words', '200 words', '250 words'], 2, 'Task 2 needs at least 250 words.']] },
      { type: 'tf', label: 'Formal or informal?', opts: ['Formal', 'Informal'], items: [
        ['Dear Encik Rahman,', 0], ['Hey there!', 1], ['I look forward to hearing from you.', 0], ['Can’t wait to see you!', 1],
        ['I would appreciate your assistance.', 0], ['Thanks a lot!', 1], ['Yours sincerely,', 0], ['Gonna tell you everything later.', 1, 'Too casual even for a friend in Task 1.']] }] },
    '7': { pages: [46, 47], title: 'Quiz Show', colour: '#e3a800', note: 'Eight questions from all four papers. 8 stars: Champion!', parts: [
      { type: 'mcq', label: 'Quiz Show', items: [
        ['LISTENING · How many times is each Listening recording played?', ['Once', 'Twice', 'Three times'], 1],
        ['LISTENING · Which word often comes just before the real answer, after a distractor?', ['Furthermore', 'For example', 'Actually'], 2],
        ['SPEAKING · How long do you prepare for Part 1, the individual presentation?', ['1 minute', '2 minutes', '3 minutes'], 1],
        ['SPEAKING · “What do you think about this, Aina?” In Part 2, this phrase is used to…', ['invite others to speak', 'disagree politely', 'end the discussion'], 0],
        ['READING · How many questions are there in the MUET Reading paper?', ['30', '40', '50'], 1],
        ['READING · In a gapped text, what should you check on both sides of each gap?', ['Pictures and titles', 'Pronouns and linkers', 'Page numbers'], 1],
        ['WRITING · What is the minimum length for Writing Task 2?', ['100 words', '200 words', '250 words'], 2],
        ['WRITING · Which sign-off suits a formal email to a director?', ['See ya!', 'Yours sincerely,', 'Take care,'], 1]] }] }
  };
  Object.assign(GAMES, {
    '1.6': { pages: [10], title: 'Where am I now?', colour: '#3b5bff', kind: 'check', note: 'Tick each skill you feel confident using. Then choose your next focus and target band. This reflection does not predict a band.',
      skills: [['listening', 'Listening', ['I can follow the main points of a clear talk on a familiar topic.', 'I can catch details, opinions and changes of mind in a discussion.', 'I can follow a long talk and work out what the speaker really means.']],
        ['speaking', 'Speaking', ['I can give a simple opinion with one reason.', 'I can develop a point with a reason and an example.', 'I can respond to others and keep a group discussion going.']],
        ['reading', 'Reading', ['I can find facts in notices, emails and short texts.', 'I can follow the writer’s main argument and opinion in an article.', 'I can infer meaning and attitude in long, complex texts.']],
        ['writing', 'Writing', ['I can write a short email that answers every note.', 'I can write a clear essay with developed PEEL paragraphs.', 'I can choose a formal or informal style to suit the reader.']]] },
    '3.3': { pages: [20], title: 'Try it first: only one is chosen', colour: '#b88a00', note: 'Answer before you read the CLUE thinking on the page.',
      text: 'Hana: Are we still meeting on Tuesday morning for the study group? · Ravi: That was the plan, but the lab is booked then. Wednesday afternoon is free. · Hana: Wednesday’s no good for me. I’ve got a presentation. What about Thursday? · Ravi: Thursday afternoon works. Let’s make it then.', parts: [
      { type: 'mcq', label: 'Try it first', items: [
        ['When will the study group meet this week?', ['Tuesday morning', 'Wednesday afternoon', 'Thursday afternoon'], 2, 'Thursday afternoon: Ravi confirms it in the last line.'],
        ['Why is Tuesday morning wrong?', ['Hana is busy', 'The lab is booked', 'Ravi forgot'], 1, '“That was the plan, but the lab is booked then.”'],
        ['Which line confirms the final answer?', ['“That was the plan, but…”', '“Wednesday’s no good for me.”', '“Let’s make it then.”'], 2, '“Let’s make it then” confirms the decision.']] }] },
    '4.3': { pages: [27], title: 'Try it first: build the PREP', colour: '#0b9b55', note: 'Task: “How can students build stronger friendships?” Put each sentence in its PREP place.', parts: [
      { type: 'sort', label: 'Build the answer', cats: ['Point', 'Reason', 'Example', 'Point again'], items: [
        ['I suggest joining a campus club to build stronger friendships.', 0],
        ['A club gives students regular opportunities to cooperate with people who share their interests.', 1],
        ['For example, photography club members can plan an exhibition together and help each other improve.', 2],
        ['Therefore, joining a club is a practical way to turn shared interests into lasting friendships.', 3]] }] },
    '5.3': { pages: [34], title: 'Try it first: find it, then confirm it', colour: '#e2620e', note: 'Answer before you read the SCAN thinking on the page.',
      text: 'When the student council opened a small food bank in the library foyer last March, organisers expected about twenty visitors a week. Within a month, nearly eighty students were collecting basic items. The council moved the food bank to a larger room beside the cafeteria. Not everyone welcomed the change at first. Some students worried that the new location was too public. To protect privacy, volunteers now prepare packs in advance so that visitors can collect them quickly.', parts: [
      { type: 'mcq', label: 'Try it first', items: [
        ['Why do volunteers now prepare packs in advance?', ['To serve more students', 'To help visitors feel comfortable', 'To reduce food costs'], 1, 'B paraphrases “to protect privacy”.'],
        ['Which words in the text does the right answer paraphrase?', ['“collecting basic items”', '“to protect privacy”', '“a larger room”'], 1, 'Feeling comfortable = privacy is protected.'],
        ['Why is “To serve more students” tempting but wrong?', ['More students came, but that is not why packs are prepared.', 'The text says packs cost less.', 'The text never mentions students.'], 0, 'A familiar idea is not the reason the question asks for.']] }] },
    '6.3': { pages: [41], title: 'Try it first: build the PEEL', colour: '#e0479e', note: 'Question: “Should polytechnics make community service compulsory?” Put each sentence in its PEEL place.', parts: [
      { type: 'sort', label: 'Build the paragraph', cats: ['Point', 'Explain', 'Example', 'Link'], items: [
        ['Compulsory community service can help students develop practical teamwork skills.', 0],
        ['Service projects require students to plan tasks, share responsibilities and solve problems with others.', 1],
        ['For instance, a group organising a beach clean-up in Port Dickson must arrange transport and keep volunteers safe.', 2],
        ['Therefore, making community service part of the programme gives every student real teamwork practice.', 3]] }] },
    '3.5': { pages: [22], title: 'Spot the trap: word-match', colour: '#b88a00', note: 'Two quick cases. Can you avoid the word-match trap?', parts: [
      { type: 'mcq', label: 'Spot the mistake', items: [
        ['You hear: “The meeting is at two. Sorry, I mean three.” A student answers 2 p.m. What went wrong?', ['The student chose the first detail; the speaker corrected it.', 'Two is never mentioned.', 'The student should have guessed.'], 0, 'Speakers correct themselves. Answer the FINAL detail.'],
        ['“We’ll take the train… actually, the bus is cheaper, let’s do that.” How will they travel?', ['By train', 'By bus', 'By car'], 1, '“actually” signals the change: the bus.']] }] },
    '4.5': { pages: [29], title: 'Spot the trap: script-reader freeze', colour: '#0b9b55', note: 'Two quick cases. Can you avoid the script-reader freeze?', parts: [
      { type: 'mcq', label: 'Spot the mistake', items: [
        ['Which preparation note is best for Part 1?', ['A full paragraph written word for word', 'club → teamwork → photo exhibition → friendships', 'No notes at all'], 1, 'Keywords in PREP order, not full sentences.'],
        ['In the group discussion, which response shows you are listening?', ['Reading out your prepared speech', '“Building on Mei’s idea, we could also…”', 'Staying silent until the end'], 1, 'Build on others’ ideas by name.']] }] },
    '5.5': { pages: [36], title: 'Spot the trap: keyword-only matcher', colour: '#e2620e', note: 'Two quick cases. Read before AND after the gap.', parts: [
      { type: 'mcq', label: 'Spot the mistake', items: [
        ['“Fewer students now drive to campus. ____ As a result, the car park is rarely full.” Which sentence fits the gap?', ['However, many still prefer cars.', 'Most of them cycle or take the free shuttle bus instead.', 'Cars are expensive in Malaysia.'], 1, 'It explains the change and leads to “As a result”.'],
        ['A student chose “However, many still prefer cars” because it repeats “cars”. Which check would have helped?', ['Read the sentence before and after the gap', 'Choose the longest option', 'Match the most keywords'], 0, 'The meaning must fit on both sides of the gap.']] }] },
    '6.5': { pages: [43], title: 'Spot the trap: off-topic wanderer', colour: '#e0479e', note: 'Two quick cases. Does every part answer the full task?', parts: [
      { type: 'mcq', label: 'Spot the mistake', items: [
        ['Task 2: “Explain why mental health education is important for students.” Which topic sentence answers the full task?', ['Stress is caused by exams and money problems.', 'Mental health education helps students recognise stress early and seek help.', 'Many students live in hostels.'], 1, 'It answers WHY the education is important.'],
        ['Task 1 asks you to accept an invitation, suggest a time and offer help. A reply accepts and suggests a time. What is missing?', ['The greeting', 'Offering help', 'The date of the email'], 1, 'Respond to every prompt in Task 1.']] }] },
    '8.2': { pages: [50], title: 'My eBook stars', colour: '#3b5bff', kind: 'stars', note: 'Your best stars from every eBook game, saved on this device.' }
  });
  const totalOf = g => !g.parts ? 0 : g.parts.reduce((n, p) => n + (p.type === 'speak' ? 4 : p.type === 'match' ? p.left.length : p.items.length), 0);
  const pageGame = {}; Object.entries(GAMES).forEach(([id, g]) => g.pages.forEach(p => (pageGame[p] = id)));
  window.SMHEbookGames = { GAMES, totalOf, KEY };

  /* ---------- floating Play button, shown on question pages ---------- */
  const dock = el('div', 'qz-dock'); document.body.append(dock);
  function visiblePages() {
    const c = document.getElementById('count'); if (!c) return [];
    const m = c.textContent.match(/^(\d+)(?:–(\d+))?/); if (!m) return [];
    return m[2] ? [+m[1], +m[2]] : [+m[1]];
  }
  function updateFab() {
    const ids = [...new Set(visiblePages().map(p => pageGame[p]).filter(Boolean))];
    dock.replaceChildren();
    ids.forEach(id => {
      const g = GAMES[id], rec = load()[id], fab = el('button', 'qz-fab'); fab.type = 'button';
      fab.style.setProperty('--qc', g.colour);
      const sub = g.kind === 'check' ? (selfCheck() ? 'Saved · focus: ' + selfCheck().focus : 'Tick, choose, save') : g.kind === 'stars' ? starSummary().got + ' / ' + starSummary().max + ' stars so far' : rec ? '★ best ' + rec.best + ' / ' + rec.total : 'Tap to answer and score';
      fab.append(el('span', 'qz-fab-play', g.kind === 'stars' ? '★' : g.kind === 'check' ? '✓' : '▶'), el('b', '', (g.kind ? 'Open ' : 'Play ') + id + ' · ' + g.title), el('small', '', sub));
      fab.setAttribute('aria-label', (g.kind ? 'Open ' : 'Play the interactive version of ') + id + ' ' + g.title + '. ' + sub);
      fab.onclick = () => (g.kind === 'check' ? openCheck(id) : g.kind === 'stars' ? openStars(id) : open(id));
      dock.append(fab);
    });
  }
  const cnt = document.getElementById('count');
  if (cnt) new MutationObserver(updateFab).observe(cnt, { childList: true, characterData: true, subtree: true });
  setTimeout(updateFab, 300);


  /* ---------- the game dialog ---------- */
  function open(id) {
    const g = GAMES[id], total = totalOf(g);
    let stars = 0, answered = 0;
    const d = el('dialog', 'qz'); d.style.setProperty('--qc', g.colour);
    d.setAttribute('aria-label', id + ' ' + g.title);
    const head = el('div', 'qz-head');
    const score = el('div', 'qz-score'); score.setAttribute('role', 'status');
    const close = el('button', 'qz-x', '✕'); close.type = 'button'; close.setAttribute('aria-label', 'Close the game');
    head.append(el('span', 'qz-code', id), el('h2', '', g.title), score, close);
    const body = el('div', 'qz-body');
    body.append(el('p', 'qz-note', g.note));
    if (g.text) body.append(el('div', 'qz-text', g.text));
    const paint = () => { score.textContent = '★ ' + stars + ' / ' + total + '  ·  ' + answered + ' answered'; finish.disabled = answered < total; };
    const mark = (ok) => { answered++; if (ok) stars++; paint(); };

    g.parts.forEach(part => {
      const sec = el('section', 'qz-part'); sec.append(el('h3', '', part.label));
      if (part.type === 'mcq' || part.type === 'tf') {
        part.items.forEach((it, i) => {
          const [q, a, b, c] = it;
          const opts = part.type === 'mcq' ? a : (part.opts || ['FACT', 'CAP']);
          const right = part.type === 'mcq' ? b : a, why = part.type === 'mcq' ? c : b;
          const card = el('div', 'qz-q'); card.append(el('p', '', (i + 1) + '. ' + q));
          const row = el('div', 'qz-opts' + (part.type === 'tf' ? ' two' : ''));
          opts.forEach((o, k) => {
            const btn = el('button', 'qz-opt', (part.type === 'mcq' ? 'ABC'[k] + '  ' : '') + o); btn.type = 'button';
            btn.onclick = () => {
              if (card.dataset.done) return; card.dataset.done = '1';
              const ok = k === right;
              btn.classList.add(ok ? 'ok' : 'no');
              row.children[right].classList.add('ok');
              [...row.children].forEach(x => (x.disabled = true));
              const fb = el('p', 'qz-fb ' + (ok ? 'ok' : 'no'), (ok ? '✓ Correct. ' : '✗ Not quite. ') + (why || 'Answer: ' + opts[right] + '.'));
              card.append(fb); mark(ok); pop(btn, ok);
            };
            row.append(btn);
          });
          card.append(row); sec.append(card);
        });
      } else if (part.type === 'sort') {
        sec.append(el('p', 'qz-help', (part.items[0][0].length > 30 ? 'Tap a sentence, then tap its place.' : 'Tap a word, then tap its job.')));
        const words = el('div', 'qz-chips'), cats = el('div', 'qz-cats');
        let picked = null;
        shuffle(part.items).forEach(([w, cat]) => {
          const chip = el('button', 'qz-chip', w); chip.type = 'button'; chip.dataset.cat = cat;
          chip.onclick = () => { if (chip.disabled) return; words.querySelectorAll('.qz-chip').forEach(x => x.classList.remove('pick')); picked = chip; chip.classList.add('pick'); };
          words.append(chip);
        });
        part.cats.forEach((name, ci) => {
          const box = el('button', 'qz-cat'); box.type = 'button';
          box.append(el('b', '', name), el('span', 'qz-drop'));
          box.onclick = () => {
            if (!picked) return;
            const ok = +picked.dataset.cat === ci, chip = picked; picked = null;
            chip.classList.remove('pick'); chip.disabled = true; chip.classList.add(ok ? 'ok' : 'no');
            const placed = el('span', 'qz-placed ' + (ok ? 'ok' : 'no'), chip.textContent + (ok ? '' : ' → ' + part.cats[+chip.dataset.cat]));
            (ok ? box : cats.children[+chip.dataset.cat]).querySelector('.qz-drop').append(placed);
            mark(ok); pop(box, ok);
          };
          cats.append(box);
        });
        sec.append(words, cats);
      } else if (part.type === 'match') {
        sec.append(el('p', 'qz-help', 'Tap a word on the left, then its meaning on the right.'));
        const grid = el('div', 'qz-match'), L = el('div'), R = el('div');
        let picked = null;
        part.left.forEach((w, i) => {
          const b = el('button', 'qz-chip', (i + 1) + '  ' + w); b.type = 'button'; b.dataset.i = i;
          b.onclick = () => { if (b.disabled) return; L.querySelectorAll('.qz-chip').forEach(x => x.classList.remove('pick')); picked = b; b.classList.add('pick'); };
          L.append(b);
        });
        shuffle(part.right.map((t, j) => [t, j])).forEach(([t, j]) => {
          const b = el('button', 'qz-mean', t); b.type = 'button'; b.dataset.j = j;
          b.onclick = () => {
            if (!picked || b.disabled) return;
            const i = +picked.dataset.i, ok = part.key[i] === j, chip = picked; picked = null;
            chip.classList.remove('pick'); chip.disabled = true; chip.classList.add(ok ? 'ok' : 'no');
            if (ok) { b.disabled = true; b.classList.add('ok'); b.prepend(el('b', '', (i + 1) + ' ✓ ')); }
            else chip.append(el('small', '', ' → ' + part.right[part.key[i]]));
            mark(ok); pop(ok ? b : chip, ok);
          };
          R.append(b);
        });
        grid.append(L, R); sec.append(grid);
      } else if (part.type === 'speak') {
        const t = part.topics[Math.floor(Math.random() * part.topics.length)];
        const topic = el('p', 'qz-topic', t);
        const roll = el('button', 'qz-small', '🎲 Roll again'); roll.type = 'button';
        roll.onclick = () => { if (sec.dataset.done) return; topic.textContent = part.topics[Math.floor(Math.random() * part.topics.length)]; };
        const clock = el('div', 'qz-clock', '0:30'), go = el('button', 'qz-small', '▶ Start: 30 s plan, 1 min talk'); go.type = 'button';
        let timer = 0;
        go.onclick = () => {
          clearInterval(timer); let left = 30, phase = 'Plan';
          const tick = () => { clock.textContent = phase + ' ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); if (left-- <= 0) { if (phase === 'Plan') { phase = 'Talk'; left = 60; } else { clearInterval(timer); clock.textContent = 'Time! Tick the PREP parts you used.'; } } };
          tick(); timer = setInterval(tick, 1000);
        };
        const ticks = el('div', 'qz-ticks');
        ['Point', 'Reason', 'Example', 'Point again'].forEach(p => {
          const lab = el('label', 'qz-tick'), box = el('input'); box.type = 'checkbox'; lab.append(box, document.createTextNode(' ' + p)); ticks.append(lab);
        });
        const done = el('button', 'qz-small', 'Score my talk ✓'); done.type = 'button';
        done.onclick = () => {
          if (sec.dataset.done) return; sec.dataset.done = '1'; clearInterval(timer);
          const n = ticks.querySelectorAll('input:checked').length;
          ticks.querySelectorAll('input').forEach(x => (x.disabled = true)); done.disabled = true;
          stars += n; answered += 4; paint(); pop(done, n >= 3);
          sec.append(el('p', 'qz-fb ' + (n >= 3 ? 'ok' : 'no'), '★ ' + n + ' / 4 for your talk. ' + (n === 4 ? 'Full PREP!' : 'Next time add the part you missed.')));
        };
        sec.append(el('p', 'qz-help', 'Pick a topic, plan for 30 seconds, then speak for 1 minute using PREP. Tick each part you used (or ask a partner to tick).'), topic, roll, clock, go, ticks, done);
      }
      body.append(sec);
    });

    const finish = el('button', 'qz-finish', 'See my stars ★'); finish.type = 'button';
    const result = el('div', 'qz-result'); result.hidden = true;
    finish.onclick = () => {
      const rec = load(), prev = rec[id], pct = stars / total;
      rec[id] = { best: Math.max(stars, prev ? prev.best : 0), total, last: stars, attempts: (prev ? prev.attempts : 0) + 1, date: new Date().toISOString() };
      save(rec);
      result.hidden = false; result.replaceChildren();
      const title = pct === 1 ? 'Perfect! ★ Champion' : pct >= .75 ? 'Great work!' : pct >= .5 ? 'Good effort!' : 'Keep practising!';
      result.append(el('h3', '', title), el('p', 'qz-big', '★ ' + stars + ' / ' + total),
        el('p', '', (prev && stars > prev.best ? 'New best score! ' : prev ? 'Your best: ' + rec[id].best + ' / ' + total + '. ' : '') + 'Saved on this device and added to your Hub record.'));
      const again = el('button', 'qz-small', 'Play again ↻'); again.type = 'button'; again.onclick = () => { d.close(); d.remove(); open(id); };
      const back = el('button', 'qz-small', 'Back to the page'); back.type = 'button'; back.onclick = () => d.close();
      result.append(again, back);
      result.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
      if (pct >= .75) confetti(d);
      updateFab();
    };
    body.append(finish, result);
    d.append(head, body);
    document.body.append(d);
    close.onclick = () => d.close();
    d.addEventListener('close', () => setTimeout(() => d.remove(), 50));
    paint(); d.showModal(); close.focus();
  }

  const SC = 'smh.ebook.selfcheck.v1';
  const selfCheck = () => { try { const v = JSON.parse(localStorage.getItem(SC)); return v && v.focus ? v : null; } catch { return null; } };
  function starSummary() {
    const rec = load(); let got = 0, max = 0;
    Object.entries(GAMES).forEach(([id, g]) => { if (g.kind) return; const t = totalOf(g); max += t; got += rec[id] ? Math.min(rec[id].best, t) : 0; });
    return { got, max, rec };
  }
  function shell(id, title, colour) {
    const d = el('dialog', 'qz'); d.style.setProperty('--qc', colour); d.setAttribute('aria-label', id + ' ' + title);
    const head = el('div', 'qz-head'), close = el('button', 'qz-x', '✕'); close.type = 'button'; close.setAttribute('aria-label', 'Close');
    head.append(el('span', 'qz-code', id), el('h2', '', title), el('span'), close);
    const body = el('div', 'qz-body'); d.append(head, body); document.body.append(d);
    close.onclick = () => d.close(); d.addEventListener('close', () => { setTimeout(() => d.remove(), 50); updateFab(); });
    return { d, body, close };
  }
  function openCheck(id) {
    const g = GAMES[id], prev = selfCheck() || {}, { d, body, close } = shell(id, g.title, g.colour);
    body.append(el('p', 'qz-note', g.note));
    const boxes = {};
    g.skills.forEach(([k, name, items]) => {
      const sec = el('section', 'qz-part'); sec.append(el('h3', '', name));
      boxes[k] = items.map((t, i) => {
        const lab = el('label', 'qz-checkrow'), b = el('input'); b.type = 'checkbox'; b.checked = !!(prev.ticks && prev.ticks[k] && prev.ticks[k][i]);
        lab.append(b, el('span', '', t)); sec.append(lab); return b;
      });
      body.append(sec);
    });
    const sec = el('section', 'qz-part'); sec.append(el('h3', '', 'My next practice focus'));
    const foc = el('div', 'qz-opts two'); let focus = prev.focus || '';
    g.skills.forEach(([k, name]) => { const b = el('button', 'qz-opt' + (focus === k ? ' ok' : ''), name); b.type = 'button'; b.onclick = () => { focus = k; [...foc.children].forEach(x => x.classList.toggle('ok', x === b)); }; foc.append(b); });
    const tgt = el('select', 'qz-select'); ['', 'Band 3.0', 'Band 3.5', 'Band 4.0', 'Band 4.5', 'Band 5.0', 'Band 5+'].forEach(v => { const o = el('option', '', v || 'My target band…'); o.value = v; tgt.append(o); });
    let prof = {}; try { prof = JSON.parse(localStorage.getItem('smh.me.profile')) || {}; } catch {}
    tgt.value = prev.target || prof.target || '';
    sec.append(foc, el('h3', '', 'My target band'), tgt);
    const saveBtn = el('button', 'qz-finish', 'Save my starting point ✓'); saveBtn.type = 'button';
    const out = el('div', 'qz-result'); out.hidden = true;
    saveBtn.onclick = () => {
      const ticks = Object.fromEntries(Object.entries(boxes).map(([k, bs]) => [k, bs.map(b => b.checked)]));
      const count = Object.fromEntries(Object.entries(ticks).map(([k, t]) => [k, t.filter(Boolean).length]));
      if (!focus) focus = Object.entries(count).sort((a, b) => a[1] - b[1])[0][0];
      const rec = { ticks, focus, target: tgt.value, date: new Date().toISOString() };
      try { localStorage.setItem(SC, JSON.stringify(rec)); localStorage.setItem('smh.flow.focus', JSON.stringify(focus)); if (tgt.value) { prof.target = tgt.value; localStorage.setItem('smh.me.profile', JSON.stringify(prof)); } } catch {}
      out.hidden = false; out.replaceChildren();
      const name = g.skills.find(s => s[0] === focus)[1];
      out.append(el('h3', '', 'Saved! Your focus: ' + name));
      const bars = el('div', 'qz-bars');
      g.skills.forEach(([k, n, items]) => { const r = el('div', 'qz-barrow'); r.append(el('span', '', n)); const t = el('div', 'qz-track'), f = el('i'); f.style.width = count[k] / items.length * 100 + '%'; t.append(f); r.append(t, el('b', '', count[k] + ' / ' + items.length)); bars.append(r); });
      const go = el('a', 'qz-small', 'Open the ' + name + ' Lab ↗'); go.href = '../labs/' + focus + '-lab.html';
      out.append(bars, el('p', '', 'Shown on your Me page' + (tgt.value ? ' with your target ' + tgt.value : '') + '. Use it to plan practice, not to predict a result.'), go);
      out.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
      confetti(d);
    };
    body.append(sec, saveBtn, out); d.showModal(); close.focus();
  }
  function openStars(id) {
    const g = GAMES[id], { d, body, close } = shell(id, g.title, g.colour), sum = starSummary();
    body.append(el('p', 'qz-big', '★ ' + sum.got + ' / ' + sum.max), el('p', 'qz-note', g.note));
    const list = el('div', 'qz-starlist');
    Object.entries(GAMES).forEach(([gid, gg]) => {
      if (gg.kind) return;
      const t = totalOf(gg), r = sum.rec[gid], row = el('button', 'qz-starrow' + (r ? ' won' : '')); row.type = 'button';
      row.style.setProperty('--qc', gg.colour);
      row.append(el('span', 'qz-code', gid), el('b', '', gg.title), el('span', '', r ? '★ ' + Math.min(r.best, t) + ' / ' + t : '▶ play · p. ' + gg.pages[0]));
      row.onclick = () => { d.close(); location.hash = '#page=' + gg.pages[0]; };
      list.append(row);
    });
    const badges = el('a', 'qz-finish', 'See my Hub badges ↗'); badges.href = '../me.html#badges';
    body.append(list, badges); d.showModal(); close.focus();
    if (sum.got && sum.got === sum.max) confetti(d);
  }

  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  function pop(node, ok) { if (reduced()) return; node.animate(ok ? [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }] : [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 320 }); }
  function confetti(host) {
    if (reduced()) return;
    const c = el('canvas', 'qz-confetti'); host.append(c);
    const ctx = c.getContext('2d'), W = (c.width = host.clientWidth), H = (c.height = host.clientHeight);
    const cols = ['#b88a00', '#0b9b55', '#ffcc33', '#e0479e', '#3b5bff', '#ff754a'];
    const bits = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - .5) * 80, y: H * .35, vx: (Math.random() - .5) * 11, vy: -Math.random() * 11 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, s: (Math.random() - .5) * .3 }));
    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .32; b.vx *= .99; b.a += b.s; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore(); });
      if (++f < 150) requestAnimationFrame(draw); else c.remove();
    })();
  }
})();
