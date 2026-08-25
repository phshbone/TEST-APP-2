// User-facing Early Voting phase terminology.
(function(){
  const morning=(window.data?.procedures||[]).find(p=>p.id==='morning');
  if(morning)morning.title='Midweek Morning Opening';

  const shutdown=(window.data?.procedures||[]).find(p=>p.id==='shutdown');
  if(shutdown){
    shutdown.title='Midweek Nightly Shutdown';
    if(typeof shutdown.warning==='string'){
      shutdown.warning=shutdown.warning.replace(/intermediate/gi,'midweek');
    }
  }

  if(window.data?.dosDonts?.donts){
    data.dosDonts.donts.forEach(item=>{
      if(typeof item.text==='string')item.text=item.text.replace(/intermediate/gi,'midweek');
    });
  }

  if(typeof window.render==='function')render();
})();
