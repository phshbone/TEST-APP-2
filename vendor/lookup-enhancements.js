// Reconciliation lookup layer: keep Guide, Procedures, and hidden Master/Tech Reference autonomous.
// Morris tech topics remain indexed here for the future PIN-protected Master view, but are intentionally omitted from normal Lookup.
const MASTER_TECH_REFERENCES = [
  {id:'tech-epson',title:'Epson Printer — Green Printer Icon',pages:'3',terms:'epson printer yellow icon green printer icon find printer accessory save boe touchpad device number',summary:'Reconnect the Epson printer to the matching Touchpad. Never select a different numbered printer.'},
  {id:'tech-expressvote',title:'ExpressVote Printer — Reconnect',pages:'4–5',terms:'expressvote printer activation card reconnect select printer find printer save rename printer',summary:'Reconnect the ExpressVote printer, verify the matching device number, save the connection, and escalate if it still fails.'},
  {id:'tech-printer-reset',title:'Printer Pairing / iPad Reset',pages:'6',terms:'printer pairing wrong device forget device hard reset ipad close epollbook app restart station',summary:'Additional printer-pairing recovery steps, including forgetting an Epson device, restarting the iPad/app, and restarting stations one at a time.'},
  {id:'tech-sideways',title:'Sideways Communication / Location Services',pages:'7–8',terms:'sideways communication central communication location services always epb privacy settings',summary:'Verify EPB location access is set to Always in both the app settings and Privacy / Location Services.'},
  {id:'tech-nighthawk',title:'Nighthawk Router Troubleshooting',pages:'9–10',terms:'nighthawk router wifi internet central communication restart router hard reset ipad window connection',summary:'Restart the Nighthawk, then reset the iPad if needed; includes additional connectivity tips.'}
];

function lookupHaystack(item){ return JSON.stringify(item).toLowerCase(); }
function lookupCard(layer,title,summary,attrs){
  return `<button class="card lookup-result-card" ${attrs}><span class="lookup-layer">${esc(layer)}</span><strong>${esc(title)}</strong><span>${esc(summary||'Open result')}</span></button>`;
}

renderLookup = function(){
  const q=(state.lookupQuery||'').trim().toLowerCase();
  const procedures=q?fieldData.items.filter(p=>p.modes.includes(state.mode)&&lookupHaystack(p).includes(q)):[];
  const guide=q?data.procedures.filter(p=>p.modes.includes(state.mode)&&lookupHaystack(p).includes(q)):[];
  title.textContent='Quick Lookup';
  const groups=[];
  if(procedures.length) groups.push(`<section class="lookup-group"><h3>Procedures</h3><p class="small">Live field answers: what just happened and what do I do now?</p>${procedures.map(p=>lookupCard('Procedure',p.title,p.meaning||p.summary,`data-lookup-procedure="${esc(p.id)}"`)).join('')}</section>`);
  if(guide.length) groups.push(`<section class="lookup-group"><h3>Guide</h3><p class="small">Training and checklist material.</p>${guide.map(p=>lookupCard('Guide',p.title,p.summary,`data-lookup-guide="${esc(p.id)}"`)).join('')}</section>`);
  return `${pageHeading('Quick Lookup','Search once, then jump directly to the correct Guide or Procedure.')}
    <input id="lookupInput" class="search-box" placeholder="Search affirm, moved, voter not found, reprint, spoil…" value="${esc(state.lookupQuery||'')}">
    <div style="height:12px"></div>
    ${!q?'<div class="card empty">Type the voter situation or procedure you are looking for.</div>':groups.length?groups.join(''):'<div class="card empty">No matching Guide or Procedure.</div>'}`;
};

function openProcedureFromLookup(id){
  const item=fieldData.items.find(x=>x.id===id);
  if(!item) return;
  state.route='procedures';
  state.procedureCategory=item.category;
  saveState(); render();
  requestAnimationFrame(()=>document.getElementById(`field-${id}`)?.scrollIntoView({block:'start',behavior:'auto'}));
}
function openGuideFromLookup(id){
  state.route='guide';
  saveState(); render();
  requestAnimationFrame(()=>{
    const target=document.querySelector(`[data-procedure="${CSS.escape(id)}"]`);
    if(!target) return;
    if(target.classList.contains('procedure-card')&&!target.classList.contains('teaching-procedure')) target.classList.add('expanded');
    target.scrollIntoView({block:'start',behavior:'auto'});
  });
}

