// Compact Home dashboard + collapsible Today at a Glance — TEST-APP-2 only.
(function(){
  function hasStatus(obj,key){
    if(!obj)return false;
    return Array.isArray(obj.statuses)?obj.statuses.includes(key):obj.status===key;
  }
  function guideStats(){
    const procedures=filteredProcedures();
    return procedures.reduce((acc,p)=>{
      const total=typeof guideStepCount==='function'?guideStepCount(p):(p.steps?.length||p.lessons?.length||0);
      const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
      acc.total+=total;acc.done+=done;
      return acc;
    },{done:0,total:0});
  }
  function trainingStats(){
    const scored=window.SCORED_TRAINING_TOPICS||data.trainingTopics;
    const indexes=scored.map(name=>data.trainingTopics.indexOf(name)).filter(i=>i>=0);
    return {
      total:indexes.length,
      complete:indexes.filter(i=>hasStatus(state.training[i],'covered')||hasStatus(state.training[i],'live')).length,
      review:indexes.filter(i=>hasStatus(state.training[i],'review')).length,
      notReached:indexes.filter(i=>hasStatus(state.training[i],'notReached')).length
    };
  }
  function pct(done,total){return total?Math.round(done/total*100):0;}
  function meter(label,done,total){
    return `<div class="home-meter"><div class="home-meter-head"><span>${esc(label)}</span><strong>${done}/${total}</strong></div><div class="tracker-progress"><span style="width:${pct(done,total)}%"></span></div></div>`;
  }
  function activeRoute(){return sessionStorage.getItem('mpwHomeLastRoute')||'';}
  function tile(route,titleText,copy){
    return `<button class="card quick-card home-dashboard-tile ${activeRoute()===route?'home-last-used':''}" data-go="${route}"><strong>${esc(titleText)}</strong><span>${esc(copy)}</span></button>`;
  }

  renderHome=function(){
    title.textContent='Master Poll Worker Guide';
    const g=guideStats(),t=trainingStats(),open=!!state.homeGlanceOpen;
    return `${pageHeading('Master Poll Worker Guide',`${modeLabel()} • ${state.reportDate}`)}
      <section class="card home-status-card home-glance ${open?'is-open':'is-collapsed'}">
        <button type="button" class="home-glance-toggle" data-home-glance-toggle aria-expanded="${open}">
          <div class="home-glance-title"><p class="section-label">Today at a glance</p><h3>Training and field reference</h3></div>
          <div class="home-glance-summary"><span class="tracker-pill">${esc(modeLabel())}</span><span class="home-glance-counts">${g.done}/${g.total} · ${t.complete}/${t.total}</span><span class="home-glance-chevron">⌄</span></div>
        </button>
        <div class="home-glance-detail">
          ${meter('Trainer Checklist',g.done,g.total)}
          ${meter('Training Tracker',t.complete,t.total)}
          ${(t.review||t.notReached)?`<p class="small"><strong>${t.review}</strong> need review • <strong>${t.notReached}</strong> not reached</p>`:'<p class="small">No training items are currently marked Needs Review or Not Reached.</p>'}
        </div>
      </section>
      <div class="home-dashboard-grid">
        ${tile('guide','Trainer Checklist','Teach and track the job.')}
        ${tile('procedures','Procedures','Handle flags and field issues.')}
        ${tile('lookup','Quick Lookup','Jump directly to an answer.')}
        ${tile('training','Training Tracker','Record training progress.')}
        ${tile('current','Important Dates & Rules','Deadlines and standing rules.')}
        ${tile('report','Daily Report','Review progress and notes.')}
      </div>
      <section class="card home-field-note"><h3>Field-use rule</h3><p>Use <strong>Guide</strong> to teach the normal job. Use <strong>Procedures</strong> when something happens during the job. Use <strong>Lookup</strong> when speed matters.</p></section>`;
  };

  document.addEventListener('click',e=>{
    const glance=e.target.closest('[data-home-glance-toggle]');
    if(glance){
      e.preventDefault();e.stopPropagation();
      state.homeGlanceOpen=!state.homeGlanceOpen;
      saveState();render();
      return;
    }
    const go=e.target.closest('.home-dashboard-tile[data-go]');
    if(go)sessionStorage.setItem('mpwHomeLastRoute',go.dataset.go);
  },true);

  render();
})();
