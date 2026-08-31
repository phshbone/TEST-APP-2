(function(){
  const ADMIN_CODE='2840';
  const entry=document.getElementById('adminMenuButton');
  if(!entry) return;

  const manuals=[
    {
      key:'blue',
      file:'reference-blue.pdf',
      title:'Morris County Voting Machine Manual — Election Day',
      note:'April 18, 2023',
      url:'assets/docs/reference-blue.pdf'
    },
    {
      key:'green',
      file:'reference-green.pdf',
      title:'Morris County Poll Worker Manual — Election Day',
      note:'May 7, 2024',
      url:'https://www.morriscountynj.gov/files/sharedassets/public/v/1/departments/elections/poll-worker-manual.pdf'
    },
    {
      key:'black',
      file:'reference-black.pdf',
      title:'New Jersey District Board Member Training Manual',
      note:'2024',
      url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'
    }
  ];

  function closeMenu(){
    try{document.getElementById('sideMenu')?.close();}catch(e){}
  }

  function closeAdmin(){
    document.getElementById('adminReferenceOverlay')?.remove();
  }

  function openAdmin(){
    closeAdmin();
    const overlay=document.createElement('div');
    overlay.id='adminReferenceOverlay';
    overlay.style.cssText='position:fixed;inset:0;z-index:80;background:rgba(4,20,39,.58);display:grid;place-items:center;padding:18px';
    const panel=document.createElement('section');
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-label','Admin manual references');
    panel.style.cssText='width:min(92vw,520px);max-height:82vh;overflow:auto;background:#fff;border-radius:20px;padding:20px;box-shadow:0 18px 50px rgba(0,0,0,.28);color:#172235';
    panel.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px"><h2 style="margin:0;color:#123a6d">Admin</h2><button type="button" data-admin-close style="min-width:44px;min-height:44px;border:0;border-radius:12px;background:#edf3fa;color:#123a6d;font-size:24px">×</button></div><p style="margin:0 0 16px;color:#647287">Manual references</p>`;
    manuals.forEach(m=>{
      const card=document.createElement('div');
      card.style.cssText='border:1px solid #d7e0eb;border-radius:14px;padding:14px;margin:10px 0;background:#fbfcfe';
      const color=m.key==='blue'?'#1f5d9d':m.key==='green'?'#147d49':'#20242b';
      card.innerHTML=`<div style="font-weight:900;color:${color};margin-bottom:4px">${m.file}</div><div style="font-weight:800;color:#123a6d">${m.title}</div><div style="font-size:.86rem;color:#647287;margin-top:3px">${m.note}</div>`;
      const action=document.createElement('button');
      action.type='button';
      action.style.cssText='width:100%;min-height:44px;margin-top:10px;border-radius:10px;border:1px solid #aabbd0;background:#fff;color:#123a6d;font-weight:800';
      action.textContent='Open manual';
      action.onclick=()=>window.open(m.url,'_blank','noopener');
      card.appendChild(action);
      panel.appendChild(card);
    });
    overlay.appendChild(panel);
    overlay.addEventListener('click',e=>{if(e.target===overlay) closeAdmin();});
    panel.querySelector('[data-admin-close]').onclick=closeAdmin;
    document.body.appendChild(overlay);
  }

  entry.onclick=()=>{
    closeMenu();
    const entered=prompt('Enter Admin code:');
    if(entered===null) return;
    if(entered!==ADMIN_CODE){alert('Incorrect code.');return;}
    openAdmin();
  };
})();
