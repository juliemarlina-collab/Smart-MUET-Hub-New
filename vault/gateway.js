/* Smart MUET · level rings and "Recommended next" tags on the Vault gateway. */
(() => {
  "use strict";
  const V = window.SMHVault;
  if (!V) return;
  const rec = V.recommended();
  document.querySelectorAll(".level-card[data-level]").forEach((card) => {
    const st = V.status(card.dataset.level),
      top = document.createElement("div");
    top.className = "level-top";
    const label = document.createElement("b");
    label.textContent = st.done === 4 ? "Complete ✓" : st.done + " of 4 papers";
    top.append(V.ring(st.done, 84), label);
    const h = card.querySelector("h3"); h.parentNode.insertBefore(top, h);
    if (st.done === 4) card.classList.add("done");
    if (rec === card.dataset.level) {
      const tag = document.createElement("span");
      tag.className = "rec-tag";
      tag.textContent = "RECOMMENDED NEXT";
      (card.querySelector("summary") || card).prepend(tag);
      card.classList.add("recommended");
    }
  });
})();
