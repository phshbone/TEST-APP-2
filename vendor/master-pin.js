(function(){
  const ADMIN_CODE='2840';
  const entry=document.getElementById('adminMenuButton');
  if(!entry) return;

  function closeMenu(){
    try{document.getElementById('sideMenu')?.close();}catch(e){}
  }

  function openAdmin(){
    const refs=(typeof MASTER_TECH_REFERENCES!=='undefined'?MASTER_TECH_REFERENCES:[]);
    const lines=refs.map(r=>`${r.title} — pages ${r.pages}`).join('\n');
    alert(`ADMIN\n\n${lines||'No indexed references.'}\n\nSensitive Morris PDF files are intentionally not bundled in this public build.`);
  }

  entry.onclick=()=>{
    closeMenu();
    const entered=prompt('Enter Admin code:');
    if(entered===null) return;
    if(entered!==ADMIN_CODE){alert('Incorrect code.');return;}
    openAdmin();
  };
})();
