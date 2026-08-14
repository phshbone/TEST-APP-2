// Structural-shell helpers only: no viewport sizing and no fixed-nav positioning.
(function(){
  const main=document.getElementById('mainContent');

  function measureNav(){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const h=Math.ceil(nav.getBoundingClientRect().height)||82;
    document.documentElement.style.setProperty('--clean-nav-height',`${h}px`);
    document.documentElement.style.setProperty('--mpw-nav-height',`${h}px`);
  }

  function formatCriticalWarnings(){
    document.querySelectorAll('.warning-box,.procedure-critical').forEach(box=>{
      if(box.dataset.criticalFormatted==='1')return;
      const text=(box.textContent||'').trim();
      if(!text.startsWith('★'))return;
      const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
      if(!lines.length)return;
      let head=lines.shift();
      let body=lines.join(' ');
      if(lines[0]==='★'){
        head=`${head} ★`;
        lines.shift();
        body=lines.join(' ');
      }
      const secondStar=head.indexOf('★',1);
      if(secondStar>0){
        const remainder=head.slice(secondStar+1).trim();
        head=head.slice(0,secondStar+1).trim();
        if(remainder)body=`${remainder} ${body}`.trim();
      }
      box.innerHTML=`<span class="critical-command">${esc(head)}</span>${body?`<span class="critical-explanation">${esc(body)}</span>`:''}`;
      box.dataset.criticalFormatted='1';
    });
  }

  function removeDuplicateWarnings(){
    document.querySelectorAll('.field-procedure').forEach(card=>{
      const seen=new Set();
      card.querySelectorAll('.warning-box,.procedure-critical').forEach(box=>{
        const key=(box.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
        if(!key)return;
        if(seen.has(key))box.remove();
        else seen.add(key);
      });
    });
  }

  function removeObsoleteSwipeHint(){
    if(!main||state.route!=='procedures')return;
    const matches=[];
    main.querySelectorAll('*').forEach(el=>{
      const text=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(text.length>160)return;
      if(/swipe\s+(left|right)/i.test(text)&&/back|return|go/i.test(text))matches.push(el);
    });
    matches.forEach(el=>{
      if(!el.isConnected)return;
      const childMatch=[...el.children].some(child=>{
        const t=(child.textContent||'').replace(/\s+/g,' ').trim();
        return t.length<=160&&/swipe\s+(left|right)/i.test(t)&&/back|return|go/i.test(t);
      });
      if(!childMatch)el.remove();
    });
  }

  // The Procedures landing/category view has no previous page to return to.
  // Remove its orphan Back control so the real Procedures content moves up naturally.
  function removeOrphanProcedureBack(){
    if(!main||state.route!=='procedures')return;
    const hasTarget=!!state.procedureTarget;
    const hasHistory=Array.isArray(state.procedureHistory)&&state.procedureHistory.length>0;
    if(hasTarget||hasHistory)return;

    const candidates=main.querySelectorAll('button,a,[role="button"]');
    candidates.forEach(el=>{
      const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      const aria=(el.getAttribute('aria-label')||'').trim().toLowerCase();
      const cls=String(el.className||'').toLowerCase();
      const dataBack=el.hasAttribute('data-procedure-back')||el.hasAttribute('data-back');
      const looksLikeBack=dataBack||/procedure.*back|back.*procedure/.test(cls)||text==='back'||text==='← back'||text==='back to procedures'||text==='back to procedure categories'||text==='back to categories'||aria==='back';
      if(!looksLikeBack)return;
      const parent=el.parentElement;
      el.remove();
      if(parent&&parent!==main&&!parent.children.length&&!(parent.textContent||'').trim())parent.remove();
    });
  }

  function classifyBadges(){
    document.querySelectorAll('.badge').forEach(b=>{
      b.classList.remove('badge-official','badge-morris','badge-same','badge-early','badge-election','badge-critical','badge-master');
      const t=(b.textContent||'').trim().toLowerCase();
      if(t.includes('official'))b.classList.add('badge-official');
      else if(t.includes('morris'))b.classList.add('badge-morris');
      else if(t.includes('same for both'))b.classList.add('badge-same');
      else if(t.includes('early voting')&&!t.includes('election day'))b.classList.add('badge-early');
      else if(t.includes('election day')&&!t.includes('early voting'))b.classList.add('badge-election');
      else if(t.includes('critical'))b.classList.add('badge-critical');
      else if(t.includes('master worker'))b.classList.add('badge-master');
    });
    document.querySelectorAll('.home-status-head .tracker-pill').forEach(p=>{
      p.classList.remove('mode-early','mode-election');
      const t=(p.textContent||'').trim().toLowerCase();
      if(t.includes('early'))p.classList.add('mode-early');
      if(t.includes('election'))p.classList.add('mode-election');
    });
  }

  function wireTopButton(){
    const b=document.getElementById('floatingTopButton');
    if(!b||!main)return;
    b.onclick=()=>main.scrollTo({top:0,behavior:'smooth'});
    const sync=()=>b.classList.toggle('visible',main.scrollTop>500);
    if(window.__mpwMainScrollSync)main.removeEventListener('scroll',window.__mpwMainScrollSync);
    window.__mpwMainScrollSync=sync;
    main.addEventListener('scroll',sync,{passive:true});
    sync();
  }

  document.addEventListener('click',e=>{
    const lessonButton=e.target.closest('[data-open-lesson]');
    if(lessonButton&&main){
      const key=lessonButton.dataset.openLesson;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const card=document.querySelector(`[data-lesson-card="${CSS.escape(key)}"]`);
        if(!card)return;
        const delta=card.getBoundingClientRect().top-main.getBoundingClientRect().top;
        main.scrollTop+=delta-8;
      }));
    }

    const navGuide=e.target.closest('.bottom-nav [data-route="guide"]');
    if(navGuide){
      sessionStorage.removeItem('mpwReturnProcedure');
      sessionStorage.removeItem('mpwReturnProcedureScroll');
      sessionStorage.removeItem('mpwProcedureInternalOrigin');
      document.getElementById('floatingProcedureReturn')?.classList.remove('visible');
      document.getElementById('floatingInternalProcedureReturn')?.classList.remove('visible');
      document.getElementById('floatingTopButton')?.classList.remove('suppressed-by-return');
    }
  },true);

  function post(){
    measureNav();
    removeDuplicateWarnings();
    removeObsoleteSwipeHint();
    removeOrphanProcedureBack();
    formatCriticalWarnings();
    classifyBadges();
    wireTopButton();
  }

  const schedule=()=>requestAnimationFrame(post);
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(post,100),{passive:true});
  if(window.ResizeObserver){
    const ro=new ResizeObserver(schedule);
    const nav=document.querySelector('.bottom-nav');
    if(nav)ro.observe(nav);
  }
  const prior=window.render;
  if(typeof prior==='function')window.render=function(){prior();requestAnimationFrame(post);};
  post();
})();
