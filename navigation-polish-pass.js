// Contextual Home return, reliable scroll-to-top controls, and Guide accordion fallback.
(function(){
  const main=document.getElementById('mainContent');
  const HOME_ORIGIN_KEY='mpwHomeCardOrigin';

  function ensureTopButton(){
    let b=document.getElementById('floatingTopButton');
    if(!b){
      b=document.createElement('button');
      b.id='floatingTopButton';
      b.className='floating-top-button';
      b.type='button';
      b.textContent='↑';
      b.setAttribute('aria-label','Back to top');
      b.setAttribute('title','Back to top');
      document.body.appendChild(b);
    }
    if(main){
      b.onclick=()=>main.scrollTo({top:0,behavior:'smooth'});
      const sync=()=>b.classList.toggle('visible',main.scrollTop>360);
      if(window.__mpwNavPolishTopSync)main.removeEventListener('scroll',window.__mpwNavPolishTopSync);
      window.__mpwNavPolishTopSync=sync;
      main.addEventListener('scroll',sync,{passive:true});
      sync();
    }
  }

  function ensureHomeReturn(){
    if(!main)return;
    main.querySelectorAll('[data-home-return-context]').forEach(x=>x.remove());
    if(state.route==='home'||sessionStorage.getItem(HOME_ORIGIN_KEY)!=='1')return;
    const wrap=document.createElement('div');
    wrap.className='context-home-return';
    wrap.setAttribute('data-home-return-context','');
    wrap.innerHTML='<button type="button" data-home-return>← Home</button>';
    main.prepend(wrap);
    wrap.querySelector('[data-home-return]').onclick=()=>{
      sessionStorage.removeItem(HOME_ORIGIN_KEY);
      state.route='home';
      saveState();
      render();
      if(main)main.scrollTop=0;
    };
  }

  function syncGuideCard(card,on){
    if(!card)return;
    card.classList.toggle('expanded',on);
    card.querySelectorAll('.guide-section-toggle,.procedure-toggle').forEach(toggle=>{
      toggle.setAttribute('aria-expanded',String(on));
      const hint=toggle.querySelector('.open-hint');
      if(hint)hint.textContent=`Tap to ${on?'close':'open'}`;
    });
  }

  function alignGuideCard(card){
    if(!main||!card)return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(!card.isConnected)return;
      const delta=card.getBoundingClientRect().top-main.getBoundingClientRect().top;
      main.scrollTop+=delta-8;
    }));
  }

  function post(){
    ensureTopButton();
    ensureHomeReturn();
  }

  document.addEventListener('click',e=>{
    const homeTile=e.target.closest('.home-dashboard-tile[data-go]');
    if(homeTile)sessionStorage.setItem(HOME_ORIGIN_KEY,'1');

    const primaryNav=e.target.closest('.bottom-nav [data-route]');
    if(primaryNav)sessionStorage.removeItem(HOME_ORIGIN_KEY);

    // Some later Guide presentation layers expose .guide-section-toggle instead
    // of the base .procedure-toggle. Keep the same one-card-open behavior and
    // top anchoring without forcing a full render.
    const guideToggle=e.target.closest('.guide-section-toggle');
    if(guideToggle&&state.route==='guide'&&main&&!guideToggle.classList.contains('procedure-toggle')){
      e.preventDefault();
      e.stopImmediatePropagation();
      const card=guideToggle.closest('.procedure-card');
      const wasOpen=!!card?.classList.contains('expanded');
      main.querySelectorAll('.procedure-card.expanded').forEach(open=>syncGuideCard(open,false));
      if(card&&!wasOpen){
        syncGuideCard(card,true);
        alignGuideCard(card);
      }
      return;
    }
  },true);

  document.addEventListener('mpw:rendered',()=>requestAnimationFrame(post));
  addEventListener('resize',()=>requestAnimationFrame(post),{passive:true});
  post();
})();
