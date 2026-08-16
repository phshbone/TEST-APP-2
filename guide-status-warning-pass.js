// Explicit Guide training-status controls for every standard checklist section + concise critical warnings.
(function(){
  const TOPIC_MAP={
    opening:['Opening and worker orientation','Numbered station setup'],
    morning:[],
    shutdown:[],
    mailin:['Mail-In Ballot'],
    notfound:['Voter Not Found'],
    provisional:['Provisional ballots'],
    reprint:['Reprint'],
    spoil:['Spoil']
  };
  // Every non-teaching Guide procedure receives its own evaluation block.
  const SECTION_IDS=new Set((data.procedures||[]).filter(p=>p.type!=='teaching').map(p=>p.id));
  const choices=[['covered','Covered'],['live','Demonstrated Live'],['review','Needs Review'],['notReached','Not Reached']];
  state.guideSectionTraining=state.guideSectionTraining||{};
  function vals(id){const o=state.guideSectionTraining[id]||{};return Array.isArray(o.statuses)?o.statuses:(o.status?[o.status]:[])}
  function canonical(a){return a.includes('live')?'live':a.includes('covered')?'covered':a.includes('review')?'review':a.includes('notReached')?'notReached':''}
  function controls(id){
    if(!SECTION_IDS.has(id))return '';
    const a=vals(id);
    return `<section class="guide-section-training"><p class="section-label">Training status</p><div class="status-grid compact">${choices.map(([k,l])=>`<button type="button" class="status-button ${a.includes(k)?'multi-active':''}" data-guide-section-status="${id}" data-status="${k}" aria-pressed="${a.includes(k)}">${l}</button>`).join('')}</div></section>`;
  }
  function sync(id){
    const a=vals(id);(TOPIC_MAP[id]||[]).forEach(topic=>{
      const i=data.trainingTopics.indexOf(topic);if(i<0)return;
      state.training[i]=state.training[i]||{};
      const manual=(Array.isArray(state.training[i].statuses)?state.training[i].statuses:[]).filter(x=>!(state.training[i].__sectionStatuses||[]).includes(x));
      const merged=[...new Set([...manual,...a])];
      state.training[i].__sectionStatuses=[...a];state.training[i].statuses=merged;state.training[i].status=canonical(merged);
    });
  }
  SECTION_IDS.forEach(sync);

  function pilotCopilotBlock(id){
    if(id!=='opening'&&id!=='shutdown')return '';
    const phase=id==='opening'?'setup and opening':'shutdown and closing';
    return `<section class="teaching-block official pilot-copilot-block">
      <h5>PILOT / CO-PILOT METHOD</h5>
      <p><strong>Morris County Training — foundational operating method</strong></p>
      <p>For ${phase}, one poll worker acts as the <strong>Pilot</strong> and reads each instruction aloud, in order. The other poll workers act as <strong>Co-Pilots</strong>: they follow along and perform the matching step on the ePollbooks, printers, voting machines, seals, and other equipment.</p>
      <ul>
        <li>One person reads; everyone follows the same instruction before moving on.</li>
        <li>Workers may divide the physical tasks, but nobody advances ahead of the reader.</li>
        <li>A second worker may collect used seals or materials while the group stays on the same sequence.</li>
        <li>If a screen, seal, number, report, or setup does not match the instruction, stop and resolve it before continuing.</li>
      </ul>
    </section>`;
  }

  if(typeof standardProcedureMarkup==='function'){
    const base=standardProcedureMarkup;
    standardProcedureMarkup=function(p,expanded=false){
      let html=base(p,expanded);
      const pilot=pilotCopilotBlock(p.id);
      if(pilot&&!html.includes('pilot-copilot-block')){
        const detail=html.indexOf('<div class="procedure-detail">');
        if(detail>=0){
          const at=detail+'<div class="procedure-detail">'.length;
          html=`${html.slice(0,at)}${pilot}${html.slice(at)}`;
        }
      }
      const c=controls(p.id);
      if(c&&!html.includes(`data-guide-section-status="${p.id}"`)){
        const close=html.lastIndexOf('</div></section>');
        if(close>=0)html=`${html.slice(0,close)}${c}${html.slice(close)}`;
      }
      return html;
    };
  }

  // Keep the same principle visible in the fast pre-opening reminder.
  if(data.dosDonts?.dos&&!data.dosDonts.dos.some(x=>/pilot\s*\/\s*co-pilot/i.test(x.text||''))){
    data.dosDonts.dos.unshift({
      text:'Use the Pilot / Co-Pilot method for setup, opening, shutdown, and closing.',
      detail:'One poll worker reads each instruction aloud. Everyone else performs the matching step and waits for the group before advancing.',
      tags:['Current Morris Guidance','Opening / Closing']
    });
  }

  const warningMap={
    shutdown:['★ DO NOT SELECT CLOSE POLL ★','During an ordinary intermediate Early Voting night, follow the nightly shutdown procedure instead.'],
    notfound:['★ DO NOT SELECT VOTER NOT FOUND ★','Do not select it unless the Board of Elections expressly directs you to do so.'],
    reprint:['★ DO NOT CHECK THE VOTER IN AGAIN ★','Use Reprint to recover the missing item from the completed check-in.']
  };
  Object.entries(warningMap).forEach(([id,[head,body]])=>{const p=data.procedures.find(x=>x.id===id);if(p)p.warning=`${head}\n${body}`;});
  const affirm=fieldData.items.find(x=>x.id==='flag-affirm-address');if(affirm)affirm.critical='★ DO NOT ASK FOR ID ★\nDo not ask for ID or proof of address solely because of an Affirm Address flag.';
  const idreq=fieldData.items.find(x=>x.id==='flag-id');if(idreq)idreq.critical='★ DO NOT ASK EVERY VOTER FOR ID ★\nAsk only when the voter record specifically shows ID Required.';
  const nf=fieldData.items.find(x=>x.id==='flag-notfound');if(nf)nf.critical='★ DO NOT SELECT VOTER NOT FOUND ★\nDo not select it unless the Board of Elections expressly directs you to do so.';

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-guide-section-status]');if(!b)return;
    e.preventDefault();e.stopPropagation();
    const id=b.dataset.guideSectionStatus,k=b.dataset.status;
    state.guideSectionTraining[id]=state.guideSectionTraining[id]||{};
    const a=vals(id);const i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);
    state.guideSectionTraining[id].statuses=a;state.guideSectionTraining[id].status=canonical(a);sync(id);saveState();
    document.querySelectorAll(`[data-guide-section-status="${CSS.escape(id)}"]`).forEach(x=>{
      const on=a.includes(x.dataset.status);x.classList.toggle('multi-active',on);x.setAttribute('aria-pressed',String(on));
    });
  },true);

  const prior=render;render=function(){SECTION_IDS.forEach(sync);prior();};
  saveState();render();
})();
