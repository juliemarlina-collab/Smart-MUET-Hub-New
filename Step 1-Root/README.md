# Smart MUET · Parts 1–4

A modular vanilla HTML/CSS/JavaScript rebuild for GitHub Pages. The earlier V2/V3 app is kept separate. No framework, Sites service or runtime build step is required.

## Open the website

Open root `index.html` for the central Home page. See `START-HERE.md` for the study route and GitHub Pages setup. Orientation remains at `welcome/index.html`. For the new book, open `book/index.html`. Upload the contents of this project folder to a new GitHub repository with the same relative folder structure, then enable GitHub Pages. Keep `.nojekyll` at the repository root.

## Modules

| Folder | Purpose | Status |
|---|---|---|
| `welcome/` | Orientation, four skills and learning route | Built |
| `account/` | Registration, login, email confirmation and recovery | Built; account service disabled by default |
| `guides/` | Introduction plus Speaking, Reading, Listening and Writing guides | Built |
| `book/` | 53-page PDF reader + 30-page practice lab | Built |
| `labs/` | Four skill labs (Listening CLUE, Speaking PREP, Reading SCAN, Writing PEEL); Vaults, Mock and Arcade to follow | Labs built; Vaults planned |
| `06-progress/` | Local reading/guide/lab progress, all-lab reflection timeline and review-queue count | Built locally; XP engine planned |
| `shared/` | Supplied illustrations, logo, local fonts, styles and audio | Shared foundation |
| `docs/` | Design and account setup instructions | Reference |

## Independent learning

The component guides use six labelled sections: Start here / Learn / See an example / Practise / Check & improve / Reflect. The practice lab uses five pages in each chapter: Start here / See a model / Try it / Play & check / Reflect. Section numbers are learning steps, separate from official exam part numbers. Instructions appear at every stage; learners may revisit any section.

The PDF eBook reader includes 53 WebP thumbnails, contents, zoom, search, bookmarks and page notes. The companion practice lab features: chapter library, contents dialog, previous/next pages, last-page resume, page bookmarks, marked reading progress, explanatory quizzes, sorting games, PREP outline, Roll & Talk timer, writing draft review, local notes and text downloads. See `book/README.md` for scope and device narration details.

## Visual edits

- Supplied assets: `shared/assets/`; local fonts: `shared/fonts/`.
- Guide hero replacements: `guides/config.js`.
- Book hero replacement: `book/config.js`.
- Update HTML alt text when replacing an illustration.
- Cream navigation, large coral greetings, colourful folders and readable 14–15px content remain consistent across modules.
- Pause motion and OS reduced-motion preferences stop decorative animations.

## Accounts and local records

Default account preview allows email typing but creates no account and sends no email. Password entry is disabled in preview. To configure a real service, follow `docs/ACCOUNT-SETUP.md`; use only a public publishable key. No real email delivery has been tested in this build.

Guide and book notes, drafts, activity attempts, bookmarks and learner-marked progress use local browser storage. They are not uploaded. If storage is unavailable, the interface explains that records last for this visit and offers note/draft downloads. Clearing browser data removes local records. Sign-in behaviour is documented separately in the account module.

Page completion is the learner’s acknowledgement. Word counts and checklists are descriptive self-review aids. Short quiz scores and models are not official MUET bands or automated language assessment.

## Delivery files

`Smart-MUET-Part-04-Preview.html` is a separate self-contained preview including Welcome, Account, Overview, all four guides and Book. `Smart-MUET-Parts-01-04.zip` contains this source tree for GitHub Pages. The preview forces account preview mode. The source tree is the edition to edit and deploy.

## Verification

Part 4 checked in Chromium at 1440, 768, 390 and 360px: all 30 pages, quiz feedback/retry and saved attempts, sorting games, PREP outline, speaking timer pause/reset, writing count/review, bookmarks, notes, downloads, contents/Escape, last-page resume and reduced motion. The combined preview was checked for local navigation, embedded illustrations, editable drafts and email fields, horizontal fit, JavaScript errors and unintended remote requests. Browser narration depends on the device and is not a guaranteed recording.

Next build (Part 12): Arcade page, Welcome consent toggles and profile, exam countdown fix, then the pilot.


PDF reader verification: 53 pages, 8 chapter outlines and 186 PDF link regions. Chromium checks cover PDF rendering, thumbnail/chapter/search navigation, link destinations, zoom/spread, local notes/bookmark persistence and responsive layouts at 1440, 768, 390 and 360px.


Part 5: `labs/speaking-lab.html` is the first guided component lab within Learn. Six labelled steps, CSS 3D/2D PREP model, three explained drills, independent topics, timer, local recording/replay, self-review and reflection timeline. Other labs and the Vault sequence remain planned. See its README for privacy and browser support.


## Connected navigation

