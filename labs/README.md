# Part 5–6 · Skill labs

Four guided labs: `listening-lab.html` (CLUE), `speaking-lab.html` (PREP), `reading-lab.html` (SCAN) and `writing-lab.html` (PEEL). The Reading, Listening and Writing labs share `js/lab-core.js` and `css/lab-extra.css`; their content is in `js/reading-lab.js`, `js/listening-lab.js` and `js/writing-lab.js`. See the root README (Part 6) for details. The Speaking section below is unchanged.

## Speaking PREP Lab

Open `speaking-lab.html`. This is the first component lab within Learn, aligned with the supplied V3 outline. Other component labs, Vaults and Mock remain next build stages; no dead Vault link is shown.

## Learning sequence

1. Start here: choose a goal and read the task.
2. I do: explore four CSS 3D PREP blocks and an explained complete model. Optional device voice has a written alternative.
3. We do: three guided drills — assemble PREP with tap/keyboard or drag, select a supporting example and choose a connecting phrase. Immediate explanations and retry.
4. You do: three fresh topics, separate keyword plans, hideable hints and flexible preparation/speaking timers. Optional recording and replay; no automatic speech assessment.
5. Check & improve: five self-review prompts, specific improvement and second-attempt comparison.
6. Reflect & next: technique, next action, confidence, reflection timeline and text export. Links return to the guide and PDF chapter.

PREP means Point, Reason, Example, Point again. Examples are illustrative, not official band-rated models. This lab practises an individual response and includes a partner discussion prompt, but does not simulate a live group discussion or full test.

## Technology and privacy

Vanilla HTML/CSS/JS; CSS perspective gives the blocks depth without WebGL, camera or external services. 2D view, pause motion, OS reduced motion, keyboard/tap alternatives and local fonts. Motion is short and does not animate reading text.

State uses `smh.lab.speaking.v1` in localStorage. Notes and plans save as typed. Completed checks and reflections persist; the in-progress card arrangement does not. Timers use elapsed wall time, allow pause/reset and pause when leaving the speaking step. Timer presets are practice aids.

Recording uses MediaRecorder after an explicit request. HTTPS or localhost and microphone permission are required. Denial or unavailable recording leaves spoken practice and self-review usable. The latest recording is stored as a Blob in IndexedDB database `smh-speaking-lab`; a new saved recording replaces it. Download before replacing to compare files. Delete and lab reset remove the stored recording; playback object URLs and media tracks are released. Audio is never uploaded and no spreadsheet sync is implemented in this lab. Recording stops on leaving the speaking step; export audio separately from the text record. Temporary/private contexts may restrict persistence.

No XP, global badges or Vault completion are fabricated. Lab records are ready for later shared-engine integration. Student confidence and checklist ticks are self-report, not predicted MUET bands.

## Verification

Chromium at 1440, 768, 390 and 360px: all six steps fit without horizontal document overflow. Checked card assembly, wrong/correct feedback and retry, per-topic plan persistence, timer pause/reset, local audio capture with a simulated microphone, IndexedDB reload and deletion, reflection deduplication and text download, 2D mode, reduced motion and combined preview navigation to the PDF reader. No JavaScript errors or failed asset requests. Actual microphone hardware and browser/device support require user permission and may vary.
