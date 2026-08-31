(function(){
  const KEY='mpw-master-local-code';
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

  function createCode(){
    const first=prompt('Create an Admin PIN or code for this device (4 or more characters):');
    if(first===null) return null;
    if(first.length<4){alert('Code must be at least 4 characters.');return null;}
    const second=prompt('Enter the code again to confirm:');
    if(second===null) return null;
    if(first!==second){alert('Codes did not match.');return null;}
    localStorage.setItem(KEY,first);
    alert('Admin code saved on this device.');
    return first;
  }

  entry.onclick=()=>{
    closeMenu();
    let saved=localStorage.getItem(KEY);
    if(!saved) saved=createCode();
    if(!saved) return;
    const entered=prompt('Enter Admin code:');
    if(entered===null) return;
    if(entered!==saved){alert('Incorrect code.');return;}
    openAdmin();
  };
})();
