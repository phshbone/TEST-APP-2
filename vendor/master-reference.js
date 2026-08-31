(function(){
  const menu=document.getElementById('sideMenu');
  if(!menu || document.getElementById('adminMenuButton')) return;
  const button=document.createElement('button');
  button.type='button';
  button.id='adminMenuButton';
  button.dataset.adminEntry='true';
  button.textContent='Admin';
  button.style.cssText='display:block;width:100%;text-align:left;min-height:50px;border:0;border-bottom:1px solid #d7e0eb;background:#fff;color:#123a6d;font-weight:800';
  menu.appendChild(button);
})();
