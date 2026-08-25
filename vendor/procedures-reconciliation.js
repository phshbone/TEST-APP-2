// Procedure reconciliation pass. Applies user-confirmed Morris field practice without replacing source-backed state rules.
(function(){
  const byId=id=>fieldData.items.find(x=>x.id===id);
  const upsert=item=>{ const i=fieldData.items.findIndex(x=>x.id===item.id); if(i>=0) fieldData.items[i]={...fieldData.items[i],...item}; else fieldData.items.push(item); };

  upsert({
    id:'flag-affirm-address',category:'flags',title:'Affirm Address',modes:['early','election'],
    aliases:['affirm','affirm address','affirmation','residence','returned mail','moved','change address','address change','correction','correction of record'],
    statuses:['Official Procedure','Current Morris Guidance'],
    meaning:'Board of Elections sent mail to the voter. The mail was returned for some reason and the voter must confirm the address on file. This is not an ID situation.',
    critical:'DO NOT ASK FOR ID or proof of address solely because of an Affirm Address flag.',
    decision:{question:'Does the voter still live at the address shown in the voter record?',yes:'Complete and sign the lower Affirmation of Residence portion inside the black-bordered section. Have two poll workers from differing parties sign. Continue regular check-in.',no:'Do not have the voter affirm the old address. Complete the applicable top Correction of Record section and follow Changed Residence / Address Change.'},
    steps:['Explain that Board of Elections mail was returned and the voter must confirm whether the address on file is still current.','If the address is current, complete and sign the lower Affirmation of Residence portion inside the black-bordered section.','Have two poll workers from differing parties sign the form.','Continue regular check-in when the voter remains eligible for a regular machine ballot.','Return the completed form with the election materials.'],
    notDo:['DO NOT ASK FOR ID or proof of address for the Affirm Address flag.','Do not have a voter who has moved affirm that the old address is still current.'],
    outcome:'Still at the address / same district as applicable → regular machine ballot after the required affirmation. If the voter moved, use the Changed Residence procedure; the ballot outcome depends on the move.',
    form:'Morris County Correction of Record / Affirmation of Residence combined form.',
    escalation:'Call the Board when the voter’s residence cannot be resolved from the voter’s information or the correct district/remedy is unclear.',
    procedureLinks:[{id:'record-changed-residence',label:'Open Changed Residence'},{id:'record-correction',label:'Open Correction of Record'}]
  });

  const changed=byId('record-changed-residence'); if(changed){
    changed.statuses=['Official Procedure','Needs Board Confirmation'];
    changed.procedureLinks=[{id:'record-correction',label:'Open Correction of Record'}];
  }

  const correction=byId('record-correction'); if(correction){
    correction.statuses=['Needs Board Confirmation'];
    correction.meaning='Use the current Morris County Correction of Record section to record changed voter information. The form itself does not determine the ballot type; the underlying voter situation does.';
    correction.steps=['Identify the exact information being changed or reported.','Complete only the applicable top Correction of Record section.','Use the underlying voter situation to determine the voting remedy.','Return the completed form with the election materials.'];
    correction.escalation='Board confirmation is still needed for which record changes, if any, can be fully processed at the current polling place versus requiring redirection or later Board processing.';
    correction.boardQuestion='Which Correction of Record changes can be fully handled at the current polling place, and which require redirection or later Board processing?';
  }

  const sig=byId('flag-signature'); if(sig){
    sig.statuses=['Official Procedure','Current Morris Guidance'];
    sig.steps=['Recognize this as No Signature on File, not an ordinary current-signature mismatch.','Process the voter by provisional ballot.','The signature on the provisional affirmation becomes the voter’s signature on file.'];
    sig.outcome='Provisional ballot. The provisional affirmation signature becomes the new signature on file.';
    sig.procedureLinks=[{id:'xref-provisional',label:'Open Provisional Ballot'}];
  }

  const idreq=byId('flag-id'); if(idreq){
    idreq.statuses=['Official Procedure','Needs Source Verification'];
    idreq.critical='DO NOT ASK EVERY VOTER FOR ID. Ask only when the voter record specifically shows ID Required / Active Need ID.';
    idreq.steps=['Ask for a current and valid identifying document only because the voter record specifically requires ID.','Compare the identification with the voter information and follow the ePollbook ID-recording prompt.','If acceptable ID is provided, record it as directed and continue regular check-in.','If acceptable ID is not provided, use the Not Provided path and process the voter provisionally.'];
    idreq.boardQuestion='Verify the exact selectable ID types and exact ePollbook screen sequence before those choices are listed in the app.';
    idreq.procedureLinks=[{id:'xref-provisional',label:'Open Provisional Ballot'}];
  }

  const nf=byId('flag-notfound'); if(nf){
    nf.statuses=['Current Morris Guidance','Critical'];
    nf.meaning='A failed first search does not mean the voter is unregistered. Use every available search option before escalating.';
    nf.critical='★ DO NOT SELECT VOTER NOT FOUND unless the Board of Elections instructs you to do so. ★';
    nf.steps=['Use all available voter-search options before deciding the record cannot be found.','Check spelling and likely transcription errors.','Use alternate search fields such as address, street, date of birth, or other options shown by the ePollbook.','If the voter still cannot be located, call the Board of Elections.','Do not select Voter Not Found unless the Board directs you to do so.','DO NOT begin a new voter check-in unless directed.'];
    nf.outcome='Search and Board determination first. Do not select Voter Not Found without Board direction.';
  }

  const already=byId('flag-already'); if(already){
    already.statuses=['Official Procedure','Current Morris Guidance'];
    already.meaning='The record shows the voter has already been credited as voting. The voter may leave, or dispute the record and request to vote provisionally.';
    already.steps=['Explain that the record shows the voter has already voted.','If the voter accepts that status, stop the transaction.','If the voter disputes the status and wishes to vote, process a provisional ballot.','Complete an Incident Report when the situation requires one and place it in the clear Election Day envelope or the corresponding blue transparent Early Voting day envelope.'];
    already.outcome='Voter leaves, or disputes the record and votes provisionally.';
    already.procedureLinks=[{id:'xref-provisional',label:'Open Provisional Ballot'}];
  }
  const early=byId('flag-early'); if(early){
    early.statuses=['Official Procedure','Current Morris Guidance'];
    early.meaning='The record shows the voter has already been credited through Early Voting. The voter may leave, or dispute the record and request to vote provisionally.';
    early.steps=['Explain that the record shows an Early Voting participation status.','If the voter accepts that status, stop the transaction.','If the voter disputes the status and wishes to vote, process a provisional ballot.','Complete an Incident Report when the situation requires one and place it in the clear Election Day envelope or the corresponding blue transparent Early Voting day envelope.'];
    early.outcome='Voter leaves, or disputes the record and votes provisionally.';
    early.procedureLinks=[{id:'xref-provisional',label:'Open Provisional Ballot'}];
  }

  const provisional=byId('xref-provisional'); if(provisional){
    provisional.statuses=['Official Procedure','Current Morris Guidance'];
    provisional.note='Completed provisional ballots go in the provisional bag. Supporting forms and Incident Reports are returned in the clear Election Day envelope or the corresponding blue transparent Early Voting day envelope.';
  }

  upsert({
    id:'assistance-field',category:'assistance',title:'Voter Assistance',aliases:['assist','assistance','help voter','booth assistance','provisional assistance'],modes:['early','election'],
    statuses:['Current Morris Guidance'],
    meaning:'Assistance rules depend on whether the voter brought an assistor or poll workers must provide the assistance.',
    critical:'IF POLL WORKERS ENTER THE VOTING BOOTH TO ASSIST, TWO POLL WORKERS FROM DIFFERING PARTIES MUST REMAIN PRESENT FOR THE ENTIRE ASSISTANCE.',
    steps:['If the voter brings their own assistor and the assistor is under 18, no assistance form is required under current Morris practice.','If the voter brings their own assistor and the assistor is 18 or older, complete the assistance form; one assistor is sufficient.','If poll workers provide assistance, use two poll workers from differing parties and have them sign the assistance form.','The same two-worker rule applies when poll workers actually assist a voter through completion of a provisional ballot.','Simple verbal guidance from outside the booth, or showing how to insert the activation card before voting begins, is not treated as booth assistance.','If poll workers must enter the booth or physically guide the voting process, two differing-party poll workers must be present. If one leaves, stop until the second worker returns.','Return the assistance form in the clear Election Day envelope or the corresponding blue transparent Early Voting day envelope.'],
    notDo:['Do not view or discuss the voter’s selections unless required for the requested assistance.','Do not allow one poll worker to remain alone in the booth while assisting a voter.'],
    tip:'Master Poll Worker Tip: verbal communication can sometimes be given from outside the machine through the side gap without entering the booth or seeing the voter’s selections.',
    outcome:'The voter continues with the appropriate ballot while receiving only the assistance requested.'
  });

  upsert({
    id:'primary-field',category:'primary',title:'Primary Election — Party Declaration',aliases:['primary','unaffiliated','declare party','party affiliation','democrat','republican'],modes:['early','election'],
    statuses:['Current Morris Guidance','Needs State Timing Verification'],
    meaning:'In a New Jersey primary, an affiliated voter receives that party’s ballot. An unaffiliated voter must choose Democratic or Republican to vote in that primary.',
    steps:['If the voter is already affiliated Democratic or Republican, complete check-in for that party; the activation-card barcode causes the corresponding party ballot to display on the voting machine.','If the voter is unaffiliated, the ePollbook offers a party choice. If the voter declines to choose a party, cancel the check-in and the voter does not vote in that primary.','If the unaffiliated voter chooses Democratic or Republican, complete check-in for that party and issue the activation card.','After voting, explain that the voter remains affiliated with the chosen party unless they later change affiliation.','To change affiliation afterward, the voter may complete the paper voter-registration/party-affiliation form and hand it back to poll workers, mail the folded form using its pre-addressed postage-paid mailer, or deliver it to the Board of Elections. The voter may also complete the change online.','Paper forms returned at the polling location go in the clear Election Day envelope or the corresponding blue transparent Early Voting day envelope.'],
    tip:'Master Poll Worker Tip: if a voter uses the online form on a phone, turning the phone to landscape can provide more room for the signature field.',
    boardQuestion:'Verify the exact effective timing of a post-primary party-affiliation change, including a return to unaffiliated status.',
    outcome:'The voter sees and votes only the ballot for the party assigned during check-in.'
  });

  upsert({
    id:'equipment-escalation',category:'equipment',title:'Equipment Escalation',aliases:['machine problem','printer problem','epollbook problem','warehouse','board','technical issue'],modes:['early','election'],
    statuses:['Current Morris Guidance'],
    meaning:'Use the approved troubleshooting steps first, then escalate to the correct support path when the problem remains unresolved or the instructions say to call.',
    steps:['Voting-machine abnormality or machine hardware issue → call the Machine Warehouse.','ePollbook, voter-record, printer, or voter-processing issue → call the Board of Elections.','General operational question → Master Poll Worker or Board of Elections as appropriate.','Do not improvise past a troubleshooting step that specifically directs you to call.'],
    outcome:'Board, Master/Tech worker, runner, or warehouse staff handles the next escalation as appropriate.'
  });

  // Replace outdated Board queue with the short verification list retained from the review pass.
  fieldData.boardQueue=[
    'ID Required: verify exact acceptable/selectable ID types and exact ePollbook screen sequence.',
    'Changed Residence: verify remaining out-of-county and timing/date edge cases.',
    'Correction of Record: identify which changes can be fully handled at the current polling place versus later Board processing or redirection.',
    'Primary affiliation: verify exact effective timing of a post-primary affiliation change, including return to unaffiliated status.'
  ];

  function specialBlock(label,text,cls='procedure-note'){
    return text?`<section class="${cls}"><strong>${esc(label)}</strong><p>${esc(text)}</p></section>`:'';
  }
  function procLinkMarkup(item){
    return (item.procedureLinks||[]).map(link=>`<button class="cross-link procedure-jump" data-procedure-jump="${esc(link.id)}">${esc(link.label||'Open Procedure')}</button>`).join('');
  }
  fieldProcedureMarkup=function(item){
    const shared=item.sharedProcedure?data.procedures.find(p=>p.id===item.sharedProcedure):null;
    const status=badges(item.statuses||[]),steps=item.steps||shared?.steps||[],warning=item.warning||shared?.warning;
    return `<article class="card field-procedure" id="field-${esc(item.id)}" data-field-procedure="${esc(item.id)}">
      <h3>${esc(item.title)}</h3>${status}<p class="summary">${esc(item.meaning||shared?.summary||'')}</p>
      ${item.critical?`<div class="procedure-critical">${esc(item.critical)}</div>`:''}${warning?`<div class="warning-box">${esc(warning)}</div>`:''}
      ${item.decision?`<section class="field-section"><h4>Decision Point</h4><p><strong>${esc(item.decision.question)}</strong></p><div class="decision-split"><div class="decision-choice"><strong>YES</strong>${esc(item.decision.yes.replace(/^YES → /,''))}</div><div class="decision-choice"><strong>NO</strong>${esc(item.decision.no.replace(/^NO → /,''))}</div></div></section>`:''}
      ${steps.length?`<section class="field-section"><h4>What To Do</h4><ol>${steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`:''}
      ${item.notDo?.length?`<section class="field-section"><h4>What NOT To Do</h4><ul>${item.notDo.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`:''}
      ${item.outcome?`<section class="field-section"><h4>Voting Outcome</h4><div class="outcome-box">${esc(item.outcome)}</div></section>`:''}
      ${item.form?`<section class="field-section"><h4>Required Form</h4><p>${esc(item.form)}</p></section>`:''}
      ${specialBlock('Master Poll Worker Tip',item.tip,'procedure-tip')}${specialBlock('Operational Note',item.note)}
      ${item.escalation?`<section class="field-section"><h4>When To Call the Board</h4><p>${esc(item.escalation)}</p></section>`:''}
      ${item.boardQuestion?`<section class="field-section board-confirm"><h4>Needs Confirmation</h4><p>${esc(item.boardQuestion)}</p></section>`:''}
      ${sourceMarkup(item.source)}
      <div class="cross-links">${procLinkMarkup(item)}${item.relatedGuide?`<button class="cross-link" data-open-guide="${esc(item.relatedGuide)}">Open Guide Topic</button>`:''}${shared?`<button class="cross-link" data-open-shared="${esc(shared.id)}">Open Shared Procedure</button>`:''}</div>
      ${item.aliases?.length?`<div class="alias-line">Lookup aliases: ${item.aliases.map(esc).join(' · ')}</div>`:''}
    </article>`;
  };

  function openFieldProcedure(id,push=true){
    const item=fieldData.items.find(x=>x.id===id); if(!item)return;
    if(push){state.procedureHistory=state.procedureHistory||[];state.procedureHistory.push({category:state.procedureCategory,scrollY:window.scrollY});}
    state.route='procedures'; state.procedureCategory=item.category; state.procedureTarget=id; saveState(); render();
    requestAnimationFrame(()=>document.getElementById(`field-${id}`)?.scrollIntoView({block:'start',behavior:'auto'}));
  }
  function goProcedureBack(){
    const stack=state.procedureHistory||[]; const prev=stack.pop(); state.procedureHistory=stack;
    if(prev){state.procedureCategory=prev.category;state.procedureTarget=null;saveState();render();requestAnimationFrame(()=>window.scrollTo(0,prev.scrollY||0));}
    else {state.procedureTarget=null;saveState();render();window.scrollTo(0,0);}
  }

  const baseRenderProcedures=renderProcedures;
  renderProcedures=function(){
    const html=baseRenderProcedures();
    return `<div class="procedure-nav-row"><button class="procedure-back" data-procedure-back>‹ Back</button><span class="small">Swipe right to go back</span></div>${html}`;
  };

  const previousBind=bindDynamic;
  bindDynamic=function(){
    previousBind();
    document.querySelectorAll('[data-procedure-jump]').forEach(b=>b.onclick=()=>openFieldProcedure(b.dataset.procedureJump,true));
    document.querySelectorAll('[data-procedure-back]').forEach(b=>b.onclick=goProcedureBack);
    if(state.route==='procedures'){
      let sx=0,sy=0,tracking=false;
      main.ontouchstart=e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;tracking=true;};
      main.ontouchend=e=>{if(!tracking)return;tracking=false;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(dx>85&&Math.abs(dx)>Math.abs(dy)*1.35)goProcedureBack();};
    } else {main.ontouchstart=null;main.ontouchend=null;}
  };

  render();
})();
