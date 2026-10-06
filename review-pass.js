// Retained review-pass behavior after FOUNDATION v3 deduplication.
// Multi-status handling, Guide↔Training sync, floating returns, and top-button wiring
// are owned by later dedicated modules. This file now keeps only its unique lookup
// ranking and the secondary Reprint guidance.
(function(){
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
    const modesOf=item=>Array.isArray(item?.modes)&&item.modes.length?item.modes:['early','election'];
    const modeLabelFor=item=>{
      const modes=modesOf(item);
      if(modes.includes('early')&&modes.includes('election'))return 'Both';
      return modes.includes('election')?'Election Day':'Early Voting';
    };
    const preferredScore=(item,q)=>scoreLookup(item,q)+(modesOf(item).includes(state.mode)?120:0);

    renderLookup=function(){
      const q=(state.lookupQuery||'').trim().toLowerCase();
      const matches=item=>JSON.stringify(item).toLowerCase().includes(q);

      const procedures=q?fieldData.items
        .filter(matches)
        .sort((a,b)=>preferredScore(b,q)-preferredScore(a,q)):[];
      const guide=q?data.procedures
        .filter(matches)
        .sort((a,b)=>preferredScore(b,q)-preferredScore(a,q)):[];
      const reminders=q?[...(data.dosDonts?.dos||[]),...(data.dosDonts?.donts||[])]
        .filter(matches)
        .sort((a,b)=>preferredScore(b,q)-preferredScore(a,q)):[];
      const current=q?(window.MPW_CURRENT_LOOKUP_ITEMS||[])
        .filter(matches)
        .sort((a,b)=>scoreLookup(b,q)-scoreLookup(a,q)):[];

      title.textContent='Quick Lookup';
      const card=(layer,item,attr,summary)=>`<button class="card lookup-result-card" ${attr}><span class="lookup-layer">${esc(layer)}</span><strong>${esc(item.title||item.text)}</strong><span>${esc(summary||item.meaning||item.summary||item.detail||'Open result')}</span></button>`;
      const groups=[];

      if(procedures.length)groups.push(`<section class="lookup-group"><h3>Procedures</h3><p class="small">Field answers from both Early Voting and Election Day.</p>${procedures.map(p=>card(`Procedure · ${modeLabelFor(p)}`,p,`data-lookup-procedure="${esc(p.id)}" data-lookup-mode="${esc(modesOf(p).includes(state.mode)?state.mode:modesOf(p)[0])}"`)).join('')}</section>`);
      if(guide.length)groups.push(`<section class="lookup-group"><h3>Guide</h3><p class="small">Training and checklist material from both modes.</p>${guide.map(p=>card(`Guide · ${modeLabelFor(p)}`,p,`data-lookup-guide="${esc(p.id)}" data-lookup-mode="${esc(modesOf(p).includes(state.mode)?state.mode:modesOf(p)[0])}"`)).join('')}</section>`);
      if(reminders.length)groups.push(`<section class="lookup-group"><h3>Official Do’s & Don’ts</h3><p class="small">Official reminders and explanations.</p>${reminders.map((p,i)=>card(`Do / Don’t · ${modeLabelFor(p)}`,{title:p.text,summary:p.detail},`data-lookup-route="dosdonts" data-lookup-mode="${esc(modesOf(p).includes(state.mode)?state.mode:modesOf(p)[0])}" data-lookup-rule="${i}"`)).join('')}</section>`);
      if(current.length)groups.push(`<section class="lookup-group"><h3>Important Dates & Rules</h3><p class="small">Standing rules, deadlines, and election-calendar topics.</p>${current.map(p=>card('Dates & Rules · Both',p,'data-lookup-route="current"')).join('')}</section>`);

      return `${pageHeading('Quick Lookup','Search Guide, Procedures, Official Do’s & Don’ts, and Important Dates & Rules across both election modes.')}<input id="lookupInput" class="search-box" placeholder="Search electioneering, affirm, reprint, provisional…" value="${esc(state.lookupQuery||'')}"><div style="height:12px"></div>${!q?'<div class="card empty">Type a term, voter situation, rule, or procedure.</div>':groups.length?groups.join(''):'<div class="card empty">No matching result found.</div>'}`;
    };
  }

  const item=fieldData.items.find(x=>x.id==='xref-reprint')||fieldData.items.find(x=>x.id==='reprint-field');
  if(item&&!item.__secondaryAdded){
    item.steps=item.steps||[];
    const text='If the completed check-in screen still offers a Reprint option, use that on-screen Reprint path there instead of leaving the check-in screen to open the separate Re-Print menu.';
    if(!item.steps.some(x=>String(x).includes('completed check-in screen'))) item.steps.splice(1,0,text);
    item.__secondaryAdded=true;
  }

  render();
})();
