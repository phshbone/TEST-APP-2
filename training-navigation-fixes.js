// Full Guide-to-Training synchronization and internal Procedure return navigation — TEST-APP-2 only.
// FOUNDATION v3: this is the single local owner of the global render lifecycle.
(function(){
  const COMPLETE_STATUSES=new Set(['covered','live']);

  function statusList(obj){
    if(!obj)return [];
    if(Array.isArray(obj.statuses))return [...new Set(obj.statuses.filter(Boolean))];
    return obj.status?[obj.status]:[];
  }
  function setCanonical(obj){
    const s=statusList(obj); obj.statuses=s;
    obj.status=s.includes('live')?'live':s.includes('covered')?'covered':s.includes('review')?'review':s.includes('notReached')?'notReached':'';
  }
  function topicIndex(name){return data.trainingTopics.indexOf(name);}
  function mergeCovered(topic,shouldCover){
    const i=topicIndex(topic); if(i<0)return;
    state.training[i]||={};
    const s=statusList(state.training[i]);
    const marker='__guideCovered';
    if(shouldCover){
      if(!s.includes('covered')&&!s.includes('live'))s.push('covered');
      state.training[i][marker]=true;
    }else if(state.training[i][marker]){
      const idx=s.indexOf('covered'); if(idx>=0)s.splice(idx,1);
      delete state.training[i][marker];
    }
    state.training[i].statuses=s; setCanonical(state.training[i]);
  }
  function guideProcedureComplete(id){
    const p=data.procedures.find(x=>x.id===id); if(!p)return false;
    const total=typeof guideStepCount==='function'?guideStepCount(p):(p.steps?.length||p.lessons?.length||0);
    const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
    return total>0&&done===total;
  }
  function lessonUnion(id){
    const p=data.procedures.find(x=>x.id===id); const u=new Set();
    (p?.lessons||[]).forEach(l=>statusList(state.lessonStatus?.[`${id}:${l.id}`]).forEach(s=>u.add(s)));
    return u;
  }
  function mergeDetailedTopic(topic,statuses){
    const i=topicIndex(topic); if(i<0)return;
    state.training[i]||={};
    const existing=statusList(state.training[i]).filter(x=>!state.training[i].__guideStatuses?.includes(x));
    const merged=[...new Set([...existing,...statuses])];
    state.training[i].__guideStatuses=[...statuses];
    state.training[i].statuses=merged; setCanonical(state.training[i]);
  }

  function syncAllGuideTraining(){
    if(!window.state||!window.data)return;

    const sectionMap={
      opening:['Opening and worker orientation','Numbered station setup'],
      mailin:['Mail-In Ballot'],
      notfound:['Voter Not Found'],
      provisional:['Provisional ballots'],
      reprint:['Reprint'],
      spoil:['Spoil']
    };
    Object.entries(sectionMap).forEach(([id,topics])=>{
      const complete=guideProcedureComplete(id);
      topics.forEach(topic=>mergeCovered(topic,complete));
    });

    const all=lessonUnion('checkin');
    const mapped=[];
    if(all.has('explained'))mapped.push('covered');
    if(all.has('live'))mapped.push('live');
    if(all.has('review'))mapped.push('review');
    if(all.has('notReached'))mapped.push('notReached');
    mergeDetailedTopic('Standard voter check-in',mapped);

    const preload=new Set(statusList(state.lessonStatus?.['checkin:preload']));
    const preloadMapped=[];
    if(preload.has('explained'))preloadMapped.push('covered');
    if(preload.has('live'))preloadMapped.push('live');
    if(preload.has('review'))preloadMapped.push('review');
    if(preload.has('notReached'))preloadMapped.push('notReached');
    mergeDetailedTopic('Activation-card preload',preloadMapped);

    saveState();
  }

  try{
    const changed=fieldData.items.find(x=>x.id==='record-changed-residence');
    if(changed?.procedureLinks) changed.procedureLinks=changed.procedureLinks.filter(x=>x.id!=='record-correction');
  }catch(e){}

  const ORIGIN_KEY='mpwProcedureInternalOrigin';
  const EXTERNAL_ORIGIN_KEY='mpwProcedureExternalOrigin';

  function linkDescriptor(button){
    if(button.hasAttribute('data-procedure-jump'))return {type:'procedure-jump',target:button.dataset.procedureJump};
    if(button.hasAttribute('data-open-guide'))return {type:'open-guide',target:button.dataset.openGuide};
    if(button.hasAttribute('data-open-shared'))return {type:'open-shared',target:button.dataset.openShared};
    return null;
  }
  function rememberOrigin(button,key){
    const source=button.closest('.field-procedure');
    const sourceId=source?.dataset.fieldProcedure;
    const link=linkDescriptor(button);
    if(!sourceId||!link)return;
    sessionStorage.setItem(key,JSON.stringify({
      id:sourceId,
      category:state.procedureCategory||'',
      scrollTop:main?.scrollTop||0,
      linkType:link.type,
      linkTarget:link.target||'',
      viewportTop:button.getBoundingClientRect().top
    }));
  }
  function originData(key=ORIGIN_KEY){
    try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch(e){return null;}
  }
  function findOriginElement(o){
    const card=document.getElementById(`field-${o.id}`);
    if(!card)return null;
    let attr='';
    if(o.linkType==='procedure-jump')attr='data-procedure-jump';
    if(o.linkType==='open-guide')attr='data-open-guide';
    if(o.linkType==='open-shared')attr='data-open-shared';
    if(attr){
      const buttons=[...card.querySelectorAll(`[${attr}]`)];
      const match=buttons.find(x=>(x.getAttribute(attr)||'')===(o.linkTarget||''));
      if(match)return match;
    }
    return card.querySelector('.cross-links')||card;
  }
  function restoreOriginPosition(o){
    requestAnimationFrame(()=>{
      const target=findOriginElement(o);
      if(target&&Number.isFinite(o.viewportTop)){
        const delta=target.getBoundingClientRect().top-o.viewportTop;
        if(Math.abs(delta)>1)main.scrollTop+=delta;
      }else if(target){
        target.scrollIntoView({block:'center',behavior:'auto'});
      }else{
        main.scrollTop=o.scrollTop||0;
      }
    });
  }

  function installInternalReturn(){
    let b=document.getElementById('floatingInternalProcedureReturn');
    const origin=originData();
    const current=state.procedureTarget||document.querySelector('.field-procedure')?.dataset.fieldProcedure;
    const show=state.route==='procedures'&&origin?.id&&current&&origin.id!==current;
    if(!b){
      b=document.createElement('button');
      b.id='floatingInternalProcedureReturn';
      b.className='floating-internal-procedure-return';
      b.type='button';
      b.textContent='←';
      b.setAttribute('aria-label','Return to previous procedure');
      document.body.appendChild(b);
    }
    b.classList.toggle('visible',!!show);
    b.onclick=()=>{
      const o=originData(); if(!o)return;
      const item=fieldData.items.find(x=>x.id===o.id);
      state.route='procedures';
      state.procedureCategory=item?.category||o.category||state.procedureCategory;
      state.procedureTarget=o.id;
      sessionStorage.removeItem(ORIGIN_KEY);
      saveState(); render();
      restoreOriginPosition(o);
    };

    // functional-fixes.js owns creation of the Procedure -> Guide return arrow.
    // Once it exists, enhance only its return target so a deep link near Source/
    // related links comes back to the exact originating control, not card top.
    const external=document.getElementById('floatingProcedureReturn');
    const externalOrigin=originData(EXTERNAL_ORIGIN_KEY);
    if(external&&externalOrigin&&state.route==='guide'){
      external.onclick=()=>{
        const o=originData(EXTERNAL_ORIGIN_KEY); if(!o)return;
        const item=fieldData.items.find(x=>x.id===o.id);
        state.route='procedures';
        state.procedureCategory=item?.category||o.category||state.procedureCategory;
        state.procedureTarget=o.id;
        sessionStorage.removeItem(EXTERNAL_ORIGIN_KEY);
        sessionStorage.removeItem('mpwReturnProcedure');
        sessionStorage.removeItem('mpwReturnProcedureScroll');
        saveState(); render();
        restoreOriginPosition(o);
      };
    }

    const top=document.getElementById('floatingTopButton');
    if(top)top.classList.toggle('suppressed-by-return',!!show||external?.classList.contains('visible'));
  }

  document.addEventListener('click',e=>{
    const internal=e.target.closest('[data-procedure-jump]');
    if(internal)rememberOrigin(internal,ORIGIN_KEY);
    const external=e.target.closest('[data-open-guide],[data-open-shared]');
    if(external)rememberOrigin(external,EXTERNAL_ORIGIN_KEY);
    if(e.target.closest('[data-check],[data-action-check],[data-lesson-status]')) setTimeout(()=>{syncAllGuideTraining();refreshTrainingIfVisible();},0);
  },true);

  function refreshTrainingIfVisible(){
    if(state.route!=='training'&&state.route!=='home'&&state.route!=='report')return;
    render();
  }

  const previousRender=render;
  render=function(){
    syncAllGuideTraining();
    previousRender();
    requestAnimationFrame(()=>{
      installInternalReturn();
      const external=document.getElementById('floatingProcedureReturn');
      const top=document.getElementById('floatingTopButton');
      if(top)top.classList.toggle('suppressed-by-return',external?.classList.contains('visible')||document.getElementById('floatingInternalProcedureReturn')?.classList.contains('visible'));
      document.dispatchEvent(new CustomEvent('mpw:rendered',{detail:{route:state.route}}));
    });
  };

  syncAllGuideTraining();
  requestAnimationFrame(()=>{
    installInternalReturn();
    document.dispatchEvent(new CustomEvent('mpw:rendered',{detail:{route:state.route}}));
  });
})();
