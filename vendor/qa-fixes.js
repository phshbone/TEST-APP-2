// QA fixes found during six-tab reconciliation audit.
(function(){
  // Keep the Board Questions screen accurate when the source-reconciliation queue is empty.
  renderBoard=function(){
    title.textContent='Board Questions';
    const queue=fieldData.boardQueue||[];
    return `${pageHeading('Board Clarification Notes','Capture genuinely unresolved local questions without treating them as official procedure.')}
      <div class="card"><textarea id="boardQuestionText" placeholder="Issue, real-world behavior, risk, and requested clarification"></textarea><button id="addBoardQuestion" class="primary full">Add Question</button></div>
      ${state.boardQuestions.length?state.boardQuestions.map((q,i)=>`<div class="card"><span class="pill">Needs Board Confirmation</span><p>${esc(q.text)}</p><p class="small">${esc(q.date)}</p><button class="danger" data-delete-question="${i}">Delete</button></div>`).join(''):'<div class="card empty">No locally added Board questions saved.</div>'}
      <div class="card"><h3>Source verification status</h3>${queue.length?`<p class="small">These items still need source or Board confirmation.</p><ul>${queue.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`:'<p class="small">No unresolved source-verification items are currently open. Add a local Board question above if a new field situation needs clarification.</p>'}</div>`;
  };

  // Preserve the complete Guide/checklist state in each saved session snapshot.
  finishDay=function(){
    const summary=calculateReport();
    const procedures=filteredProcedures();
    const guideSummary=procedures.reduce((acc,p)=>{
      const total=typeof guideStepCount==='function'?guideStepCount(p):(p.steps?.length||p.lessons?.length||0);
      const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
      acc.total+=total; acc.done+=done;
      if(total>0&&done===total) acc.sectionsDone++;
      return acc;
    },{done:0,total:0,sectionsDone:0,sections:procedures.length});
    const snapshot={
      date:state.reportDate,
      mode:state.mode,
      workersPresent:state.workersPresent,
      training:JSON.parse(JSON.stringify(state.training)),
      lessonStatus:JSON.parse(JSON.stringify(state.lessonStatus)),
      procedureProgress:JSON.parse(JSON.stringify(state.procedureProgress)),
      dailyNotes:state.dailyNotes,
      summary,
      guideSummary
    };
    state.history=state.history.filter(h=>h.date!==snapshot.date);
    state.history.push(snapshot);
    saveState();
    alert('Daily record saved.');
    render();
  };

  render();
})();
