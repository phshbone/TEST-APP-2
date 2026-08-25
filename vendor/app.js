const STORAGE_KEY = 'mpwg-build-0-2';
const LEGACY_KEY = 'mpwg-build-0-1';
const data = window.APP_DATA;
const fieldData = window.FIELD_PROCEDURES;
const defaultState = {
  route:'home', mode:'early', procedureProgress:{}, lessonStatus:{}, openLesson:null,
  training:{}, dailyNotes:'', history:[], boardQuestions:[], workersPresent:'',
  reportDate:new Date().toISOString().slice(0,10), lookupQuery:'', procedureCategory:'flags'
};
let state = loadState();

const main = document.getElementById('mainContent');
const title = document.getElementById('sectionTitle');
const sideMenu = document.getElementById('sideMenu');

function loadState(){
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY) || '{}';
    return {...defaultState, ...JSON.parse(saved)};
  } catch { return {...defaultState}; }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(v=''){ return String(v).replace(/[&<>'\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c])); }
function setRoute(route){ state.route=route; saveState(); render(); sideMenu.close(); window.scrollTo({top:0,behavior:'smooth'}); }
function modeLabel(){ return state.mode === 'early' ? 'Early Voting' : 'Election Day'; }
function filteredProcedures(){ return data.procedures.filter(p=>p.modes.includes(state.mode)); }
function pageHeading(name, sub=''){ return `<div class="page-heading"><h2>${name}</h2>${sub?`<p>${sub}</p>`:''}</div>`; }
function badges(items=[]){ return `<div class="badge-row">${items.map(x=>`<span class="badge">${esc(x)}</span>`).join('')}</div>`; }

function renderHome(){
  title.textContent='Master Poll Worker Guide';
  return `${pageHeading('Today’s Control Center', `${modeLabel()} mode • ${state.reportDate}`)}
  <div class="card">
    <h3>Teaching-guide prototype</h3>
    <p>Standard Voter Check-In now uses expandable lessons. Tap a lesson to open the teaching material; use the separate status control to record how it was covered.</p>
    <div class="warning-box">Stop and verify any unexpected seal, screen, report, printer, or voter flag before continuing.</div>
  </div>
  <div class="grid two">
    <button class="card quick-card" data-go="guide"><strong>Teaching Guide</strong><span>Core procedures and the new expandable check-in lessons.</span></button>
    <button class="card quick-card" data-go="dosdonts"><strong>Official Do’s & Don’ts</strong><span>Fast reminders with explanations and related labels.</span></button>
    <button class="card quick-card" data-go="training"><strong>Training Tracker</strong><span>Mark covered, demonstrated, review, or not reached.</span></button>
    <button class="card quick-card" data-go="report"><strong>End-of-Day Report</strong><span>Review today and carry unfinished work forward.</span></button>
  </div>`;
}

function lessonStatusControls(procedureId, lesson){
  const key=`${procedureId}:${lesson.id}`;
  const current=state.lessonStatus[key]?.status || '';
  const choices=[['explained','Explained'],['live','Demonstrated Live'],['review','Needs Review'],['notReached','Not Reached']];
  return `<div class="lesson-status"><p class="section-label">Training status</p><div class="status-grid compact">${choices.map(([k,l])=>`<button class="status-button ${current===k?'active':''}" data-lesson-status="${key}" data-status="${k}">${l}</button>`).join('')}</div></div>`;
}
function infoBlock(label, className, content){
  if(!content || (Array.isArray(content) && !content.length)) return '';
  const body=Array.isArray(content)?`<ul>${content.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p>${esc(content)}</p>`;
  return `<section class="teaching-block ${className}"><h5>${label}</h5>${body}</section>`;
}
function teachingProcedureMarkup(p){
  return `<section class="card procedure-card teaching-procedure" data-procedure="${p.id}">
    <div class="procedure-heading"><h3>${esc(p.title)}</h3><p class="summary">${esc(p.summary)}</p>${badges(p.badges)}</div>
    <div class="lesson-stack">${p.lessons.map((lesson,index)=>{
      const key=`${p.id}:${lesson.id}`;
      const open=state.openLesson===key;
      const actionProgress=state.procedureProgress[key]||{};
      return `<article class="lesson-card ${open?'active':''}" data-lesson-card="${key}">
        <button class="lesson-toggle" data-open-lesson="${key}" aria-expanded="${open}">
          <span class="lesson-number">${index+1}</span>
          <span class="lesson-title-wrap"><strong>${esc(lesson.title)}</strong><small>${esc(lesson.lead)}</small></span>
          <span class="chevron">⌄</span>
        </button>
        <div class="lesson-detail">
          ${infoBlock('Official Procedure','official',lesson.official)}
          ${infoBlock('Why It Matters','why',lesson.why)}
          ${infoBlock('Master Worker Tip','tip',lesson.tips)}
          ${infoBlock('Common Mistake','mistake',lesson.mistakes)}
          ${lesson.actions?.length?`<section class="teaching-block actions"><h5>Action checks</h5><div class="step-list">${lesson.actions.map((a,i)=>`<div class="step-item"><input type="checkbox" id="${p.id}-${lesson.id}-${i}" data-action-check="${key}" data-index="${i}" ${actionProgress[i]?'checked':''}><label for="${p.id}-${lesson.id}-${i}">${esc(a)}</label></div>`).join('')}</div></section>`:''}
          ${lessonStatusControls(p.id,lesson)}
        </div>
      </article>`;
    }).join('')}</div>
  </section>`;
}
function standardProcedureMarkup(p, expanded=false){
  const progress = state.procedureProgress[p.id] || {};
  return `<section class="card procedure-card ${expanded?'expanded':''}" data-procedure="${p.id}">
    <button class="procedure-toggle"><h3>${esc(p.title)}</h3><p class="summary">${esc(p.summary)}</p>${badges(p.badges)}<span class="open-hint">Tap to ${expanded?'close':'open'}</span></button>
    <div class="procedure-detail">
      ${p.warning?`<div class="warning-box">${esc(p.warning)}</div>`:''}
      <div class="step-list">${p.steps.map((s,i)=>`<div class="step-item"><input type="checkbox" id="${p.id}-${i}" data-check="${p.id}" data-index="${i}" ${progress[i]?'checked':''}><label for="${p.id}-${i}">${i+1}. ${esc(s)}</label></div>`).join('')}</div>
    </div>
  </section>`;
}
function procedureMarkup(p, expanded=false){ return p.type==='teaching'?teachingProcedureMarkup(p):standardProcedureMarkup(p,expanded); }
function renderGuide(){
  title.textContent='Teaching Guide';
  const procedures=filteredProcedures();
  return `${pageHeading('Core Teaching Guide', `${procedures.length} procedures shown for ${modeLabel()}. Standard Check-In uses the expandable teaching format.`)}${procedures.map((p,i)=>procedureMarkup(p,p.id==='checkin'||i===0)).join('')}`;
}
function sourceMarkup(source){
  if(!source) return '';
  return `<details class="source-panel"><summary>Source</summary><div class="source-meta"><span><strong>${esc(source.title)}</strong></span><span>${esc(source.authority||'')}</span>${source.section?`<span>${esc(source.section)}</span>`:''}${source.date?`<span>Issued/revised: ${esc(source.date)}</span>`:''}${source.url?`<a href="${esc(source.url)}" target="_blank" rel="noopener">Open official source</a>`:''}</div></details>`;
}
function fieldProcedureMarkup(item){
  const shared=item.sharedProcedure?data.procedures.find(p=>p.id===item.sharedProcedure):null;
  const status=badges(item.statuses||[]);
  const steps=item.steps||shared?.steps||[];
  const warning=item.warning||shared?.warning;
  return `<article class="card field-procedure" id="field-${esc(item.id)}">
    <h3>${esc(item.title)}</h3>${status}<p class="summary">${esc(item.meaning||shared?.summary||'')}</p>
    ${warning?`<div class="warning-box">${esc(warning)}</div>`:''}
    ${item.decision?`<section class="field-section"><h4>Decision point</h4><p><strong>${esc(item.decision.question)}</strong></p><div class="decision-split"><div class="decision-choice"><strong>YES</strong>${esc(item.decision.yes.replace(/^YES → /,''))}</div><div class="decision-choice"><strong>NO</strong>${esc(item.decision.no.replace(/^NO → /,''))}</div></div></section>`:''}
    ${steps.length?`<section class="field-section"><h4>What To Do</h4><ol>${steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`:''}
    ${item.notDo?.length?`<section class="field-section"><h4>What NOT To Do</h4><ul>${item.notDo.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`:''}
    ${item.outcome?`<section class="field-section"><h4>Voting Outcome</h4><div class="outcome-box">${esc(item.outcome)}</div></section>`:''}
    ${item.form?`<section class="field-section"><h4>Required Form</h4><p>${esc(item.form)}</p></section>`:''}
    ${item.escalation?`<section class="field-section"><h4>When To Call the Board</h4><p>${esc(item.escalation)}</p></section>`:''}
    ${item.boardQuestion?`<section class="field-section"><h4>Needs Board Confirmation</h4><p>${esc(item.boardQuestion)}</p></section>`:''}
    ${sourceMarkup(item.source)}
    <div class="cross-links">${item.relatedGuide?`<button class="cross-link" data-open-guide="${esc(item.relatedGuide)}">Teach This Topic</button>`:''}${shared?`<button class="cross-link" data-open-shared="${esc(shared.id)}">Open Shared Procedure</button>`:''}</div>
    ${item.aliases?.length?`<div class="alias-line">Lookup aliases: ${item.aliases.map(esc).join(' · ')}</div>`:''}
  </article>`;
}
function renderProcedures(){
  title.textContent='Procedures';
  const cats=fieldData.categories;
  const active=state.procedureCategory||'flags';
  const items=fieldData.items.filter(x=>x.category===active && x.modes.includes(state.mode));
  return `${pageHeading('Field Procedures','This just happened—what do I do? Browse a category, then use the actionable card.')}
    <div class="category-grid">${cats.map(c=>`<button class="category-card ${active===c.id?'active':''}" data-procedure-category="${c.id}"><strong>${esc(c.title)}</strong><small>${esc(c.description)}</small></button>`).join('')}</div>
    ${items.length?items.map(fieldProcedureMarkup).join(''):'<div class="card empty">No procedure card has been connected to this category yet. Existing material will be linked here during the inventory pass.</div>'}`;
}
function renderLookup(){
  const q=(state.lookupQuery||'').trim().toLowerCase();
  const core=q?data.procedures.filter(p=>JSON.stringify(p).toLowerCase().includes(q)):[];
  const field=q?fieldData.items.filter(p=>JSON.stringify(p).toLowerCase().includes(q) && p.modes.includes(state.mode)):[];
  title.textContent='Quick Lookup';
  return `${pageHeading('Quick Lookup','Search the shared operational knowledge base, including practical aliases.')}
  <input id="lookupInput" class="search-box" placeholder="Search affirm, address, mail-in, reprint, spoil…" value="${esc(state.lookupQuery||'')}">
  <div style="height:12px"></div>${!q?'<div class="card empty">Enter a term to search procedures and aliases.</div>':field.length||core.length?`${field.map(fieldProcedureMarkup).join('')}${core.filter(p=>!field.some(f=>f.sharedProcedure===p.id)).map(p=>procedureMarkup(p,true)).join('')}`:'<div class="card empty">No matching procedure.</div>'}`;
}
function renderDosDonts(){
  title.textContent='Official Do’s & Don’ts';
  const renderItems=(items,type)=>items.map((item,i)=>`<article class="rule-card ${type}">
    <button class="rule-toggle" data-rule-toggle="${type}-${i}"><span class="rule-icon">${type==='do'?'DO':'DON’T'}</span><strong>${esc(item.text)}</strong><span class="chevron">⌄</span></button>
    <div class="rule-detail"><p>${esc(item.detail)}</p>${badges(item.tags)}</div>
  </article>`).join('');
  return `${pageHeading('Official Do’s & Don’ts','Use this as a fast pre-opening reminder and a training reference.')}
    <section class="card rules-section"><h3 class="do-heading">DO</h3>${renderItems(data.dosDonts.dos,'do')}</section>
    <section class="card rules-section"><h3 class="dont-heading">DON’T</h3>${renderItems(data.dosDonts.donts,'dont')}</section>`;
}
function renderTraining(){
  title.textContent='Training Tracker';
  return `${pageHeading('Daily Training Tracker','Each topic may have one current status and a note.')}
  <div class="card"><label><strong>Workers present</strong></label><input id="workersPresent" class="search-box" value="${esc(state.workersPresent)}" placeholder="Names or count"></div>
  ${data.trainingTopics.map((topic,i)=>{
    const item=state.training[i]||{};
    return `<div class="card training-card" data-topic="${i}"><h3>${esc(topic)}</h3>
      <div class="status-grid">${[['covered','Covered'],['live','Demonstrated Live'],['review','Needs Review'],['notReached','Not Reached']].map(([k,l])=>`<button class="status-button ${item.status===k?'active':''}" data-status="${k}">${l}</button>`).join('')}</div>
      <textarea class="note-field" data-topic-note="${i}" placeholder="Optional note">${esc(item.note||'')}</textarea>
    </div>`;
  }).join('')}`;
}
function calculateReport(){ const vals=Object.values(state.training); const count=k=>vals.filter(v=>v.status===k).length; return {planned:data.trainingTopics.length,covered:count('covered'),live:count('live'),review:count('review'),notReached:count('notReached')}; }
function renderReport(){
  title.textContent='Daily Report'; const r=calculateReport();
  const priorities=data.trainingTopics.filter((_,i)=>['review','notReached'].includes(state.training[i]?.status));
  return `${pageHeading('End-of-Day Report', state.reportDate)}
  <div class="card">${[['Topics planned',r.planned],['Covered',r.covered],['Demonstrated live',r.live],['Needs review',r.review],['Not reached',r.notReached]].map(([a,b])=>`<div class="report-stat"><span>${a}</span><strong>${b}</strong></div>`).join('')}</div>
  <div class="card"><h3>Priorities for tomorrow</h3>${priorities.length?`<ul>${priorities.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">No carry-forward priorities are currently marked.</p>'}</div>
  <div class="card"><h3>General daily notes</h3><textarea id="dailyNotes" placeholder="Board questions, repeated trouble areas, or follow-up">${esc(state.dailyNotes)}</textarea></div>
  <div class="controls"><button id="finishDay" class="primary">Finish Day</button><button id="startTomorrow" class="secondary">Start Tomorrow</button></div>
  <div class="card"><h3>Saved history</h3>${state.history.length?state.history.slice().reverse().map(h=>`<div class="report-stat"><span>${esc(h.date)}</span><strong>${h.summary.covered}/${h.summary.planned}</strong></div>`).join(''):'<p class="small">No completed days saved yet.</p>'}</div>`;
}
function renderBoard(){
  title.textContent='Board Questions';
  return `${pageHeading('Board Clarification Notes','Capture unresolved rules without treating them as official.')}
  <div class="card"><textarea id="boardQuestionText" placeholder="Issue, real-world behavior, risk, and requested clarification"></textarea><button id="addBoardQuestion" class="primary full">Add Question</button></div>
  ${state.boardQuestions.length?state.boardQuestions.map((q,i)=>`<div class="card"><span class="pill">Needs Board Confirmation</span><p>${esc(q.text)}</p><p class="small">${esc(q.date)}</p><button class="danger" data-delete-question="${i}">Delete</button></div>`).join(''):'<div class="card empty">No locally added Board questions saved.</div>'}
  <div class="card"><h3>Project verification queue</h3><p class="small">Known unresolved items from the Procedures expansion handoff. These remain non-official until substantiated.</p><ul>${fieldData.boardQueue.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div>`;
}
function renderCurrent(){ title.textContent='Current Information'; return `${pageHeading('Official Current Information','External pages open outside the app when embedding is blocked.')}${data.currentLinks.map(x=>`<div class="card link-card"><h3>${esc(x.title)}</h3><a href="${x.url}" target="_blank" rel="noopener">Open Official Page</a></div>`).join('')}`; }
function renderSettings(){
  title.textContent='Settings & Backup';
  return `${pageHeading('Settings & Backup','Data remains on this device unless exported.')}
  <div class="card"><label><strong>Active date</strong></label><input id="reportDate" type="date" class="search-box" value="${state.reportDate}"></div>
  <div class="card"><h3>Backup</h3><div class="controls"><button id="exportJson" class="primary">Export JSON</button><label class="secondary" style="display:inline-flex;align-items:center"><input id="importJson" type="file" accept="application/json" hidden>Import JSON</label></div></div>
  <div class="card"><h3>Reset active day</h3><p class="small">Clears active action checks, lesson statuses, training statuses, workers, and notes. Saved history remains.</p><button id="resetDay" class="danger">Reset Current Day</button></div>`;
}
function render(){
  document.querySelectorAll('.mode-button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route));
  const routes={home:renderHome,guide:renderGuide,procedures:renderProcedures,lookup:renderLookup,dosdonts:renderDosDonts,training:renderTraining,report:renderReport,board:renderBoard,current:renderCurrent,settings:renderSettings};
  main.innerHTML=(routes[state.route]||renderHome)(); bindDynamic();
}
function bindDynamic(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>setRoute(b.dataset.go));
  document.querySelectorAll('[data-procedure-category]').forEach(b=>b.onclick=()=>{state.procedureCategory=b.dataset.procedureCategory;saveState();render();});
  document.querySelectorAll('[data-open-guide]').forEach(b=>b.onclick=()=>{state.route='guide';state.openLesson=b.dataset.openGuide==='checkin'?'checkin:flags':null;saveState();render();});
  document.querySelectorAll('[data-open-shared]').forEach(b=>b.onclick=()=>{state.route='guide';saveState();render();requestAnimationFrame(()=>document.querySelector(`[data-procedure="${CSS.escape(b.dataset.openShared)}"]`)?.scrollIntoView({behavior:'smooth',block:'start'}));});
  document.querySelectorAll('.procedure-toggle').forEach(b=>b.onclick=()=>b.closest('.procedure-card').classList.toggle('expanded'));
  document.querySelectorAll('[data-open-lesson]').forEach(b=>b.onclick=()=>{ const key=b.dataset.openLesson; state.openLesson=state.openLesson===key?null:key; saveState(); render(); requestAnimationFrame(()=>document.querySelector(`[data-lesson-card="${CSS.escape(key)}"]`)?.scrollIntoView({behavior:'smooth',block:'nearest'})); });
  document.querySelectorAll('[data-rule-toggle]').forEach(b=>b.onclick=()=>b.closest('.rule-card').classList.toggle('expanded'));
  document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>{ const id=c.dataset.check; state.procedureProgress[id] ||= {}; state.procedureProgress[id][c.dataset.index]=c.checked; saveState(); });
  document.querySelectorAll('[data-action-check]').forEach(c=>c.onchange=()=>{ const id=c.dataset.actionCheck; state.procedureProgress[id] ||= {}; state.procedureProgress[id][c.dataset.index]=c.checked; saveState(); });
  document.querySelectorAll('[data-lesson-status]').forEach(b=>b.onclick=()=>{ const key=b.dataset.lessonStatus; state.lessonStatus[key] ||= {}; state.lessonStatus[key].status=b.dataset.status; saveState(); render(); });
  const lookup=document.getElementById('lookupInput'); if(lookup) lookup.oninput=()=>{state.lookupQuery=lookup.value; saveState(); render(); document.getElementById('lookupInput')?.focus();};
  const workers=document.getElementById('workersPresent'); if(workers) workers.oninput=()=>{state.workersPresent=workers.value;saveState();};
  document.querySelectorAll('.training-card .status-button').forEach(b=>b.onclick=()=>{const i=b.closest('.training-card').dataset.topic; state.training[i] ||= {}; state.training[i].status=b.dataset.status; saveState(); render();});
  document.querySelectorAll('[data-topic-note]').forEach(t=>t.oninput=()=>{const i=t.dataset.topicNote; state.training[i] ||= {}; state.training[i].note=t.value; saveState();});
  const daily=document.getElementById('dailyNotes'); if(daily) daily.oninput=()=>{state.dailyNotes=daily.value;saveState();};
  const finish=document.getElementById('finishDay'); if(finish) finish.onclick=finishDay;
  const tomorrow=document.getElementById('startTomorrow'); if(tomorrow) tomorrow.onclick=startTomorrow;
  const addQ=document.getElementById('addBoardQuestion'); if(addQ) addQ.onclick=()=>{const t=document.getElementById('boardQuestionText').value.trim();if(!t)return;state.boardQuestions.push({text:t,date:new Date().toLocaleString()});saveState();render();};
  document.querySelectorAll('[data-delete-question]').forEach(b=>b.onclick=()=>{state.boardQuestions.splice(Number(b.dataset.deleteQuestion),1);saveState();render();});
  const date=document.getElementById('reportDate'); if(date) date.onchange=()=>{state.reportDate=date.value;saveState();};
  const exp=document.getElementById('exportJson'); if(exp) exp.onclick=exportJson;
  const imp=document.getElementById('importJson'); if(imp) imp.onchange=importJson;
  const reset=document.getElementById('resetDay'); if(reset) reset.onclick=resetDay;
}
function finishDay(){ const summary=calculateReport(); const snapshot={date:state.reportDate,mode:state.mode,workersPresent:state.workersPresent,training:JSON.parse(JSON.stringify(state.training)),lessonStatus:JSON.parse(JSON.stringify(state.lessonStatus)),dailyNotes:state.dailyNotes,summary}; state.history=state.history.filter(h=>h.date!==snapshot.date); state.history.push(snapshot); saveState(); alert('Daily record saved.'); render(); }
function startTomorrow(){ const carry={}; Object.entries(state.training).forEach(([i,v])=>{if(['review','notReached'].includes(v.status)) carry[i]={...v};}); const lessonCarry={}; Object.entries(state.lessonStatus).forEach(([k,v])=>{if(['review','notReached'].includes(v.status)) lessonCarry[k]={...v};}); const d=new Date(state.reportDate+'T12:00:00'); d.setDate(d.getDate()+1); state.training=carry; state.lessonStatus=lessonCarry; state.procedureProgress={}; state.dailyNotes=''; state.workersPresent=''; state.reportDate=d.toISOString().slice(0,10); saveState(); render(); }
function resetDay(){ if(!confirm('Reset the active day? Saved history will remain.')) return; state.training={}; state.lessonStatus={}; state.procedureProgress={}; state.dailyNotes=''; state.workersPresent=''; saveState(); render(); }
function exportJson(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`master-poll-worker-guide-${state.reportDate}.json`; a.click(); URL.revokeObjectURL(a.href); }
function importJson(e){ const file=e.target.files[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{try{state={...defaultState,...JSON.parse(r.result)};saveState();render();alert('Backup restored.');}catch{alert('That file could not be imported.');}}; r.readAsText(file); }

document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>setRoute(b.dataset.route));
document.querySelectorAll('.mode-button').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;saveState();render();});
document.getElementById('menuButton').onclick=()=>sideMenu.showModal();
document.getElementById('closeMenu').onclick=()=>sideMenu.close();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js'));
render();
