/* Targeted interactive check for Step 02 worked example. */
document.addEventListener('DOMContentLoaded', () => {
  const group=document.getElementById('model-answer-options');
  const check=document.getElementById('check-model-answer');
  const retry=document.getElementById('retry-model-answer');
  const feedback=document.getElementById('model-answer-feedback');
  const explanation=document.getElementById('model-answer-explanation');
  if(!group||!check||!retry||!feedback||!explanation)return;
  const show=(message,kind)=>{feedback.textContent=message;feedback.className='model-answer-feedback is-'+kind;};
  const clearMarks=()=>group.querySelectorAll('label').forEach(label=>label.classList.remove('is-correct','is-incorrect'));
  check.addEventListener('click',()=>{
    const selected=group.querySelector('input[name="model-answer"]:checked');
    if(!selected){show('Choose A, B or C first, then check your answer.','info');return;}
    clearMarks();
    const label=selected.closest('label');
    if(selected.value==='C'){
      label.classList.add('is-correct');
      show('✓ Excellent! That’s correct. Thursday afternoon is the final agreed time.','success');
      explanation.hidden=false;
      check.hidden=true;retry.hidden=false;
    }else{
      label.classList.add('is-incorrect');
      show(selected.value==='A'?'Not quite. Listen for “but”: the Tuesday plan changes. Try again!':'Not quite. Hana says Wednesday is no good for her. Listen for the final agreement and try again!','retry');
      explanation.hidden=true;
      retry.hidden=false;
    }
  });
  retry.addEventListener('click',()=>{
    group.querySelectorAll('input').forEach(input=>input.checked=false);
    clearMarks();feedback.textContent='';feedback.className='model-answer-feedback';
    explanation.hidden=true;check.hidden=false;retry.hidden=true;
    group.querySelector('input')?.focus();
  });
});
