/* Smart MUET Arcade · lobby: today's XP rounds and personal bests. */
(() => {
  "use strict";
  const A = window.SMHArcade;
  A.motionButton(document.getElementById("motion"));
  const v = A.load(),
    left = Math.max(0, A.DAILY_XP_ROUNDS - A.roundsToday());
  document.getElementById("xp-left").textContent = left;
  document.querySelectorAll("[data-best]").forEach((p) => {
    const g = p.dataset.best,
      n = v.rounds.filter((r) => r.game === g).length;
    if (v.best[g] !== undefined) p.textContent = "Personal best: " + v.best[g] + " · played " + n + "×";
  });
})();