/* Rich Training Tracker restoration. */
const TRACKER_STATUS_CHOICES=[['covered','Covered'],['live','Demonstrated Live'],['review','Needs Review'],['notReached','Not Reached']];
const TRACKER_GROUPS=[
  {title:'Opening & Readiness',topics:['Opening and worker orientation','Numbered station setup']},
  {title:'Standard Voter Check-In',topics:['Activation-card preload','Standard voter check-in']},
  {title:'Flags & Exceptions',topics:['Mail-In Ballot','Already Voted','Early Voted','Voter Not Found','ID Required']},
  {title:'Ballot & Recovery Procedures',topics:['Provisional ballots','Reprint','Spoil']},
  {title:'Floor Operations',topics:['Crowd flow','Who to call before improvising']}
];
function trackerTopicIndex(name){return data.trainingTopics.indexOf(name);}
function trackerIsComplete(status){return status==='covered'||status==='live';}
function trackerTopicState(i){return state.training[i]||{};}
function trackerGroupStats(group){
  const indexes=group.topics.map(trackerTopicIndex).filter(i=>i>=0);
  return {indexes,total:indexes.length,complete:indexes.filter(i=>trackerIsComplete(trackerTopicState(i).status)).length};
}
function trackerAllStats(){
  const total=data.trainingTopics.length;
  return {
    total,
    complete:data.trainingTopics.filter((_,i)=>trackerIsComplete(trackerTopicState(i).status)).length,
    covered:data.trainingTopics.filter((_,i)=>trackerTopicState(i).status==='covered').length,
    live:data.trainingTopics.filter((_,i)=>trackerTopicState(i).status==='live').length,
    review:data.trainingTopics.filter((_,i)=>trackerTopicState(i).status==='review').length,
    notReached:data.trainingTopics.filter((_,i)=>trackerTopicState(i).status==='notReached').length
  };
}
function trackerPill(done,total){return done===total&&total>0?'<span class="tracker-pill complete">★ Complete</span>':`<span class="tracker-pill">★ ${done} of ${total}</span>`;}
function trackerTopicCard(i){
  const topic=data.trainingTopics[i], item=trackerTopicState(i);
  const statusLabel=TRACKER_STATUS_CHOICES.find(x=>x[0]===item.status)?.[1]||'Not yet marked';
  return `<div class="training-topic-row ${trackerIsComplete(item.status)?'complete':''}">
    <div class="training-topic-copy"><strong>${esc(topic)}</strong><small>${esc(statusLabel)}</small></div>
    <div class="training-card" data-topic="${i}">
      <div class="status-grid tracker-status-grid">${TRACKER_STATUS_CHOICES.map(([k,l])=>`<button class="status-button ${item.status===k?'active':''}" data-status="${k}">${l}</button>`).join('')}</div>
      <textarea class="note-field" data-topic-note="${i}" placeholder="Optional training note">${esc(item.note||'')}</textarea>
    </div>
  </div>`;
}
renderTraining=function(){
  title.textContent='Training Tracker';
  const totals=trackerAllStats();
  const pct=totals.total?Math.round((totals.complete/totals.total)*100):0;
  return `${pageHeading('Training Tracker',`${modeLabel()} • progress stays on this device until the active session is reset.`)}
    <section class="card tracker-overview">
      <div class="tracker-overview-head"><div><p class="section-label">Session progress</p><h3>${totals.complete} of ${totals.total} topics complete</h3></div>${trackerPill(totals.complete,totals.total)}</div>
      <div class="tracker-progress"><span style="width:${pct}%"></span></div>
      <div class="tracker-summary-line"><span>${pct}% complete</span><span>${totals.review} need review</span><span>${totals.notReached} not reached</span></div>
    </section>
    <section class="card tracker-workers"><label><strong>Workers present</strong></label><input id="workersPresent" class="search-box" value="${esc(state.workersPresent)}" placeholder="Names or count"></section>
    ${TRACKER_GROUPS.map(group=>{const g=trackerGroupStats(group);return `<section class="card tracker-section ${g.complete===g.total&&g.total?'complete':''}"><div class="tracker-section-head"><h3>${esc(group.title)}</h3>${trackerPill(g.complete,g.total)}</div><div class="tracker-topic-list">${g.indexes.map(trackerTopicCard).join('')}</div></section>`;}).join('')}`;
};
calculateReport=function(){const t=trackerAllStats();return {planned:t.total,covered:t.covered,live:t.live,complete:t.complete,review:t.review,notReached:t.notReached};};
renderReport=function(){
  title.textContent='Daily Report';
  const r=calculateReport();
  const priorities=data.trainingTopics.filter((_,i)=>['review','notReached'].includes(state.training[i]?.status));
  const pct=r.planned?Math.round((r.complete/r.planned)*100):0;
  return `${pageHeading('Session Summary',`${state.reportDate} • ${modeLabel()}`)}
    <section class="card tracker-overview report-overview"><div class="tracker-overview-head"><div><p class="section-label">Training completion</p><h3>${r.complete} of ${r.planned} topics complete</h3></div>${trackerPill(r.complete,r.planned)}</div><div class="tracker-progress"><span style="width:${pct}%"></span></div><div class="report-stat"><span>Covered</span><strong>${r.covered}</strong></div><div class="report-stat"><span>Demonstrated live</span><strong>${r.live}</strong></div><div class="report-stat"><span>Needs review</span><strong>${r.review}</strong></div><div class="report-stat"><span>Not reached</span><strong>${r.notReached}</strong></div></section>
    <section class="card"><h3>Carry-forward priorities</h3>${priorities.length?`<ul>${priorities.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">No topics are currently marked Needs Review or Not Reached.</p>'}</section>
    <section class="card"><h3>General daily notes</h3><textarea id="dailyNotes" placeholder="Board questions, repeated trouble areas, or follow-up">${esc(state.dailyNotes)}</textarea></section>
    <div class="controls"><button id="finishDay" class="primary">Save Session</button><button id="startTomorrow" class="secondary">Start Next Day</button></div>
    <section class="card"><h3>Saved session history</h3>${state.history.length?state.history.slice().reverse().map(h=>`<div class="history-row"><strong>${esc(h.date)}</strong><span>${esc(h.mode==='early'?'Early Voting':'Election Day')}</span></div>`).join(''):'<p class="small">No saved sessions yet.</p>'}</section>`;
};

const reconciliationBaseBindDynamic=bindDynamic;
bindDynamic=function(){
  reconciliationBaseBindDynamic();
  document.querySelectorAll('[data-lookup-procedure]').forEach(b=>b.onclick=()=>openProcedureFromLookup(b.dataset.lookupProcedure));
  document.querySelectorAll('[data-lookup-guide]').forEach(b=>b.onclick=()=>openGuideFromLookup(b.dataset.lookupGuide));
};

/* Screenshot-era Guide restoration. */
function guideStepCount(p){return p.type==='teaching'?(p.lessons?.length||0):(p.steps?.length||0);}
function guideDoneCount(p){
  if(p.type==='teaching')return (p.lessons||[]).filter(lesson=>['explained','live'].includes(state.lessonStatus[`${p.id}:${lesson.id}`]?.status)).length;
  const progress=state.procedureProgress[p.id]||{};
  return (p.steps||[]).filter((_,i)=>!!progress[i]).length;
}
function guideProgressPill(p){const total=guideStepCount(p),done=guideDoneCount(p),complete=total>0&&done===total;return `<span class="guide-progress-pill ${complete?'complete':''}">★ ${complete?'Complete':`${done} of ${total}`}</span>`;}
function guideHeading(p){return `<div class="guide-section-head"><div><h3>${esc(p.title)}</h3><p class="summary">${esc(p.summary)}</p></div>${guideProgressPill(p)}</div>${badges(p.badges)}`;}

teachingProcedureMarkup=function(p){
  const total=guideStepCount(p),done=guideDoneCount(p),complete=total>0&&done===total;
  return `<section class="card procedure-card teaching-procedure guide-section-card ${complete?'complete':''}" data-procedure="${p.id}">${guideHeading(p)}<div class="lesson-stack">${p.lessons.map((lesson,index)=>{
    const key=`${p.id}:${lesson.id}`,open=state.openLesson===key,status=state.lessonStatus[key]?.status||'',lessonComplete=['explained','live'].includes(status),actionProgress=state.procedureProgress[key]||{};
    return `<article class="lesson-card ${open?'active':''} ${lessonComplete?'complete':''}" data-lesson-card="${key}"><button class="lesson-toggle" data-open-lesson="${key}" aria-expanded="${open}"><span class="lesson-number">${lessonComplete?'✓':index+1}</span><span class="lesson-title-wrap"><strong>${esc(lesson.title)}</strong><small>${esc(lesson.lead)}</small></span><span class="chevron">⌄</span></button><div class="lesson-detail">${infoBlock('Official Procedure','official',lesson.official)}${infoBlock('Why It Matters','why',lesson.why)}${infoBlock('Master Poll Worker Tip','tip',lesson.tips)}${infoBlock('Common Mistake','mistake',lesson.mistakes)}${lesson.actions?.length?`<section class="teaching-block actions"><h5>Action Checks</h5><div class="step-list">${lesson.actions.map((a,i)=>`<div class="step-item ${actionProgress[i]?'checked':''}"><input type="checkbox" id="${p.id}-${lesson.id}-${i}" data-action-check="${key}" data-index="${i}" ${actionProgress[i]?'checked':''}><label for="${p.id}-${lesson.id}-${i}">${esc(a)}</label></div>`).join('')}</div></section>`:''}${lessonStatusControls(p.id,lesson)}</div></article>`;
  }).join('')}</div></section>`;
};
standardProcedureMarkup=function(p,expanded=false){
  const progress=state.procedureProgress[p.id]||{},total=guideStepCount(p),done=guideDoneCount(p),complete=total>0&&done===total;
  return `<section class="card procedure-card guide-section-card ${expanded?'expanded':''} ${complete?'complete':''}" data-procedure="${p.id}"><button class="procedure-toggle guide-section-toggle" aria-expanded="${expanded}">${guideHeading(p)}<span class="open-hint">${expanded?'Hide topics':'Show topics'}</span></button><div class="procedure-detail">${p.warning?`<div class="warning-box">${esc(p.warning)}</div>`:''}<div class="step-list">${p.steps.map((s,i)=>`<div class="step-item ${progress[i]?'checked':''}"><input type="checkbox" id="${p.id}-${i}" data-check="${p.id}" data-index="${i}" ${progress[i]?'checked':''}><label for="${p.id}-${i}">${esc(s)}</label></div>`).join('')}</div></div></section>`;
};
renderGuide=function(){
  title.textContent='Trainer Checklist';
  const procedures=filteredProcedures();
  const totals=procedures.reduce((a,p)=>{a.total+=guideStepCount(p);a.done+=guideDoneCount(p);return a;},{done:0,total:0});
  const sectionsDone=procedures.filter(p=>guideStepCount(p)>0&&guideDoneCount(p)===guideStepCount(p)).length;
  const pct=totals.total?Math.round((totals.done/totals.total)*100):0;
  return `${pageHeading('Trainer Checklist',`${modeLabel()} • progress stays on this device until the session is reset.`)}<section class="card guide-overview"><div class="guide-overview-head"><div><p class="section-label">Session progress</p><h3>${totals.done} of ${totals.total} topics complete</h3></div><span class="guide-progress-pill">★ ${sectionsDone} of ${procedures.length} sections</span></div><div class="guide-progress-bar"><span style="width:${pct}%"></span></div></section>${procedures.map((p,i)=>procedureMarkup(p,p.id==='checkin'||i===0)).join('')}`;
};

const guideBaseBindDynamic=bindDynamic;
bindDynamic=function(){
  guideBaseBindDynamic();
  document.querySelectorAll('[data-open-lesson]').forEach(button=>button.onclick=()=>{
    const key=button.dataset.openLesson,card=button.closest('[data-lesson-card]'),beforeTop=card?.getBoundingClientRect().top||0;
    state.openLesson=state.openLesson===key?null:key;saveState();render();
    requestAnimationFrame(()=>{const after=document.querySelector(`[data-lesson-card="${CSS.escape(key)}"]`);if(!after)return;const delta=after.getBoundingClientRect().top-beforeTop;if(Math.abs(delta)>1)window.scrollBy(0,delta);});
  });
  document.querySelectorAll('.guide-section-toggle').forEach(button=>button.onclick=()=>{const card=button.closest('.procedure-card');card.classList.toggle('expanded');const open=card.classList.contains('expanded');button.setAttribute('aria-expanded',String(open));const hint=button.querySelector('.open-hint');if(hint)hint.textContent=open?'Hide topics':'Show topics';});
  document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>{const id=c.dataset.check;state.procedureProgress[id]||={};state.procedureProgress[id][c.dataset.index]=c.checked;saveState();render();});
  document.querySelectorAll('[data-action-check]').forEach(c=>c.onchange=()=>{const id=c.dataset.actionCheck;state.procedureProgress[id]||={};state.procedureProgress[id][c.dataset.index]=c.checked;saveState();render();});
};
render();
