/* Smart MUET Hub · Practice page: status for the 10-minute check and Review again. Device records only. */
(() => {
  'use strict';
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
  const diag = get('smh.diagnostic.v1', null);
  const sub = document.getElementById('pc-check-sub');
  if (diag && diag.plan && sub) {
    const s = diag.start ? diag.start[0].toUpperCase() + diag.start.slice(1) : '';
    sub.textContent = 'Done' + (s ? '. Start with ' + s + '.' : '.') + ' Retake it after Vault 2 to see how far you have come.';
    document.querySelector('#pc-check .pg-card-go').textContent = 'See my plan →';
    document.getElementById('pc-check').href = 'labs/diagnostic.html#plan';
  }
  const q = get('smh.review.queue.v1', []);
  const due = Array.isArray(q) ? q.filter(x => x && typeof x.id === 'string' && !(Date.parse(x.due) > Date.now())).length : 0;
  const all = Array.isArray(q) ? q.length : 0;
  const rs = document.getElementById('pc-review-sub'), go = document.getElementById('pc-review-go');
  if (rs && all) rs.textContent = due ? due + ' question' + (due > 1 ? 's are' : ' is') + ' due now. ' + all + ' saved in total.' : 'Nothing due today. ' + all + ' saved for later.';
  if (go && due) go.textContent = 'Clear ' + due + ' now →';
})();
