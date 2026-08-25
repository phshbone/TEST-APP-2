// Functional fixes from the August 13 phone review — TEST-APP-2 only.
(function(){
  const localDateString=(d=new Date())=>{
    const y=d.getFullYear();
    const m=String(d.getMonth()+1).padStart(2,'0');
    const day=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };
  const utcDateString=(d=new Date())=>d.toISOString().slice(0,10);

  try{
    const local=localDateString(), utc=utcDateString();
    if(state.reportDate===utc && utc!==local){state.reportDate=local;saveState();}
  }catch(e){}

  // Keep shell measurement here for compatibility. clean-shell.js is the final
  // shell owner and will re-measure after render.
  function anchorPrimaryNav(){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const h=Math.ceil(nav.getBoundingClientRect().height)||88;
    document.documentElement.style.setProperty('--mpw-nav-height',`${h}px`);
  }

  function rememberProcedureOrigin(){
    if(state.route!=='procedures')return;
    const card=document.querySelector('.field-procedure');
    const id=state.procedureTarget||card?.dataset.fieldProcedure;
    if(id){
      sessionStorage.setItem('mpwReturnProcedure',id);
      sessionStorage.setItem('mpwReturnProcedureScroll',String(document.getElementById('mainContent')?.scrollTop||0));
    }
  }

  function installFloatingReturn(){
    let b=document.getElementById('floatingProcedureReturn');
    const id=sessionStorage.getItem('mpwReturnProcedure');
    const shouldShow=state.route==='guide'&&!!id;
    if(!b){
      b=document.createElement('button');
      b.id='floatingProcedureReturn';
      b.className='floating-procedure-return';
      b.type='button';
      b.setAttribute('aria-label','Return to procedure');
      b.textContent='←';
      document.body.appendChild(b);
    }
    b.classList.toggle('visible',shouldShow);
    b.onclick=()=>{
      const targetId=sessionStorage.getItem('mpwReturnProcedure');
      if(!targetId)return;
      const item=fieldData.items.find(x=>x.id===targetId);
      state.route='procedures';
      if(item)state.procedureCategory=item.category;
      state.procedureTarget=targetId;
      saveState();render();
      requestAnimationFrame(()=>document.getElementById(`field-${targetId}`)?.scrollIntoView({block:'start',behavior:'auto'}));
    };
    document.querySelectorAll('.return-to-procedure').forEach(x=>x.style.display='none');
  }

  function postRender(){
    anchorPrimaryNav();
    rememberProcedureOrigin();
    installFloatingReturn();
  }

  // Guide -> Training synchronization is intentionally owned only by
  // training-navigation-fixes.js. This file previously duplicated the same
  // Standard Check-In / preload writes on every render, creating two writers
  // for the same state.
  const priorRender=render;
  render=function(){
    priorRender();
    requestAnimationFrame(postRender);
  };
  addEventListener('resize',anchorPrimaryNav,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(anchorPrimaryNav,120),{passive:true});
  requestAnimationFrame(postRender);
})();
