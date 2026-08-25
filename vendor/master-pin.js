(function(){
  const KEY='mpw-master-local-code';
  const entry=document.querySelector('#sideMenu button:last-child');
  if(!entry || entry.textContent!=='Master Reference') return;

  function openMaster(){
    const refs=(typeof MASTER_TECH_REFERENCES!=='undefined'?MASTER_TECH_REFERENCES:[]);
    const lines=refs.map(r=>`${r.title} — pages ${r.pages}`).join('\n');
    alert(`MASTER REFERENCE\n\n${lines||'No indexed references.'}\n\nSensitive Morris PDF files are intentionally not bundled in this public build.`);
  }

  entry.onclick=()=>{
    try{sideMenu.close();}catch(e){}
    let saved=localStorage.getItem(KEY);
    if(!saved){
      const first=prompt('Create a Master Mode PIN for this device (4 or more characters):');
      if(first===null) return;
      if(first.length<4){alert('PIN must be at least 4 characters.');return;}
      const second=prompt('Enter the PIN again to confirm:');
      if(first!==second){alert('PINs did not match.');return;}
      localStorage.setItem(KEY,first);
      saved=first;
    }
    const entered=prompt('Enter Master Mode PIN:');
    if(entered===null) return;
    if(entered!==saved){alert('Incorrect PIN.');return;}
    openMaster();
  };
})();
