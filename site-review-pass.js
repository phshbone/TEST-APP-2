// Site-wide review pass: mode-specific Do/Don'ts, Election Day opening cross-link, and escalation routing.
(function(){
  const app=window.APP_DATA;
  const field=window.FIELD_PROCEDURES;
  if(!app || !field) return;

  const sharedDos=[
    {text:'Confirm the correct voter record before continuing.',detail:'Use voter-stated information such as address or date of birth to distinguish similar records.',tags:['Official Procedure','Check-In'],modes:['early','election']},
    {text:'Review every voter flag and follow the specific remedy.',detail:'Different flags can lead to different outcomes; do not treat them as interchangeable.',tags:['Official Procedure','Check-In'],modes:['early','election']},
    {text:'Confirm one blank activation card is loaded before completing check-in.',detail:'A missing preload is recovered through Reprint after check-in is complete.',tags:['Current Morris Update','Check-In'],modes:['early','election']},
    {text:'Stop and ask the Master Poll Worker or Board before improvising.',detail:'Escalation is safer than creating a duplicate record or using the wrong ballot process.',tags:['Official Procedure','Same for Both'],modes:['early','election']}
  ];
  const sharedDonts=[
    {text:'Do not ask every voter for identification.',detail:'Request identification only when the voter record shows Voter ID Required.',tags:['Official Do Not','Check-In'],modes:['early','election']},
    {text:'Do not select Voter Not Found without express Board direction.',detail:'Continue searching and escalate before beginning any new-record process.',tags:['Critical','Same for Both'],modes:['early','election']},
    {text:'Do not check a voter in a second time to recover a missing printout.',detail:'Use Reprint when the original check-in is already complete.',tags:['Current Morris Update','Reprint'],modes:['early','election']},
    {text:'Do not confuse Reprint with Spoil.',detail:'Reprint recovers a missing printed item; Spoil cancels an uncast ballot card.',tags:['Current Morris Update','Same for Both'],modes:['early','election']}
  ];

  app.dosDonts={
    dos:[
      {text:'Report to your Early Voting location by 9:00 AM.',detail:'Early Voting poll workers are expected at the location by 9:00 AM and remain through the 8:00 PM close and required closing work.',tags:['Early Voting','Reporting Time'],modes:['early']},
      {text:'Follow the current Early Voting screen and secured binder instructions in order.',detail:'Stop when a screen, seal, report, number, or physical setup differs from expectations.',tags:['Early Voting','Official Procedure'],modes:['early']},
      {text:'Report to your Election Day polling location at 5:00 AM.',detail:'Election Day poll workers are expected at the polling location at 5:00 AM and remain through the 8:00 PM close and required closing work.',tags:['Election Day','Reporting Time'],modes:['election']},
      {text:'Use the Election Day opening sequence and official manuals.',detail:'Election Day opening uses the Maroon Bag, Red Bag, numbered Key Envelopes, voting-machine setup, and ePollbook setup—not the Early Voting binder workflow.',tags:['Election Day','Opening'],modes:['election']},
      ...sharedDos
    ],
    donts:[
      ...sharedDonts,
      {text:'Do not select Close Poll during an intermediate Early Voting night.',detail:'Use the secured nightly shutdown path in the current binder.',tags:['Critical','Early Voting'],modes:['early']},
      {text:'Do not be late.',detail:'Early Voting workers must report by 9:00 AM.',tags:['Early Voting','Reporting Time'],modes:['early']},
      {text:'Do not be late.',detail:'Election Day workers must report at 5:00 AM.',tags:['Election Day','Reporting Time'],modes:['election']}
    ]
  };

  const edOpening=app.procedures.find(p=>p.id==='opening' && p.modes?.includes('election'));
  const identify=edOpening?.lessons?.find(l=>l.id==='identify-machines');
  if(identify?.tips){
    identify.tips=identify.tips.map(t=>t.includes('may be in separate small manila Key Envelopes')
      ? 'The machine keys will be in separate small manila Key Envelopes labeled with the corresponding machine number. Match the label before opening the machine.'
      : t);
  }

  const openingField=field.items.find(i=>i.category==='openclose' && i.sharedProcedure==='opening');
  if(openingField){
    openingField.modes=['early'];
    if(!field.items.some(i=>i.id==='opening-election-day')){
      const insertAt=field.items.indexOf(openingField)+1;
      field.items.splice(insertAt,0,{
        id:'opening-election-day',category:'openclose',title:'Election Day Opening',aliases:['election day opening','open polls','5 am setup'],modes:['election'],
        statuses:['Election Day','Official Procedure + Master Worker Field Guidance'],
        meaning:'Use the Election Day-specific opening sequence. Do not use the Early Voting secured-binder workflow for Election Day opening.',
        warning:'Voting machines must use a working wall outlet. Never plug a voting machine into the yellow extension reel or an ePollbook power strip.',
        steps:['Report at 5:00 AM and organize workers.','Identify the correct machines and numbered Key Envelopes from the Red Bag in the Maroon Bag.','Power the location router first when present.','Complete voting-machine physical setup and opening from the official manual.','Wire and configure one ePollbook station at a time.','Complete required oath, signage, paperwork, and final readiness checks.'],
        relatedGuide:'opening'
      });
    }
  }

  if(!field.items.some(i=>i.id==='who-to-call-routing')){
    const firstEquipment=field.items.findIndex(i=>i.category==='equipment');
    const routing={
      id:'who-to-call-routing',category:'equipment',title:'Who to Call — Equipment & Voter Issues',aliases:['who to call','machine warehouse','board number','ePollbook help','voter help'],modes:['early','election'],
      statuses:['Confirmed Morris County Contact Routing','Critical'],
      meaning:'Route the call by the type of problem instead of calling an individual staff member directly.',
      warning:'VOTING MACHINE ISSUE → Machine Warehouse: (973) 285-6741. ePOLLBOOK OR VOTER ISSUE → Board of Elections main number: (973) 285-6715.',
      steps:['For any voting-machine-related problem, call the Machine Warehouse at (973) 285-6741.','For any ePollbook-related problem, call the Board of Elections main number at (973) 285-6715.','For any voter-related question or eligibility/procedure issue, call the Board of Elections main number at (973) 285-6715.','Use the main Board number so the call can be routed to the appropriate person rather than choosing an individual staff member yourself.'],
      notDo:['Do not guess which individual Board employee should handle an ePollbook or voter issue.','Do not route a voting-machine problem to the general Board line when the Machine Warehouse is the appropriate contact.']
    };
    field.items.splice(firstEquipment>=0?firstEquipment:field.items.length,0,routing);
  }

  window.renderDosDonts=function(){
    title.textContent='Official Do’s & Don’ts';
    const mode=state.mode;
    const modeItems=items=>items.filter(item=>!item.modes || item.modes.includes(mode));
    const renderItems=(items,type)=>modeItems(items).map((item,i)=>`<article class="rule-card ${type}">
      <button class="rule-toggle" data-rule-toggle="${type}-${i}" aria-expanded="false"><span class="rule-icon">${type==='do'?'DO':'DON’T'}</span><strong>${esc(item.text)}</strong><span class="chevron rule-plusminus" aria-hidden="true"></span></button>
      <div class="rule-detail"><p>${esc(item.detail)}</p>${badges(item.tags)}</div>
    </article>`).join('');
    return `${pageHeading('Official Do’s & Don’ts',`${modeLabel()} reminders. Tap + to expand an explanation.`)}
      <section class="card rules-section"><h3 class="do-heading">DO</h3>${renderItems(app.dosDonts.dos,'do')}</section>
      <section class="card rules-section"><h3 class="dont-heading">DON’T</h3>${renderItems(app.dosDonts.donts,'dont')}</section>`;
  };

  // Do/Don'ts stays in More; Quick Lookup is the final More item. The bottom dock remains the five core routes.
  const menu=document.getElementById('sideMenu');
  if(menu && !menu.querySelector('[data-route="lookup"]')){
    const lookup=document.createElement('button');
    lookup.type='button';
    lookup.dataset.route='lookup';
    lookup.textContent='Quick Lookup';
    lookup.onclick=()=>setRoute('lookup');
    menu.appendChild(lookup);
  }

  render();
})();