All authored pages share Home · Book · Learn · Vault · Me navigation, a current-page indicator and a route-back link. Home resumes the last learning page. Guide continuation panels link to matching Book chapters and available practice. Me reads existing local records; the Vault gateway distinguishes available exercises from planned full levels. The complete preview uses a compact page selector.


Navigation verification: all 13 authored pages checked at 1440, 390 and 360px, with five app links and one active destination on each page. Resume links, guide-to-practice routing, existing guide progress, deduplicated PDF read counts, reflection timeline/export and skill preference persistence passed. The self-contained preview routes among Home, Learn, Lab, Me and the embedded PDF.


## Part 6 · Reading, Listening and Writing labs (18 Oct 2026)

Three new guided labs in `labs/`, matching the Speaking PREP Lab’s six steps (Start here / I do · Model / We do · Drills / You do / Check & improve / Reflect & next):

| Lab | You do task | Drills |
|---|---|---|
| `listening-lab.html` · CLUE | Part 3 match (3 speakers, A–E) + two Part 5 dialogues; Practice or Exam-style (two plays) | Predict answer type, catch the signpost, eliminate the distractor |
| `reading-lab.html` · SCAN | Two original texts, five 4-option questions each, hints, 8/5-minute timer, evidence notes | Evidence hunt (tap the sentence), paraphrase, reference |
| `writing-lab.html` · PEEL | Task 2 (two prompts) or Task 1 email; planner, draft, live word count, 50/25/12-minute timer, quick check | Order a PEEL paragraph, choose the explanation, Task 1 tone |

- Shared engine: `labs/js/lab-core.js` + `css/lab-extra.css`. Lab content lives in `js/<skill>-lab.js`; edit questions there.
- PEEL is Point, Explain, Example, Link everywhere in the labs (the V3 outline alignment fix).
- Listening audio uses the device’s built-in voice (Web Speech API). It is labelled as device narration, not an exam recording; transcripts unlock after checking, with clue words highlighted. A partner can read the transcript if no voice is available.
- Missed items from every lab go into a shared queue (`smh.review.queue.v1`): due after 3 days, 7 days if missed again. `labs/review.html` (Part 7) serves it as review sets.
- Storage keys: `smh.lab.reading.v1`, `smh.lab.listening.v1`, `smh.lab.writing.v1`. Nothing is uploaded.
- Wired in: Vault gateway (4 lab cards), guide “Next” cards, Learn overview, Home lab card, eBook reader lab link (follows the open chapter), Me cards, all-lab reflection timeline and JSON export.
- Verified in Chromium at 1440, 768, 390 and 360px: all six steps of each lab without horizontal overflow, drills, question sets, transcripts, task switching, persistence after reload, reflections on Me, no JavaScript errors. Device voice playback must be tried on a real phone.


## Part 7 · Review again (18 Oct 2026)

`labs/review.html` turns the saved queue into short review sets (SRL: reflect, spaced retrieval).

- Due items, oldest first, in sets of up to 5; filter by skill. A correct answer clears the item. A wrong answer keeps it, and it returns in 7 days.
- If nothing is due, students see the next due date and can choose “Practise early”.
- Reading items show their text; Listening items play with the device voice and show the highlighted transcript after answering. Every item has an explanation.
- The end of each set shows the results and a short reflection (technique, next action, confidence). These reflections join the Me timeline.
- Single source of questions: `shared/js/item-bank.js` now holds the Reading and Listening lab content plus a review version of every drill from all four labs (27 items). The Reading and Listening labs read their content from it; edit questions there.
- The Speaking PREP Lab now also saves missed drills to the queue.
- Stats in `smh.review.stats.v1` (items cleared, sets completed, reflections) are ready for the planned Comeback badge (5 review sets).
- Linked from Vault, Home (“Review again · N due now”) and Me (progress bar = items cleared).
- Verified in Chromium at 1440, 390 and 360px: due/not-due/empty states, filter, set flow, clear and reschedule, transcripts, reflection, Me and Home counts, no overflow, no JavaScript errors.


## Part 8 · 10-minute check (18 Oct 2026)

`labs/diagnostic.html` covers the SRL “plan” stage from the V3 outline.

- Four short sets: Listening (3 items, device voice, two plays each, transcript fallback for a partner), Reading (4 items on one original text), Writing (choose the best fix for 3 sentences) and Speaking (rate yourself on 4 statements, labelled as self-rated).
- No marks are shown during the check. Results show an animated 4-skill radar, a bar for each skill, a recommended start skill (the lowest score) and answers with explanations.
- Builds a personal 3-week plan (12 steps, linked) from the score order. Week 1 learns the weakest skill, Week 2 practises the next two plus Review again, Week 3 covers the strongest skill, the Quiz Show and a retake. Steps can be ticked.
- Saved in `smh.diagnostic.v1` (scores, answers, plan, ticks, up to 5 previous results for comparison).
- Home: the route’s Diagnose step is now live; the mission card uses the recommended skill until the learner chooses another; a new “My 3-week plan” section shows progress and the next 3 steps. Welcome links to the check, and Me shows its result and plan progress (it is also included in the export).
- Results are practice estimates, never a MUET band. Vault 1/2/Mock 1 will be added to the plan when built.
- Verified in Chromium at 1440, 390 and 360px: answer guard, back/next keeps answers, scoring, radar, plan ticks, Home/Me/Welcome integration, revisit and retake, no overflow, no JavaScript errors.


