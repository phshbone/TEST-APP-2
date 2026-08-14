// Dock the persistent app chrome to the actual iOS visual viewport.
(function(){
  function dock(){
    const topbar=document.querySelector('.topbar');
    const mode=document.querySelector('.mode-strip');
    const nav=document.querySelector('.bottom-nav');
    if(!topbar||!mode||!nav)return;

    // Keep persistent chrome outside any transformed app-shell ancestor.
    if(topbar.parentElement!==document.body) document.body.appendChild(topbar);
    if(mode.parentElement!==document.body) document.body.appendChild(mode);
    if(nav.parentElement!==document.body) document.body.appendChild(nav);

    const vv=window.visualViewport;
    const offsetTop=vv?vv.offsetTop:0;
    const viewportHeight=vv?vv.height:window.innerHeight;

    const topH=Math.ceil(topbar.getBoundingClientRect().height)||82;
    topbar.style.setProperty('top',`${Math.round(offsetTop)}px`,'important');

    const modeTop=offsetTop+topH;
    mode.style.setProperty('top',`${Math.round(modeTop)}px`,'important');
    const modeH=Math.ceil(mode.getBoundingClientRect().height)||68;

    const navH=Math.ceil(nav.getBoundingClientRect().height)||88;
    const navTop=offsetTop+viewportHeight-navH;
    nav.style.setProperty('top',`${Math.round(navTop)}px`,'important');
    nav.style.setProperty('bottom','auto','important');

    const root=document.documentElement;
    root.style.setProperty('--mpw-topbar-h',`${topH}px`);
    root.style.setProperty('--mpw-mode-h',`${modeH}px`);
    root.style.setProperty('--mpw-nav-h',`${navH}px`);
  }

  const schedule=()=>requestAnimationFrame(dock);
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(dock,120),{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize',schedule,{passive:true});
    visualViewport.addEventListener('scroll',schedule,{passive:true});
  }
  if(window.ResizeObserver){
    const ro=new ResizeObserver(schedule);
    document.querySelectorAll('.topbar,.mode-strip,.bottom-nav').forEach(el=>ro.observe(el));
  }

  const priorRender=window.render;
  if(typeof priorRender==='function'){
    window.render=function(){
      priorRender();
      requestAnimationFrame(dock);
    };
  }
  requestAnimationFrame(dock);
})();
