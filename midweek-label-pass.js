// User-facing Early Voting phase terminology.
(function(){
  // `data` is the app's global lexical binding from vendor/app.js. A top-level
  // `const data` is intentionally not exposed as window.data, so use the
  // binding directly here rather than probing window.data.
  if(typeof data==='undefined')return;

  const morning=(data.procedures||[]).find(p=>p.id==='morning');
  if(morning)morning.title='Midweek Morning Opening';

  const shutdown=(data.procedures||[]).find(p=>p.id==='shutdown');
  if(shutdown){
    shutdown.title='Midweek Nightly Shutdown';
    if(typeof shutdown.warning==='string'){
      shutdown.warning=shutdown.warning.replace(/intermediate/gi,'midweek');
    }
  }

  if(data.dosDonts?.donts){
    data.dosDonts.donts.forEach(item=>{
      if(typeof item.text==='string')item.text=item.text.replace(/intermediate/gi,'midweek');
    });
  }

  if(typeof render==='function')render();
})();