## Part 9 · XP, streaks and badges (18 Oct 2026)

`shared/js/app.js` (loaded on every page) and `shared/styles/app.css` add the game layer from the V3 outline.

- XP is **worked out from the records the modules already save**, so nothing is double-counted and no XP is lost for wrong answers. Rates: Book chapter finished 30 (all 5 activity pages or all of the chapter’s PDF pages), technique drill tried 20, practice set submitted 50, reflection 10, Review set 20, 10-minute check 30, Mock component 80 (reserved). Streak bonuses: 3 days +15, 7 days +40, 14 days +100.
- Levels (provisional, change `LEVELS` in app.js after the pilot week): Starter 0 · Explorer 150 · Practitioner 400 · Band Chaser 800 · MUET Ready 1300.
- Streak: a day counts when the learner opens any Smart MUET page (`smh.app.v1.days`).
- 12 badges with derived rules (see `BADGES` in app.js). Vault 1 Clear, Vault 2 Clear and Mock Finisher are shown locked until those modules exist. Badge art: `shared/assets/badges/<id>.png` (see the README there); a built-in medal is used until the file exists.
- Home: a streak flame (grows with the streak), XP count-up, level bar and latest badges. Me: badge shelf (earned badges shine; locked ones are grey and show how to earn them), XP breakdown, 4-week streak calendar. XP and badges are in the JSON export.
- Feedback: “+XP” toasts name the reason; “Badge earned” toasts flip in; there is a level-up toast. First run starts quietly from existing records. Pause motion / reduced motion stops the animations.
- Personal progress only; no leaderboard. Badges recognise practice, never a predicted band.
- Also fixed: the Export/Reset buttons on the labs’ purple record card had white text on white.
- Verified in Chromium at 1440, 390 and 360px: XP from drills, practice sets, reflections and streaks; badge toasts; Home strip; Me shelf, XP table and calendar; no overflow; no JavaScript errors.


## Part 10 · Vault 1, Vault 2 and Mock 1 (18 Oct 2026)

The 12 V2 component pages are ported into `vault/` and keep V2’s structure, questions, audio (`vault/assets/audio`, 66 MB), Smart Coach and pilot spreadsheet connection (`js/backend-config.js`), as the outline says (“Keep”).

- Level pages: `vault/vault1.html`, `vault2.html`, `mock1.html` (hub design). Each shows a progress ring, four component cards with status and /90 practice scores, a glowing “Recommended next” tag on the next paper, and the learner’s reflections for that level.
- Vault gateway (`practice.html`): three live level cards with rings. “Recommended next” moves to the next level once the earlier one shows 4/4. All levels stay open.
- Every completed component result now ends with a **Reflect panel** (technique chips, one action, confidence 1–5) saved to `smh.vault.v1`.
- Level complete: ring fills, confetti, “+50 XP” dialog (shown once per level).
- `vault/vault-bridge.js` connects the V2 pages to the hub (reads V2 completion keys `muet_{v1|v2|mock1}_{component}`). The V2 bottom navigation is replaced by the hub’s five-button navigation, and V2 links to vault/progress/settings/guidance/hub now point to the hub pages. V2’s own mini-badge text was replaced with the hub’s XP and badges.
- XP: Vault component 50, Mock component 80, level complete 50, Vault reflections 10. Badges Vault 1 Clear, Vault 2 Clear and Mock Finisher are now live.
- The 3-week plan now moves into Vault 1 (week 2), then Vault 2 and Mock 1 (week 3) for new checks.
- Me: Vault 1/2/Mock 1 progress cards with scores; Vault reflections are in the timeline and export.
- V2 review fix: added reasoning to Vault 1 Reading Q29, Q30, Q31 and Q37.
- Mock Listening/Reading marking still comes from the pilot Apps Script, as in V2. Reminder from V2: remove `Smart-MUET-backend-pilot-Code.gs` from the public V2 repository (it contains the Mock answer keys).
- Verified in Chromium at 1440, 390 and 360px: all 12 component pages load with the hub navigation and no V2 nav, no missing files, Reflect panel save, level celebration once, recommended tag movement, XP/badge award, Me cards and timeline, no overflow on level/gateway pages, no JavaScript errors.


