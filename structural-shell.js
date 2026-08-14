// Structural shell enforcement for iOS Safari/PWA.
(function(){
  const app=document.getElementById('app');
  const main=document.getElementById('mainContent');
  if(!app||!main)return;
  let repairing=false;

  function syncViewport(){
    const vv=window.visualViewport;
    const top=vv?Math.max(0,Math.round(vv.offsetTop)):0;
    const height=vv?Math.round(vv.height):window.innerHeight;
    document.documentElement.style.setProperty('--mpw-vv-top',`${top}px`);
    document.documentElement.style.setProperty('--mpw-vv-height',`${height}px`);
  }

  function repair(){
    if(repairing)return; repairing=true;
    const top=document.querySelector('.topbar');
    const mode=document.querySelector('.mode-strip');
    const nav=document.querySelector('.bottom-nav');
    if(top&&top.parentElement!==app)app.insertBefore(top,app.firstChild);
    if(mode&&mode.parentElement!==app)app.insertBefore(mode,main);
    if(nav&&nav.parentElement!==app)app.appendChild(nav);
    [top,mode,nav].filter(Boolean).forEach(el=>{
      ['top','right','bottom','left','position','transform','height'].forEach(p=>el.style.removeProperty(p));
    });
    syncViewport();
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
    repairing=false;
  }

  const schedule=()=>requestAnimationFrame(repair);
  const obs=new MutationObserver(schedule);
  obs.observe(document.body,{childList:true,subtree:false});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(repair,100),{passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize',schedule,{passive:true});
    visualViewport.addEventListener('scroll',schedule,{passive:true});
  }

  const prior=window.render;
  if(typeof prior==='function')window.render=function(){prior();requestAnimationFrame(repair);};
  repair();
})();
