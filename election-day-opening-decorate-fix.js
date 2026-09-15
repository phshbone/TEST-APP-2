// Render Election Day opening callouts without depending on app.js lexical globals.
(function(){
  function decorate(){
    const cards=[...document.querySelectorAll('[data-procedure="opening"]')];
    const card=cards.find(el=>(el.textContent||'').includes('Election Day Opening'));
    if(!card || card.dataset.electionOpeningDecorated==='fixed3') return;

    if(!card.querySelector('.election-manual-callout')){
      const manual=document.createElement('div');
      manual.className='election-manual-callout';
      manual.innerHTML='<strong class="election-manual-heading"><span aria-hidden="true">★</span><span>KEEP THE MANUALS AT THE TABLE</span><span aria-hidden="true">★</span></strong><span>Use the Morris County Poll Worker manuals and the New Jersey State manual whenever a procedure, flag, remedy, or setup step is unclear.</span>';
      card.insertAdjacentElement('afterbegin',manual);
    }else{
      const heading=card.querySelector('.election-manual-callout strong');
      if(heading){
        heading.classList.add('election-manual-heading');
        heading.innerHTML='<span aria-hidden="true">★</span><span>KEEP THE MANUALS AT THE TABLE</span><span aria-hidden="true">★</span>';
      }
      const body=card.querySelector('.election-manual-callout > span');
      if(body) body.textContent='Use the Morris County Poll Worker manuals and the New Jersey State manual whenever a procedure, flag, remedy, or setup step is unclear.';
    }

    if(!card.querySelector('.election-power-warning')){
      const manual=card.querySelector('.election-manual-callout');
      const power=document.createElement('div');
      power.className='warning-box election-power-warning';
      power.innerHTML='<strong>DO NOT plug a voting machine into the yellow extension reel or an ePollbook power strip.</strong><span>Voting machines must use a working wall outlet.</span>';
      manual.insertAdjacentElement('afterend',power);
    }

    const configureLead=card.querySelector('[data-lesson-card="opening:epb-configure"] .lesson-title-wrap small');
    if(configureLead){
      configureLead.textContent=configureLead.textContent.replace('energize one station','power up one station');
    }

    card.dataset.electionOpeningDecorated='fixed3';
  }

  const root=document.getElementById('mainContent');
  if(root){
    new MutationObserver(decorate).observe(root,{childList:true,subtree:true});
    decorate();
  }
})();
