// Structural shell enforcement for iOS Safari/PWA.
// The shell is sized from window.innerHeight only; visualViewport was producing a shortened app frame.
(function(){
  const app=document.getElementById('app');
  const main=document.getElementById('mainContent');
  if(!app||!main)return;
  let repairing=false;

  function syncViewport(){
    const height=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||0));
    document.documentElement.style.setProperty('--mpw-vv-top','0px');
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

  const prior=window.render;
  if(typeof prior==='function')window.render=function(){prior();requestAnimationFrame(repair);};
  repair();
})();
