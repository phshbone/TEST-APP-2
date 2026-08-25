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

  const item=fieldData.items.find(x=>x.id==='xref-reprint')||fieldData.items.find(x=>x.id==='reprint-field');
  if(item&&!item.__secondaryAdded){
    item.steps=item.steps||[];
    const text='If the completed check-in screen still offers a Reprint option, use that on-screen Reprint path there instead of leaving the transaction to open the separate Re-Print menu.';
    if(!item.steps.some(x=>String(x).includes('completed check-in screen'))) item.steps.splice(1,0,text);
    item.__secondaryAdded=true;
  }

  render();
})();
