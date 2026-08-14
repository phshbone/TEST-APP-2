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

  // Legacy fixed-nav logic intentionally disabled. The structural shell now owns navigation.
  function anchorPrimaryNav(){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const h=Math.ceil(nav.getBoundingClientRect().height)||88;
    document.documentElement.style.setProperty('--mpw-nav-height',`${h}px`);
  }

  function lessonStatuses(key){
    const obj=state.lessonStatus?.[key]||{};
    return Array.isArray(obj.statuses)?obj.statuses:(obj.status?[obj.status]:[]);
  }
  function setTrainingStatuses(topic,statuses){
    const i=data.trainingTopics.indexOf(topic); if(i<0)return;
    state.training[i]||={};
    const unique=[...new Set(statuses)];
    state.training[i].statuses=unique;
    state.training[i].status=unique.includes('live')?'live':unique.includes('covered')?'covered':unique.includes('review')?'review':unique.includes('notReached')?'notReached':'';
  }
  function syncGuideTraining(){
    const p=data.procedures.find(x=>x.id==='checkin');
    if(!p?.lessons)return;
    const all=new Set();
    p.lessons.forEach(l=>lessonStatuses(`checkin:${l.id}`).forEach(s=>all.add(s)));
    const mapped=[];
    if(all.has('explained'))mapped.push('covered');
    if(all.has('live'))mapped.push('live');
    if(all.has('review'))mapped.push('review');
    if(all.has('notReached'))mapped.push('notReached');
    setTrainingStatuses('Standard voter check-in',mapped);

    const preload=new Set(lessonStatuses('checkin:preload'));
    const preloadMapped=[];
    if(preload.has('explained'))preloadMapped.push('covered');
    if(preload.has('live'))preloadMapped.push('live');
    if(preload.has('review'))preloadMapped.push('review');
    if(preload.has('notReached'))preloadMapped.push('notReached');
    setTrainingStatuses('Activation-card preload',preloadMapped);
    saveState();
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
    syncGuideTraining();
    rememberProcedureOrigin();
    installFloatingReturn();
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-lesson-status]');
    if(b)setTimeout(syncGuideTraining,0);
  },true);

  const priorRender=render;
  render=function(){
    priorRender();
    requestAnimationFrame(postRender);
  };
  addEventListener('resize',anchorPrimaryNav,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(anchorPrimaryNav,120),{passive:true});
  requestAnimationFrame(postRender);
})();
