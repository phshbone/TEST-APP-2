// Phone walkthrough fixes — TEST-APP-2 only.
(function(){
  const has=(obj,key)=>{
    if(!obj) return false;
    if(Array.isArray(obj.statuses)) return obj.statuses.includes(key);
    return obj.status===key;
  };
  const list=obj=>{
    if(!obj) return [];
    if(Array.isArray(obj.statuses)) return [...new Set(obj.statuses)];
    return obj.status?[obj.status]:[];
  };
  const syncPrimary=(obj,completeKeys)=>{
    const s=list(obj);
    obj.statuses=s;
    obj.status=s.find(x=>completeKeys.includes(x))||s[0]||'';
  };
  const toggleStatus=(obj,key,completeKeys)=>{
    const s=new Set(list(obj));
    s.has(key)?s.delete(key):s.add(key);
    obj.statuses=[...s];
    syncPrimary(obj,completeKeys);
  };

  function syncChrome(){
    const top=document.querySelector('.topbar');
    const mode=document.querySelector('.mode-strip');
    if(top) document.documentElement.style.setProperty('--mpw-topbar-h',`${Math.ceil(top.getBoundingClientRect().height)}px`);
    if(mode) document.documentElement.style.setProperty('--mpw-mode-h',`${Math.ceil(mode.getBoundingClientRect().height)}px`);
  }
  syncChrome();
  addEventListener('resize',syncChrome,{passive:true});
  if(window.visualViewport) visualViewport.addEventListener('resize',syncChrome,{passive:true});
  if(window.ResizeObserver){const ro=new ResizeObserver(syncChrome);document.querySelectorAll('.topbar,.mode-strip').forEach(x=>ro.observe(x));}

  // Populate Vote-by-Mail from the already reconciled mail-in procedure if the category has no card.
  try{
    const vbmCat=fieldData.categories.find(c=>/vote.?by.?mail|mail.?in/i.test(`${c.title} ${c.description||''}`));
    if(vbmCat && !fieldData.items.some(x=>x.category===vbmCat.id)){
      const sourceItem=fieldData.items.find(x=>/mail.?in|vote.?by.?mail/i.test(`${x.title||''} ${(x.aliases||[]).join(' ')} ${x.meaning||''}`));
      if(sourceItem){
        fieldData.items.push({...sourceItem,id:'vbm-field',category:vbmCat.id,title:'Vote-by-Mail / Mail-In Ballot',aliases:[...(sourceItem.aliases||[]),'vote by mail','mail-in ballot','vbm']});
      }
    }
  }catch(e){}

  // Guide completion should understand multi-select lesson statuses.
  if(typeof guideDoneCount==='function'){
    guideDoneCount=function(p){
      if(p.type==='teaching') return (p.lessons||[]).filter(lesson=>{
        const st=state.lessonStatus[`${p.id}:${lesson.id}`];
        return has(st,'explained')||has(st,'live');
      }).length;
      const progress=state.procedureProgress[p.id]||{};
      return (p.steps||[]).filter((_,i)=>!!progress[i]).length;
    };
  }

  if(typeof lessonStatusControls==='function'){
    lessonStatusControls=function(procedureId,lesson){
      const key=`${procedureId}:${lesson.id}`;
      const item=state.lessonStatus[key]||{};
      const choices=[['explained','Explained'],['live','Demonstrated Live'],['review','Needs Review'],['notReached','Not Reached']];
      return `<div class="lesson-status"><p class="section-label">Training status</p><div class="status-grid compact">${choices.map(([k,l])=>`<button class="status-button ${has(item,k)?'multi-active':''}" data-lesson-status="${key}" data-status="${k}" aria-pressed="${has(item,k)}">${l}</button>`).join('')}</div></div>`;
    };
  }

  // Keep expanded checklist sections open after a checkbox causes a render.
  if(typeof standardProcedureMarkup==='function'){
    const baseStandard=standardProcedureMarkup;
    standardProcedureMarkup=function(p,expanded=false){
      const keep=!!state.guideExpanded?.[p.id];
      return baseStandard(p,expanded||keep);
    };
  }

  // Training tracker multi-select support.
  if(typeof trackerAllStats==='function'){
    trackerAllStats=function(){
      const total=data.trainingTopics.length;
      const count=k=>data.trainingTopics.filter((_,i)=>has(state.training[i],k)).length;
      const complete=data.trainingTopics.filter((_,i)=>has(state.training[i],'covered')||has(state.training[i],'live')).length;
      return {total,complete,covered:count('covered'),live:count('live'),review:count('review'),notReached:count('notReached')};
    };
  }
  if(typeof trackerGroupStats==='function'){
    trackerGroupStats=function(group){
      const indexes=group.topics.map(trackerTopicIndex).filter(i=>i>=0);
      return {indexes,total:indexes.length,complete:indexes.filter(i=>has(state.training[i],'covered')||has(state.training[i],'live')).length};
    };
  }
  if(typeof trackerTopicCard==='function'){
    trackerTopicCard=function(i){
      const topic=data.trainingTopics[i],item=state.training[i]||{};
      const choices=[['covered','Covered'],['live','Demonstrated Live'],['review','Needs Review'],['notReached','Not Reached']];
      const labels=choices.filter(([k])=>has(item,k)).map(([,l])=>l);
      const complete=has(item,'covered')||has(item,'live');
      return `<div class="training-topic-row ${complete?'complete':''}">
        <div class="training-topic-copy"><strong>${esc(topic)}</strong><small>${esc(labels.length?labels.join(' • '):'Not yet marked')}</small></div>
        <div class="training-card" data-topic="${i}">
          <div class="status-grid tracker-status-grid">${choices.map(([k,l])=>`<button class="status-button ${has(item,k)?'multi-active':''}" data-status="${k}" aria-pressed="${has(item,k)}">${l}</button>`).join('')}</div>
          <textarea class="note-field" data-topic-note="${i}" placeholder="Optional training note">${esc(item.note||'')}</textarea>
        </div>
      </div>`;
    };
  }

  // Add an explicit return-to-top control to Procedures.
  if(typeof renderProcedures==='function'){
    const baseProcedures=renderProcedures;
    renderProcedures=function(){
      const html=baseProcedures();
      return `${html}<div class="procedure-top-control"><button type="button" data-procedure-top>↑ Back to Procedure Categories</button></div>`;
    };
  }

  const baseBind=bindDynamic;
  bindDynamic=function(){
    baseBind();
    syncChrome();

    // Category cards now jump to the first procedure in the selected category.
    document.querySelectorAll('[data-procedure-category]').forEach(button=>button.onclick=()=>{
      state.procedureCategory=button.dataset.procedureCategory;
      state.procedureTarget=null;
      saveState();
      render();
      requestAnimationFrame(()=>{
        const target=document.querySelector('[data-field-procedure],.field-procedure');
        if(target) target.scrollIntoView({block:'start',behavior:'smooth'});
      });
    });

    document.querySelectorAll('[data-procedure-top]').forEach(button=>button.onclick=()=>{
      const target=document.querySelector('.category-grid')||document.querySelector('.page-heading');
      if(target) target.scrollIntoView({block:'start',behavior:'smooth'}); else window.scrollTo({top:0,behavior:'smooth'});
    });

    // Preserve Guide card expansion and its location when checking tasks.
    document.querySelectorAll('.guide-section-toggle').forEach(button=>button.onclick=()=>{
      const card=button.closest('.procedure-card');
      const id=card?.dataset.procedure;
      if(!id) return;
      state.guideExpanded||={};
      const open=!card.classList.contains('expanded');
      state.guideExpanded[id]=open;
      card.classList.toggle('expanded',open);
      button.setAttribute('aria-expanded',String(open));
      const hint=button.querySelector('.open-hint');if(hint)hint.textContent=open?'Hide topics':'Show topics';
      saveState();
    });
    document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>{
      const id=c.dataset.check;
      const card=c.closest('[data-procedure]');
      const before=card?.getBoundingClientRect().top||0;
      state.procedureProgress[id]||={};
      state.procedureProgress[id][c.dataset.index]=c.checked;
      state.guideExpanded||={};state.guideExpanded[id]=true;
      saveState();render();
      requestAnimationFrame(()=>{
        const after=document.querySelector(`[data-procedure="${CSS.escape(id)}"]`);
        if(!after)return;
        const delta=after.getBoundingClientRect().top-before;
        if(Math.abs(delta)>1)window.scrollBy(0,delta);
      });
    });

    // Lesson statuses: any combination may be selected.
    document.querySelectorAll('[data-lesson-status]').forEach(b=>b.onclick=()=>{
      const key=b.dataset.lessonStatus;
      state.lessonStatus[key]||={};
      toggleStatus(state.lessonStatus[key],b.dataset.status,['live','explained']);
      saveState();render();
      requestAnimationFrame(()=>document.querySelector(`[data-lesson-card="${CSS.escape(key)}"]`)?.scrollIntoView({block:'nearest',behavior:'auto'}));
    });

    // Training Tracker statuses: any combination may be selected.
    document.querySelectorAll('.training-card .status-button').forEach(b=>b.onclick=()=>{
      const i=b.closest('.training-card')?.dataset.topic;
      if(i===undefined)return;
      state.training[i]||={};
      toggleStatus(state.training[i],b.dataset.status,['live','covered']);
      saveState();render();
    });
  };

  render();
})();
