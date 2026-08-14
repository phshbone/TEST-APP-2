// Structural-shell helpers only: no viewport sizing and no fixed-nav positioning.
(function(){
  const main=document.getElementById('mainContent');

  function measureNav(){
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    const h=Math.ceil(nav.getBoundingClientRect().height)||82;
    document.documentElement.style.setProperty('--clean-nav-height',`${h}px`);
    document.documentElement.style.setProperty('--mpw-nav-height',`${h}px`);
  }

  function formatCriticalWarnings(){
    document.querySelectorAll('.warning-box,.procedure-critical').forEach(box=>{
      if(box.dataset.criticalFormatted==='1')return;
      const text=(box.textContent||'').trim();
      if(!text.startsWith('★'))return;
      const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
      if(!lines.length)return;
      let head=lines.shift();
      let body=lines.join(' ');
      // Handle legacy cases where the closing star wrapped onto its own line.
      if(lines[0]==='★'){
        head=`${head} ★`;
        lines.shift();
        body=lines.join(' ');
      }
      // If heading contains a second sentence, keep only the starred command as the heading.
      const secondStar=head.indexOf('★',1);
      if(secondStar>0){
        const remainder=head.slice(secondStar+1).trim();
        head=head.slice(0,secondStar+1).trim();
        if(remainder)body=`${remainder} ${body}`.trim();
      }
      box.innerHTML=`<span class="critical-command">${esc(head)}</span>${body?`<span class="critical-explanation">${esc(body)}</span>`:''}`;
      box.dataset.criticalFormatted='1';
    });
  }

  function removeDuplicateWarnings(){
    document.querySelectorAll('.field-procedure').forEach(card=>{
      const seen=new Set();
      card.querySelectorAll('.warning-box,.procedure-critical').forEach(box=>{
        const key=(box.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
        if(!key)return;
        if(seen.has(key))box.remove();
        else seen.add(key);
      });
    });
  }

  function wireTopButton(){
    const b=document.getElementById('floatingTopButton');
    if(!b||!main)return;
    b.onclick=()=>main.scrollTo({top:0,behavior:'smooth'});
    const sync=()=>b.classList.toggle('visible',main.scrollTop>500);
    if(window.__mpwMainScrollSync)main.removeEventListener('scroll',window.__mpwMainScrollSync);
    window.__mpwMainScrollSync=sync;
    main.addEventListener('scroll',sync,{passive:true});
    sync();
  }

  function post(){
    measureNav();
    removeDuplicateWarnings();
    formatCriticalWarnings();
    wireTopButton();
  }

  const schedule=()=>requestAnimationFrame(post);
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',()=>setTimeout(post,100),{passive:true});
  if(window.ResizeObserver){
    const ro=new ResizeObserver(schedule);
    const nav=document.querySelector('.bottom-nav');
    if(nav)ro.observe(nav);
  }
  const prior=window.render;
  if(typeof prior==='function')window.render=function(){prior();requestAnimationFrame(post);};
  post();
})();
