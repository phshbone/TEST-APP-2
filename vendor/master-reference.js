(function(){
  const menu=document.getElementById('sideMenu');
  if(!menu) return;
  const button=document.createElement('button');
  button.type='button';
  button.textContent='Admin Reference';
  button.style.cssText='display:block;width:100%;text-align:left;min-height:50px;border:0;border-bottom:1px solid #d7e0eb;background:#fff;color:#123a6d;font-weight:800';
  menu.appendChild(button);
  button.onclick=()=>{
    try{menu.close();}catch(e){}
    alert('Admin Reference is reserved for Morris technical material. Sensitive Morris manuals are not bundled in this public demo build.');
  };
})();
