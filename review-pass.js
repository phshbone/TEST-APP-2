// Live phone-review fixes layered over the reconciliation demo without altering the source app.
(function(){
  const GUIDE_TO_TRAINING={checkin:'Standard voter check-in'};
  let returnProcedureId=null;

  function updateChromeHeights(){
    const top=document.querySelector('.topbar');
    const mode=document.querySelector('.mode-strip');
    const nav=document.querySelector('.bottom-nav');
    const root=document.documentElement;
    if(top) root.style.setProperty('--mpw-fixed-header-h',`${Math.ceil(top.getBoundingClientRect().height)}px`);
    if(mode) root.style.setProperty('--mpw-fixed-mode-h',`${Math.ceil(mode.getBoundingClientRect().height)}px`);
    if(nav) root.style.setProperty('--mpw-fixed-nav-h',`${Math.ceil(nav.getBoundingClientRect().height)}px`);
  }

  function ensureStatusArray(obj){
    if(!obj) return [];
    if(!Array.isArray(obj.statuses)) obj.statuses=obj.status?[obj.status]:[];
    obj.statuses=[...new Set(obj.statuses.filter(Boolean))];
    return obj.statuses;
  }
  function canonicalLessonStatus(statuses){
    if(statuses.includes('live')) return 'live';
    if(statuses.includes('explained')) return 'explained';
    if(statuses.includes('review')) return 'review';
    if(statuses.includes('notReached')) return 'notReached';
    return '';
  }
  function canonicalTrainingStatus(statuses){
    if(statuses.includes('live')) return 'live';
    if(statuses.includes('covered')) return 'covered';
    if(statuses.includes('review')) return 'review';
    if(statuses.includes('notReached')) return 'notReached';
    return '';
  }

  function syncGuideCheckinToTraining(){
    if(!window.state||!window.data) return;
    const idx=data.trainingTopics.indexOf(GUIDE_TO_TRAINING.checkin);
    if(idx<0) return;
    const union=new Set();
    Object.entries(state.lessonStatus||{}).forEach(([key,value])=>{
      if(!key.startsWith('checkin:')) return;
      ensureStatusArray(value).forEach(s=>union.add(s));
    });
    const mapped=[];
    if(union.has('explained')) mapped.push('covered');
    if(union.has('live')) mapped.push('live');
    if(union.has('review')) mapped.push('review');
    if(union.has('notReached')) mapped.push('notReached');
    state.training[idx] ||= {};
    state.training[idx].statuses=mapped;
    state.training[idx].status=canonicalTrainingStatus(mapped);
  }

  function syncTrainingCheckinToGuide(trainingStatuses){
    const p=data.procedures.find(x=>x.id==='checkin');
    if(!p?.lessons) return;
    const mapped=[];
    if(trainingStatuses.includes('covered')) mapped.push('explained');
    if(trainingStatuses.includes('live')) mapped.push('live');
    if(trainingStatuses.includes('review')) mapped.push('review');
    if(trainingStatuses.includes('notReached')) mapped.push('notReached');
    p.lessons.forEach(lesson=>{
      const key=`checkin:${lesson.id}`;
      state.lessonStatus[key] ||= {};
      state.lessonStatus[key].statuses=[...mapped];
      state.lessonStatus[key].status=canonicalLessonStatus(mapped);
    });
  }

  function markMultiButtons(){
    document.querySelectorAll('[data-lesson-status]').forEach(button=>{
      const key=button.dataset.lessonStatus;
      const statuses=ensureStatusArray(state.lessonStatus?.[key]);
      button.classList.toggle('active',statuses.includes(button.dataset.status));
      button.classList.toggle('multipick-active',statuses.includes(button.dataset.status));
    });
    document.querySelectorAll('.training-card .status-button').forEach(button=>{
      const card=button.closest('.training-card');
      const i=card?.dataset.topic;
      if(i==null) return;
      const statuses=ensureStatusArray(state.training?.[i]);
      button.classList.toggle('active',statuses.includes(button.dataset.status));
      button.classList.toggle('multipick-active',statuses.includes(button.dataset.status));
    });
  }

  function refreshGuideProgress(){
    if(state.route!=='guide') return;
    document.querySelectorAll('[data-procedure]').forEach(card=>{
      const id=card.dataset.procedure;
      const p=data.procedures.find(x=>x.id===id); if(!p) return;
      const total=typeof guideStepCount==='function'?guideStepCount(p):(p.lessons?.length||p.steps?.length||0);
      const done=typeof guideDoneCount==='function'?guideDoneCount(p):0;
      const pill=card.querySelector('.guide-progress-pill');
      if(pill){
        const complete=total>0&&done===total;
        pill.textContent=`★ ${complete?'Complete':`${done} of ${total}`}`;
        pill.classList.toggle('complete',complete);
      }
    });
  }

  function bindMultiStatus(){
    document.querySelectorAll('[data-lesson-status]').forEach(button=>{
      button.onclick=(e)=>{
        e.preventDefault();e.stopPropagation();
        const key=button.dataset.lessonStatus,choice=button.dataset.status;
        state.lessonStatus[key] ||= {};
        const statuses=ensureStatusArray(state.lessonStatus[key]);
        const pos=statuses.indexOf(choice);
        if(pos>=0) statuses.splice(pos,1); else statuses.push(choice);
        state.lessonStatus[key].statuses=statuses;
        state.lessonStatus[key].status=canonicalLessonStatus(statuses);
        syncGuideCheckinToTraining();
        saveState();
        markMultiButtons();
        refreshGuideProgress();
      };
    });

    document.querySelectorAll('.training-card .status-button').forEach(button=>{
      button.onclick=(e)=>{
        e.preventDefault();e.stopPropagation();
        const card=button.closest('.training-card');
        const i=Number(card.dataset.topic),choice=button.dataset.status;
        state.training[i] ||= {};
        const statuses=ensureStatusArray(state.training[i]);
        const pos=statuses.indexOf(choice);
        if(pos>=0) statuses.splice(pos,1); else statuses.push(choice);
        state.training[i].statuses=statuses;
        state.training[i].status=canonicalTrainingStatus(statuses);
        if(data.trainingTopics[i]===GUIDE_TO_TRAINING.checkin) syncTrainingCheckinToGuide(statuses);
        saveState();
        markMultiButtons();
      };
    });
  }

  function scoreLookup(item,q){
    const title=String(item.title||'').toLowerCase();
    const aliases=(item.aliases||[]).map(x=>String(x).toLowerCase());
    const words=title.split(/[^a-z0-9]+/).filter(Boolean);
    let score=0;
    if(title===q) score+=1000;
    if(title.startsWith(q)) score+=600;
    if(words.some(w=>w.startsWith(q))) score+=450;
    aliases.forEach(a=>{if(a===q)score+=700;else if(a.startsWith(q))score+=400;else if(a.includes(q))score+=180;});
    if(title.includes(q)) score+=220;
    if(JSON.stringify(item).toLowerCase().includes(q)) score+=20;
    return score;
  }

  if(typeof renderLookup==='function'){
    renderLookup=function(){
      const q=(state.lookupQuery||'').trim().toLowerCase();
      const procedures=q?fieldData.items.filter(p=>p.modes.includes(state.mode)&&JSON.stringify(p).toLowerCase().includes(q)).sort((a,b)=>scoreLookup(b,q)-scoreLookup(a,q)):[];
      const guide=q?data.procedures.filter(p=>p.modes.includes(state.mode)&&JSON.stringify(p).toLowerCase().includes(q)).sort((a,b)=>scoreLookup(b,q)-scoreLookup(a,q)):[];
      title.textContent='Quick Lookup';
      const card=(layer,item,attr)=>`<button class="card lookup-result-card" ${attr}><span class="lookup-layer">${esc(layer)}</span><strong>${esc(item.title)}</strong><span>${esc(item.meaning||item.summary||'Open result')}</span></button>`;
      const groups=[];
      if(procedures.length)groups.push(`<section class="lookup-group"><h3>Procedures</h3><p class="small">Live field answers: what just happened and what do I do now?</p>${procedures.map(p=>card('Procedure',p,`data-lookup-procedure="${esc(p.id)}"`)).join('')}</section>`);
      if(guide.length)groups.push(`<section class="lookup-group"><h3>Guide</h3><p class="small">Training and checklist material.</p>${guide.map(p=>card('Guide',p,`data-lookup-guide="${esc(p.id)}"`)).join('')}</section>`);
      return `${pageHeading('Quick Lookup','Search once, then jump directly to the most relevant Guide or Procedure.')}<input id="lookupInput" class="search-box" placeholder="Search affirm, assistance, moved, reprint, spoil…" value="${esc(state.lookupQuery||'')}"><div style="height:12px"></div>${!q?'<div class="card empty">Type the voter situation or procedure you are looking for.</div>':groups.length?groups.join(''):'<div class="card empty">No matching Guide or Procedure.</div>'}`;
    };
  }

  function addReprintSecondaryPath(){
    const item=fieldData.items.find(x=>x.id==='xref-reprint')||fieldData.items.find(x=>x.id==='reprint-field');
    if(!item||item.__secondaryAdded) return;
    item.steps=item.steps||[];
    const text='If the completed check-in screen still offers a Reprint option, use that on-screen Reprint path there instead of leaving the transaction to open the separate Re-Print menu.';
    if(!item.steps.some(x=>String(x).includes('completed check-in screen'))) item.steps.splice(1,0,text);
    item.__secondaryAdded=true;
  }

  function installReturnToProcedure(){
    if(state.route==='procedures'){
      const target=state.procedureTarget||document.querySelector('.field-procedure')?.dataset.fieldProcedure;
      if(target) returnProcedureId=target;
      return;
    }
    if(state.route==='guide'&&returnProcedureId){
      const mainEl=document.getElementById('mainContent');
      if(!mainEl||mainEl.querySelector('.return-to-procedure')) return;
      const b=document.createElement('button');
      b.className='return-to-procedure';
      b.textContent='← Return to Procedure';
      b.onclick=()=>{
        const id=returnProcedureId;
        const item=fieldData.items.find(x=>x.id===id);
        state.route='procedures';
        if(item) state.procedureCategory=item.category;
        state.procedureTarget=id;
        saveState();render();
        requestAnimationFrame(()=>document.getElementById(`field-${id}`)?.scrollIntoView({block:'start',behavior:'auto'}));
      };
      mainEl.insertBefore(b,mainEl.firstChild);
    }
  }

  function installTopButton(){
    let b=document.getElementById('floatingTopButton');
    if(!b){
      b=document.createElement('button');b.id='floatingTopButton';b.className='floating-top-button';b.type='button';b.setAttribute('aria-label','Back to top');b.textContent='↑';
      b.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});document.body.appendChild(b);
    }
    const sync=()=>b.classList.toggle('visible',window.scrollY>500);
    window.removeEventListener('scroll',window.__mpwTopSync||(()=>{}));
    window.__mpwTopSync=sync;window.addEventListener('scroll',sync,{passive:true});sync();
  }

  addReprintSecondaryPath();
  const baseRender=render;
  render=function(){
    baseRender();
    requestAnimationFrame(()=>{
      updateChromeHeights();
      bindMultiStatus();
      markMultiButtons();
      installReturnToProcedure();
      installTopButton();
    });
  };

  window.addEventListener('resize',updateChromeHeights,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(updateChromeHeights,120),{passive:true});
  requestAnimationFrame(()=>{updateChromeHeights();bindMultiStatus();markMultiButtons();installReturnToProcedure();installTopButton();});
})();
