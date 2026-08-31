// Render Election Day opening callouts without depending on app.js lexical globals.
(function(){
  function decorate(){
    const cards=[...document.querySelectorAll('[data-procedure="opening"]')];
    const card=cards.find(el=>el.querySelector('.procedure-heading h3')?.textContent.trim()==='Election Day Opening');
    if(!card || card.dataset.electionOpeningDecorated==='fixed') return;
    card.dataset.electionOpeningDecorated='fixed';
    const heading=card.querySelector('.procedure-heading');
    if(!heading) return;

    if(!card.querySelector('.election-manual-callout')){
      const manual=document.createElement('div');
      manual.className='election-manual-callout';
      manual.innerHTML='<strong>KEEP THE MANUALS AT THE TABLE</strong><span>Use the Morris County Poll Worker Manual and the New Jersey State manual whenever a procedure, flag, remedy, or setup step is unclear.</span>';
      heading.insertAdjacentElement('afterend',manual);
    }

    if(!card.querySelector('.election-power-warning')){
      const manual=card.querySelector('.election-manual-callout');
      const power=document.createElement('div');
      power.className='warning-box election-power-warning';
      power.innerHTML='<strong>DO NOT plug a voting machine into the yellow extension reel or an ePollbook power strip.</strong><span>Voting machines must use a working wall outlet.</span>';
      manual.insertAdjacentElement('afterend',power);
    }
  }

  const root=document.getElementById('mainContent');
  if(root){
    new MutationObserver(decorate).observe(root,{childList:true,subtree:true});
    decorate();
  }
})();
