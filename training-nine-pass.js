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

  function idx(name){return data.trainingTopics.indexOf(name);}
  function item(name){const i=idx(name);return i>=0?(state.training[i]||{}):{};}
  function complete(name){return ['covered','live'].includes(item(name).status);}
  function countStatus(name,status){
    const o=item(name), s=Array.isArray(o.statuses)?o.statuses:(o.status?[o.status]:[]);
    return s.includes(status);
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

  // Re-render once so Home/Training/Report immediately use the 9-topic total.
  render();
})();
