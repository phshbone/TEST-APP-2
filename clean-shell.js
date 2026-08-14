// Clean shell measurements only: no viewport sizing, no element reparenting.
(function(){
  function measureChrome(){
    const top=document.querySelector('.topbar');
    const mode=document.querySelector('.mode-strip');
    const nav=document.querySelector('.bottom-nav');
    const root=document.documentElement;
    if(top){
      const h=Math.ceil(top.getBoundingClientRect().height)||96;
      root.style.setProperty('--clean-topbar-height',`${h}px`);
    }
    if(mode){
      const h=Math.ceil(mode.getBoundingClientRect().height)||74;
      root.style.setProperty('--clean-mode-height',`${h}px`);
    }
    if(nav){
      const h=Math.ceil(nav.getBoundingClientRect().height)||82;
      root.style.setProperty('--clean-nav-height',`${h}px`);
      root.style.setProperty('--mpw-nav-height',`${h}px`);
    }
  }
  const schedule=()=>requestAnimationFrame(measureChrome);
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(measureChrome,100),{passive:true});
  if(window.ResizeObserver){
    const ro=new ResizeObserver(schedule);
    document.querySelectorAll('.topbar,.mode-strip,.bottom-nav').forEach(el=>ro.observe(el));
  }
  const prior=window.render;
  if(typeof prior==='function')window.render=function(){prior();requestAnimationFrame(measureChrome);};
  measureChrome();
})();
