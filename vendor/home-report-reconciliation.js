// Final Home + Report reconciliation for the six-tab field build.
(function(){
  function homeGuideStats(){
    const procedures=filteredProcedures();
    return procedures.reduce((acc,p)=>{
      const total=typeof guideStepCount==='function'?guideStepCount(p):(p.steps?.length||p.lessons?.length||0);
      const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
      acc.total+=total; acc.done+=done;
      if(total>0&&done===total) acc.sectionsDone++;
      return acc;
    },{done:0,total:0,sectionsDone:0,sections:procedures.length});
  }
  function homeTrainingStats(){
    if(typeof trackerAllStats==='function') return trackerAllStats();
    const total=data.trainingTopics.length;
    const complete=data.trainingTopics.filter((_,i)=>['covered','live'].includes(state.training[i]?.status)).length;
    const review=data.trainingTopics.filter((_,i)=>state.training[i]?.status==='review').length;
    const notReached=data.trainingTopics.filter((_,i)=>state.training[i]?.status==='notReached').length;
    return {total,complete,review,notReached,covered:0,live:0};
  }
  function pct(done,total){return total?Math.round(done/total*100):0;}
  function summaryMeter(label,done,total){
    return `<div class="home-meter"><div class="home-meter-head"><span>${esc(label)}</span><strong>${done}/${total}</strong></div><div class="tracker-progress"><span style="width:${pct(done,total)}%"></span></div></div>`;
  }

  renderHome=function(){
    title.textContent='Master Poll Worker Guide';
    const g=homeGuideStats(), t=homeTrainingStats();
    return `${pageHeading('Master Poll Worker Guide',`${modeLabel()} • ${state.reportDate}`)}
      <section class="card home-status-card">
        <div class="home-status-head"><div><p class="section-label">Today at a glance</p><h3>Training and field reference</h3></div><span class="tracker-pill">${esc(modeLabel())}</span></div>
        ${summaryMeter('Trainer Checklist',g.done,g.total)}
        ${summaryMeter('Training Tracker',t.complete,t.total)}
        ${(t.review||t.notReached)?`<p class="small"><strong>${t.review}</strong> need review • <strong>${t.notReached}</strong> not reached</p>`:'<p class="small">No training items are currently marked Needs Review or Not Reached.</p>'}
      </section>
      <div class="grid two home-action-grid">
        <button class="card quick-card" data-go="guide"><strong>Trainer Checklist</strong><span>Teach the job, open topics in place, and track checklist progress.</span></button>
        <button class="card quick-card" data-go="procedures"><strong>Procedures</strong><span>Handle voter flags, exceptions, forms, ballot remedies, and field issues.</span></button>
        <button class="card quick-card" data-go="lookup"><strong>Quick Lookup</strong><span>Search Guide and Procedures and jump directly to the right answer.</span></button>
        <button class="card quick-card" data-go="training"><strong>Training Tracker</strong><span>Record covered, demonstrated, review, and not-reached topics.</span></button>
        <button class="card quick-card" data-go="current"><strong>Important Dates & Rules</strong><span>See predictive Primary/General deadlines and standing election rules.</span></button>
        <button class="card quick-card" data-go="report"><strong>Daily Report</strong><span>Review checklist and training progress, notes, and carry-forward items.</span></button>
      </div>
      <section class="card home-field-note"><h3>Field-use rule</h3><p>Use <strong>Guide</strong> to teach the normal job. Use <strong>Procedures</strong> when something happens during the job. Use <strong>Lookup</strong> when speed matters.</p></section>`;
  };

  renderReport=function(){
    title.textContent='Daily Report';
    const g=homeGuideStats(), t=homeTrainingStats();
    const trainingPriorities=data.trainingTopics.filter((_,i)=>['review','notReached'].includes(state.training[i]?.status));
    const guideOpen=filteredProcedures().filter(p=>{
      const total=typeof guideStepCount==='function'?guideStepCount(p):(p.steps?.length||p.lessons?.length||0);
      const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
      return total>0&&done<total;
    }).map(p=>p.title);
    return `${pageHeading('Daily Report',`${state.reportDate} • ${modeLabel()}`)}
      <section class="card report-overview">
        <p class="section-label">Trainer Checklist</p>
        <div class="tracker-overview-head"><h3>${g.done} of ${g.total} checklist topics complete</h3><span class="guide-progress-pill ${g.total&&g.done===g.total?'complete':''}">★ ${g.total&&g.done===g.total?'Complete':`${g.sectionsDone} of ${g.sections} sections`}</span></div>
        <div class="tracker-progress"><span style="width:${pct(g.done,g.total)}%"></span></div>
      </section>
      <section class="card report-overview">
        <p class="section-label">Training Tracker</p>
        <div class="tracker-overview-head"><h3>${t.complete} of ${t.total} training topics complete</h3>${typeof trackerPill==='function'?trackerPill(t.complete,t.total):''}</div>
        <div class="tracker-progress"><span style="width:${pct(t.complete,t.total)}%"></span></div>
        <div class="report-stat"><span>Covered</span><strong>${t.covered||0}</strong></div>
        <div class="report-stat"><span>Demonstrated live</span><strong>${t.live||0}</strong></div>
        <div class="report-stat"><span>Needs review</span><strong>${t.review||0}</strong></div>
        <div class="report-stat"><span>Not reached</span><strong>${t.notReached||0}</strong></div>
      </section>
      <section class="card"><h3>Carry-forward priorities</h3>
        ${trainingPriorities.length?`<p class="section-label">Training</p><ul>${trainingPriorities.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">No Training Tracker carry-forward items.</p>'}
        ${guideOpen.length?`<p class="section-label">Checklist sections still open</p><ul>${guideOpen.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">Trainer Checklist is complete.</p>'}
      </section>
      <section class="card"><h3>General daily notes</h3><textarea id="dailyNotes" placeholder="Board questions, repeated trouble areas, equipment issues, or follow-up">${esc(state.dailyNotes)}</textarea></section>
      <div class="controls"><button id="finishDay" class="primary">Save Session</button><button id="startTomorrow" class="secondary">Start Next Day</button></div>
      <section class="card"><h3>Saved session history</h3>${state.history.length?state.history.slice().reverse().map(h=>`<div class="history-row"><strong>${esc(h.date)}</strong><span>${esc(h.mode==='early'?'Early Voting':'Election Day')}</span></div>`).join(''):'<p class="small">No saved sessions yet.</p>'}</section>`;
  };

  render();
})();