## Part 11 · Sticker nav icons and badge artwork (18 Oct 2026)

- Bottom navigation on every page (including the 12 Vault/Mock pages) now uses the “Sticker” icon set: `shared/js/icons.js` + `shared/css/icons.css`, loaded through `navigation.js` / `navigation.css`. Tabs: Home · Book · Learn · Vault · Me. The active tab is a tilted yellow sticky note with tape.
- The Vault tab shows a coral bubble with the number of Review again items due (with a screen-reader label).
- All 12 badge PNGs are installed in `shared/assets/badges/`; they replace the placeholder medals on Home, Me and in the “Badge earned” pop-ups (locked badges show in greyscale).
- Design sources (editable badge SVGs, icon and badge preview pages) are in `docs/design-sources/`. They are not used by the app.
- Any icon can be used inline with `<span data-icon="speaking"></span>` on a page that loads icons.js.
- Verified in Chromium at 1440 and 390px on 14 page types: icons render, the correct tab is active, the due bubble shows, no missing files, no JavaScript errors.


## Part 12 · Arcade: hand-gesture games (18 Oct 2026)

New `arcade/` (Vault tab): lobby `index.html`, **Grab & Throw** (`grab-throw.html`) and **Air Slice** (`air-slice.html`).

- **One shared engine.** `js/gesture-core.js` (SMHGesture) runs MediaPipe Hand Landmarker 0.10.14 from jsDelivr, loaded only when a student turns on camera mode. It reports pinch, point, fist and open hand. `js/arcade-core.js` (SMHArcade) gives every game the same input layer (tap/drag/keyboard or hand), camera consent and preview, HUD (round, lives, timer, score), sounds, results screen and saving.
- **Grab & Throw (pinch):** 5 rounds. Throw 4 sentences into Point / Explain / Example / Link buckets (PEEL, Writing) or Point / Reason / Example / Point again (PREP, Speaking). Drag-and-flick has aim assist; tap-then-tap and keyboard also work. Each round ends with the finished paragraph to read.
- **Air Slice (point):** 10 clues (5 Listening, 5 Reading). Slice the right option as it flies past; slicing a trap names it (changed plan, word match, too far, not mentioned, reference). With motion paused the options stay still.
- **Camera mode is optional.** Video stays on the device (nothing recorded or uploaded), a consent screen shows the first time, the tracker downloads once (~8 MB), and the camera switches off when the tab is hidden. Every game is fully playable without it.
- **Learning loop:** missed items go to Review again (`writing:/speaking:/listening:/reading:arcade-*` items in `shared/js/item-bank.js`). XP: 10 per finished round, up to 3 rounds a day (`smh.arcade.v1`, derived in app.js). Personal bests only, no leaderboard.
- Links: Vault gateway card, Home lab list, navigation registry.
- Verified in Chromium at 1366, 390 and 360px (reduced motion): full games by drag, flick, tap and keyboard; simulated hand input (pinch-grab-throw, point-slice, hand-pressed buttons); consent dialog and fallback message when the tracker cannot load; results, Review again items, XP row; no overflow, no JavaScript errors. **Real-camera tracking must be checked on a phone/laptop after publishing to GitHub Pages (https)**, because this test machine cannot download the MediaPipe model.



## Part 13 · Monster Punch: the Vault boss battle (18 Oct 2026)

- New `arcade/monster-punch.html` + `js/monster-punch.js`. Three minions carry three answers; punch the right one to take 1 HP off the boss. A wrong punch or time-up = the boss hits back (−1 life) and the answer is explained.
- One boss per level (all open, chosen on the start screen or via `?level=v1|v2|mock1`): **Jerebu, the Haze Beast** (Vault 1, 6 HP, 25 s), **Kalut, the Deadline Golem** (Vault 2, 8 HP, 20 s), **Gerhana, the Exam Dragon** (Mock 1, 10 HP, 15 s). Original SVG monster art.
- 24 quick-fire questions (6 each for Listening, Speaking, Reading, Writing) in `shared/js/item-bank.js` (`arcade.boss`), served round-robin across the four papers. Listening clues have a ▷ Hear it button (device voice).
- Input: tap, keyboard, or camera (open hand over a minion, make a fist to punch; a fist on a button presses it). The gesture engine now has a palm cursor for fist games so the cursor does not jump when the hand closes.
- Wins are saved in `smh.arcade.boss.v1`. Each Vault level page (`vault/level.js`) now shows a boss card ("Fight the boss" → "Boss defeated ✓"). Misses go to Review again; XP follows the Arcade rule (10 per round, 3 rounds a day).
- Verified in Chromium at 1366, 390 and 360px: win path with tap, keyboard and a wrong punch; simulated fist punch in camera mode; boss card status on level pages; Review again shows boss items; no overflow, no JavaScript errors.
