# Part 3 · Introduction and Speaking

Open `index.html` for the four learning folders, three-stage study routine and warm-up quiz. Open `speaking.html` for PREP, discussion phrases, a flexible timer, local notes, a feedback quiz and reflection.

## Add your own hero artwork

Edit `config.js`: set `introHero` and/or `speakingHero` to your image path (for example `../shared/assets/my-speaking-hero.webp`) or an HTTPS URL. Empty values use the bundled illustrations. A missing image falls back to the bundled art. Suggested canvas: 1200 × 900, PNG/WebP with a transparent background or light background. Keep important content near the centre. The HTML `alt` text should describe your replacement image. No external image service is required.

Headers animate on entry; artwork floats and stars rotate. Pause motion works across the modules. Operating-system reduced-motion preferences are respected. Body text is 15px, form labels/help 14px and mobile form controls 16px.

## Practice behaviour

This is a public study guide; it does not require a live account. Quizzes show explanatory feedback and a local learning score, never a MUET band prediction. Timer options are flexible practice rounds, not official exam timings. It uses elapsed wall-clock time and does not auto-advance the page. Notes and reflection use localStorage when available, with an honest fallback message. No recordings, notes or scores are sent to a server. Clearing notes removes the saved note; reflections can be replaced by saving a new next step.

Reading, Listening and Writing now each have six labelled learning sections with instructions, models, practice, explanatory feedback and reflection. These are independent learning guides with short exercises; full practice papers remain in the later Practice module. Book, practice vaults and progress dashboards remain separate later folders.


## New independent learning guides

- `reading.html`: SCAN, evidence highlighting, four-question passage exercise, explanations for all options and an evidence note.
- `listening.html`: CLUE, written contrast model, the supplied Pet Club audio and three selected questions from the existing practice, feedback and local keywords. Native audio controls work on mobile; a download backup is provided. The complete 8:40 track includes instructions/pauses/repetition.
- `writing.html`: PEEL, original full Task 1 and Task 2 models, separate saved plans/drafts, word counts, self-review checks and text downloads. Counts are approximate whitespace-separated words. Review is descriptive and self-assessed, not automated marking or band prediction.

Each page: Start here / Learn / See an example / Practise / Check & improve / Reflect. Only one section is displayed at a time. Section numbers in the guide are learning steps, separate from the exam part numbers. Learners can move freely, mark steps done and resume in the same browser. The mark-done control is a learner acknowledgement, not mastery evidence. Reset step progress keeps drafts/notes. Quiz answers are saved locally and restored; Try again clears that attempt.

Additional hero slots: `readingHero`, `listeningHero`, `writingHero` in config.js. Replace the associated HTML alt text when changing artwork.

## Content references

Exam-format facts checked against the MPM portal link to Regulations and Test Specifications (2021 onward), 17 October 2026:
https://portal.mpm.edu.my/en/muet/regulations-and-test-specifications-bi
https://portal.mpm.edu.my/images/dokumen/calon-peperiksaan/muet/regulation/Regulations_and_Test_Specifications.pdf
Reading overview: printed pp. 30–36. Listening overview: printed pp. 13–20. Writing: printed pp. 37–42. Original exercises and writing models are learning materials, not copied official examination questions. Listening audio/questions and answer explanations are reused from the supplied earlier Smart MUET app (Vault 1 source 2); the track is copied without editing.
