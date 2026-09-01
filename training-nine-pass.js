// Guide-linked Training score: 9 evaluated topics. Five additional field topics remain available but do not affect the 9/9 score.
(function(){
  const CORE_TOPICS=[
    'Opening and worker orientation',
    'Numbered station setup',
    'Activation-card preload',
    'Standard voter check-in',
    'Mail-In Ballot',
    'Voter Not Found',
    'Provisional ballots',
    'Reprint',
    'Spoil'
  ];
  const ADDITIONAL_TOPICS=['Already Voted','Early Voted','ID Required','Crowd flow','Who to call before improvising'];
  const CORE_GROUPS=[
    {title:'Opening & Readiness',topics:['Opening and worker orientation','Numbered station setup']},
    {title:'Standard Voter Check-In',topics:['Activation-card preload','Standard voter check-in']},
    {title:'Voter & Ballot Procedures',topics:['Mail-In Ballot','Voter Not Found','Provisional ballots','Reprint','Spoil']}
  ];
  const SECTION_TOPIC_MAP={
    opening:['Opening and worker orientation','Numbered station setup'],
    mailin:['Mail-In Ballot'],
    notfound:['Voter Not Found'],
    provisional:['Provisional ballots'],
    reprint:['Reprint'],
    spoil:['Spoil']
  };

  const clone=value=>{
    try{return JSON.parse(JSON.stringify(value||{}));}catch(e){return {};}
  };
  const normalizedMode=()=>state.mode==='election'?'election':'early';
  let activeMode=normalizedMode();

  // FOUNDATION v3 migration: keep the existing session in the mode the user was
  // actually viewing, then give the other mode its own clean training/checklist state.
  state.trainingByMode=state.trainingByMode||{};
  state.workersPresentByMode=state.workersPresentByMode||{};
  state.guideStateByMode=state.guideStateByMode||{};
  if(!state.trainingModeVersion){
    state.trainingByMode[activeMode]=clone(state.training||{});
    state.trainingByMode[activeMode==='early'?'election':'early']=state.trainingByMode[activeMode==='early'?'election':'early']||{};
    state.workersPresentByMode[activeMode]=state.workersPresent||'';
    state.workersPresentByMode[activeMode==='early'?'election':'early']=state.workersPresentByMode[activeMode==='early'?'election':'early']||'';
    state.guideStateByMode[activeMode]={
      lessonStatus:clone(state.lessonStatus||{}),
      procedureProgress:clone(state.procedureProgress||{}),
      guideSectionTraining:clone(state.guideSectionTraining||{})
    };
    state.guideStateByMode[activeMode==='early'?'election':'early']=state.guideStateByMode[activeMode==='early'?'election':'early']||{
      lessonStatus:{},procedureProgress:{},guideSectionTraining:{}
    };
    state.trainingModeVersion=1;
  }

  function ensureMode(mode){
    state.trainingByMode[mode]=state.trainingByMode[mode]||{};
    if(typeof state.workersPresentByMode[mode]!=='string')state.workersPresentByMode[mode]='';
    state.guideStateByMode[mode]=state.guideStateByMode[mode]||{};
    state.guideStateByMode[mode].lessonStatus=state.guideStateByMode[mode].lessonStatus||{};
    state.guideStateByMode[mode].procedureProgress=state.guideStateByMode[mode].procedureProgress||{};
    state.guideStateByMode[mode].guideSectionTraining=state.guideStateByMode[mode].guideSectionTraining||{};
  }
  function persistActiveMode(){
    ensureMode(activeMode);
    state.trainingByMode[activeMode]=state.training||{};
    state.workersPresentByMode[activeMode]=state.workersPresent||'';
    state.guideStateByMode[activeMode].lessonStatus=state.lessonStatus||{};
    state.guideStateByMode[activeMode].procedureProgress=state.procedureProgress||{};
    state.guideStateByMode[activeMode].guideSectionTraining=state.guideSectionTraining||{};
  }
  function activateMode(mode){
    ensureMode(mode);
    activeMode=mode;
    state.training=state.trainingByMode[mode];
    state.workersPresent=state.workersPresentByMode[mode];
    state.lessonStatus=state.guideStateByMode[mode].lessonStatus;
    state.procedureProgress=state.guideStateByMode[mode].procedureProgress;
    state.guideSectionTraining=state.guideStateByMode[mode].guideSectionTraining;
  }
  activateMode(activeMode);

  const upstreamSaveState=saveState;
  saveState=function(){
    persistActiveMode();
    upstreamSaveState();
  };

  function statusList(obj){
    if(!obj)return [];
    if(Array.isArray(obj.statuses))return [...new Set(obj.statuses.filter(Boolean))];
    return obj.status?[obj.status]:[];
  }
  function canonical(statuses){
    return statuses.includes('live')?'live':statuses.includes('covered')?'covered':statuses.includes('review')?'review':statuses.includes('notReached')?'notReached':'';
  }
  function idx(name){return data.trainingTopics.indexOf(name);}
  function item(name){const i=idx(name);return i>=0?(state.training[i]||{}):{};}
  function complete(name){return ['covered','live'].includes(item(name).status);}
  function countStatus(name,status){return statusList(item(name)).includes(status);}

  function setGuideDerived(topic,statuses){
    const i=idx(topic);if(i<0)return false;
    state.training[i]=state.training[i]||{};
    const o=state.training[i];
    const prior=Array.isArray(o.__guideNineStatuses)?o.__guideNineStatuses:[];
    const manual=statusList(o).filter(x=>!prior.includes(x));
    const next=[...new Set(statuses.filter(Boolean))];
    const merged=[...new Set([...manual,...next])];
    const changed=JSON.stringify(prior)!==JSON.stringify(next)||JSON.stringify(statusList(o))!==JSON.stringify(merged);
    o.__guideNineStatuses=next;
    o.statuses=merged;
    o.status=canonical(merged);
    return changed;
  }
  function procedureForMode(id){
    return (data.procedures||[]).find(p=>p.id===id&&(!p.modes||p.modes.includes(state.mode)))||(data.procedures||[]).find(p=>p.id===id);
  }
  function procedureComplete(id){
    const p=procedureForMode(id);if(!p)return false;
    const total=typeof guideStepCount==='function'?guideStepCount(p):(p.steps?.length||p.lessons?.length||0);
    const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
    return total>0&&done===total;
  }
  function lessonStatuses(procedureId,lessonId){return statusList(state.lessonStatus?.[`${procedureId}:${lessonId}`]);}
  function lessonComplete(procedureId,lessonId){
    const s=lessonStatuses(procedureId,lessonId);
    return s.includes('explained')||s.includes('live');
  }
  function mapLessonStatuses(statuses,allowComplete=true){
    const out=[];
    if(allowComplete&&statuses.includes('explained'))out.push('covered');
    if(allowComplete&&statuses.includes('live'))out.push('live');
    if(statuses.includes('review'))out.push('review');
    if(statuses.includes('notReached'))out.push('notReached');
    return out;
  }

  function reconcileGuideTraining(){
    let changed=false;
    Object.entries(SECTION_TOPIC_MAP).forEach(([id,topics])=>{
      const derived=procedureComplete(id)?['covered']:[];
      topics.forEach(topic=>{if(setGuideDerived(topic,derived))changed=true;});
    });

    const checkin=procedureForMode('checkin');
    const preloadStatuses=lessonStatuses('checkin','preload');
    if(setGuideDerived('Activation-card preload',mapLessonStatuses(preloadStatuses,true)))changed=true;

    const standardLessons=(checkin?.lessons||[]).filter(l=>l.id!=='preload');
    const standardComplete=standardLessons.length>0&&standardLessons.every(l=>lessonComplete('checkin',l.id));
    const union=new Set();
    standardLessons.forEach(l=>lessonStatuses('checkin',l.id).forEach(s=>union.add(s)));
    const standardDerived=[];
    if(standardComplete)standardDerived.push('covered');
    if(standardComplete&&union.has('live'))standardDerived.push('live');
    if(union.has('review'))standardDerived.push('review');
    if(union.has('notReached'))standardDerived.push('notReached');
    if(setGuideDerived('Standard voter check-in',standardDerived))changed=true;

    if(changed){persistActiveMode();upstreamSaveState();}
  }

  // Override the shared totals used by Home and Daily Report.
  trackerAllStats=function(){
    return {
      total:CORE_TOPICS.length,
      complete:CORE_TOPICS.filter(complete).length,
      covered:CORE_TOPICS.filter(x=>countStatus(x,'covered')).length,
      live:CORE_TOPICS.filter(x=>countStatus(x,'live')).length,
      review:CORE_TOPICS.filter(x=>countStatus(x,'review')).length,
      notReached:CORE_TOPICS.filter(x=>countStatus(x,'notReached')).length
    };
  };

  function groupMarkup(group){
    const indexes=group.topics.map(idx).filter(i=>i>=0);
    const done=indexes.filter(i=>['covered','live'].includes((state.training[i]||{}).status)).length;
    return `<section class="card tracker-section ${done===indexes.length&&indexes.length?'complete':''}"><div class="tracker-section-head"><h3>${esc(group.title)}</h3>${trackerPill(done,indexes.length)}</div><div class="tracker-topic-list">${indexes.map(trackerTopicCard).join('')}</div></section>`;
  }

  renderTraining=function(){
    title.textContent='Training Tracker';
    const totals=trackerAllStats();
    const pct=totals.total?Math.round((totals.complete/totals.total)*100):0;
    const additionalIndexes=ADDITIONAL_TOPICS.map(idx).filter(i=>i>=0);
    return `${pageHeading('Training Tracker',`${modeLabel()} • Guide-linked training is scored separately from additional field topics.`)}
      <section class="card tracker-overview">
        <div class="tracker-overview-head"><div><p class="section-label">Guide-linked training</p><h3>${totals.complete} of ${totals.total} topics complete</h3></div>${trackerPill(totals.complete,totals.total)}</div>
        <div class="tracker-progress"><span style="width:${pct}%"></span></div>
        <div class="tracker-summary-line"><span>${pct}% complete</span><span>${totals.review} need review</span><span>${totals.notReached} not reached</span></div>
      </section>
      <section class="card tracker-workers"><label><strong>Workers present</strong></label><input id="workersPresent" class="search-box" value="${esc(state.workersPresent)}" placeholder="Names or count"></section>
      ${CORE_GROUPS.map(groupMarkup).join('')}
      <section class="card tracker-section additional-training-section"><div class="tracker-section-head"><div><p class="section-label">Additional training / field topics</p><h3>Not included in the 9-topic score</h3></div></div><div class="tracker-topic-list">${additionalIndexes.map(trackerTopicCard).join('')}</div></section>`;
  };

  const upstreamRender=render;
  render=function(){
    const nextMode=normalizedMode();
    if(nextMode!==activeMode){
      persistActiveMode();
      activateMode(nextMode);
    }
    reconcileGuideTraining();
    upstreamRender();
  };

  // Re-render once so the current mode is reconciled immediately.
  render();
})();
