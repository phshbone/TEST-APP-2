// Important Dates & Election Rules. Morris County published dates take priority;
// regular NJ Primary/General dates remain a calculated fallback.
(function(){
  function firstTuesdayAfterFirstMonday(year,month){
    const d=new Date(year,month,1,12,0,0);
    const day=d.getDay();
    const firstMonday=1+((8-day)%7);
    return new Date(year,month,firstMonday+1,12,0,0);
  }
  function primaryDate(year){return firstTuesdayAfterFirstMonday(year,5);}
  function generalDate(year){return firstTuesdayAfterFirstMonday(year,10);}
  function minusDays(date,days){const d=new Date(date);d.setDate(d.getDate()-days);return d;}
  function fmt(date){return date.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});}
  function fmtShort(date){return date.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
  function parseISO(value){
    if(!value)return null;
    const d=new Date(`${value}T12:00:00`);
    return Number.isNaN(d.getTime())?null:d;
  }
  function startOfToday(){const d=new Date();d.setHours(0,0,0,0);return d;}
  function nextRegularElection(){
    const now=new Date();
    const y=now.getFullYear(), p=primaryDate(y), g=generalDate(y);
    if(now<=p)return {kind:'Primary Election',date:p};
    if(now<=g)return {kind:'General Election',date:g};
    return {kind:'Primary Election',date:primaryDate(y+1)};
  }
  function followingRegularElection(current){
    const y=current.date.getFullYear();
    return current.kind==='Primary Election'?{kind:'General Election',date:generalDate(y)}:{kind:'Primary Election',date:primaryDate(y+1)};
  }
  function officialCalendar(){return window.MPW_OFFICIAL_ELECTION_CALENDAR||{};}
  function officialEvents(){
    return (officialCalendar().events||[]).map(event=>({
      ...event,
      date:parseISO(event.electionDay),
      earlyStart:parseISO(event.earlyVotingStart),
      earlyEnd:parseISO(event.earlyVotingEnd)
    })).filter(event=>event.date).sort((a,b)=>a.date-b.date);
  }
  function nextOfficialElection(){
    const today=startOfToday();
    return officialEvents().find(event=>event.date>=today)||null;
  }
  function nextOfficialEarlyVoting(){
    const today=startOfToday();
    return officialEvents().filter(event=>event.earlyStart&&event.earlyEnd).find(event=>event.earlyEnd>=today)||null;
  }
  function sourceUrl(event){
    const calendar=officialCalendar();
    return event&&event.source&&calendar.sources?calendar.sources[event.source]:null;
  }
  function ruleCard(title,body,source){return `<article class="card"><h3>${esc(title)}</h3><p>${esc(body)}</p>${source?`<p class="small"><strong>Source:</strong> ${esc(source)}</p>`:''}</article>`;}

  // Shared display source for Home and Important Dates.
  // Published Morris County values take precedence. Calculations are fallback only.
  window.MPW_ELECTION_DISPLAY=function(mode){
    if(mode==='early'){
      const official=nextOfficialEarlyVoting();
      if(official){
        return `Early Voting • ${fmtShort(official.earlyStart)} – ${fmtShort(official.earlyEnd)}`;
      }
      return 'Early Voting • Official Morris County range pending';
    }
    const official=nextOfficialElection();
    const election=official?official.date:nextRegularElection().date;
    return `Election Day • ${fmtShort(election)}`;
  };

  function officialCalendarMarkup(){
    const calendar=officialCalendar();
    const today=startOfToday();
    const upcoming=officialEvents().filter(event=>event.date>=today);
    if(!upcoming.length)return '';
    return `<section class="card"><p class="section-label">Published Morris County Calendar</p><h3>Official local dates</h3>
      ${upcoming.map(event=>{
        const src=sourceUrl(event);
        return `<div class="report-stat"><span>${esc(event.kind)}${event.scope?`<br><small>${esc(event.scope)}</small>`:''}</span><strong>${esc(fmt(event.date))}</strong></div>
          ${event.earlyStart&&event.earlyEnd?`<div class="report-stat"><span>Early Voting</span><strong>${esc(fmtShort(event.earlyStart))} – ${esc(fmtShort(event.earlyEnd))}</strong></div>`:''}
          ${src?`<p class="small"><a href="${esc(src)}" target="_blank" rel="noopener">Morris County source</a></p>`:''}`;
      }).join('')}
      ${calendar.verifiedOn?`<p class="small">Official local values verified ${esc(calendar.verifiedOn)}. When Morris County publishes a newer timeline, that published timeline controls.</p>`:''}
    </section>`;
  }

  renderCurrent=function(){
    title.textContent='Important Dates & Rules';
    const current=nextRegularElection(), next=followingRegularElection(current);
    const currentRegistration=minusDays(current.date,21);
    const nextRegistration=minusDays(next.date,21);
    const currentParty=current.kind==='Primary Election'?minusDays(current.date,55):null;
    const nextParty=next.kind==='Primary Election'?minusDays(next.date,55):null;
    return `${pageHeading('Important Dates & Election Rules','Morris County published dates take priority. Regular Primary and General Election dates are calculated only as a fallback.')}
      ${officialCalendarMarkup()}
      <section class="card"><p class="section-label">Calculated Regular-Election Fallback</p><h3>${esc(current.kind)}</h3><p><strong>${esc(fmt(current.date))}</strong></p><div class="report-stat"><span>Voter registration deadline</span><strong>${esc(fmt(currentRegistration))}</strong></div>${currentParty?`<div class="report-stat"><span>Party-affiliation change deadline</span><strong>${esc(fmt(currentParty))}</strong></div>`:''}<p class="small">Use this calculation only when an official Morris County timeline has not yet been published for the election you are working.</p></section>
      <section class="card"><p class="section-label">One Regular Election Ahead</p><h3>${esc(next.kind)}</h3><p><strong>${esc(fmt(next.date))}</strong></p><div class="report-stat"><span>Voter registration deadline</span><strong>${esc(fmt(nextRegistration))}</strong></div>${nextParty?`<div class="report-stat"><span>Party-affiliation change deadline</span><strong>${esc(fmt(nextParty))}</strong></div>`:''}</section>
      ${ruleCard('Regular Primary Election','Held on the Tuesday after the first Monday in June. A currently affiliated voter who wants to change party affiliation must file by the 55th day before the Primary. An unaffiliated voter may declare a party through Primary Election Day.','NJ Division of Elections / NJAC 15:10 and NJSA Title 19')}
      ${ruleCard('Regular General Election','Held on the Tuesday after the first Monday in November. The voter-registration deadline is 21 days before the election.','NJ Division of Elections / NJSA Title 19')}
      ${ruleCard('Early Voting','Do not infer the Early Voting window from Election Day. Use the official Morris County published start and end dates for the specific election.','Morris County Voting & Elections / NJ Division of Elections')}
      ${ruleCard('17-Year-Old Primary Voters','A registered 17-year-old may vote in a Primary Election if they will turn 18 on or before the following General Election.','NJSA 19:4-1.2; NJ Division of Elections')}
      ${ruleCard('County Residency','A voter must meet the applicable 30-day county-residency requirement before the election.','NJ Division of Elections; Morris County voting requirements')}
      ${ruleCard('Special Elections','Special-election and special-primary dates come from the official published Morris County or State timeline. Do not predict them from the regular-election calendar.','Official Morris County / NJ special-election timeline required')}
      ${ruleCard('Special-Election Registration','Use the deadline published for that specific special election rather than relying only on a generic calculation.','NJSA 19:31-6; official election notice')}
      ${ruleCard('Special-Primary Party Deadlines','Do not automatically apply the regular 55-day party-change calculation to a special primary. Use the official timeline published for that specific special election.','Official NJ special-election timeline required')}
      <section class="card"><h3>Official verification</h3><p class="small">Published Morris County election dates control the app display when available. Calculated regular-election dates remain a fallback and planning aid.</p><div class="controls"><a class="secondary" href="https://www.morriscountynj.gov/Government/Voting-and-Elections/Election-Calendar" target="_blank" rel="noopener">Morris Election Calendar</a><a class="secondary" href="https://www.nj.gov/state/elections/" target="_blank" rel="noopener">NJ Elections</a></div></section>`;
  };

  render();
})();
