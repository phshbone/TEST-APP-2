// Important Dates & Election Rules. Regular-election dates are calculated from NJ statutory rules; special elections must use an official published timeline.
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
  function ruleCard(title,body,source){return `<article class="card"><h3>${esc(title)}</h3><p>${esc(body)}</p>${source?`<p class="small"><strong>Source:</strong> ${esc(source)}</p>`:''}</article>`;}

  // Shared display source for Home and Important Dates. Official calendar values,
  // when supplied, take precedence over calculated regular-election values.
  window.MPW_ELECTION_DISPLAY=function(mode){
    const current=nextRegularElection();
    const official=window.MPW_OFFICIAL_ELECTION_CALENDAR||{};
    if(mode==='early'){
      const start=official.earlyVotingStart?new Date(`${official.earlyVotingStart}T12:00:00`):null;
      const end=official.earlyVotingEnd?new Date(`${official.earlyVotingEnd}T12:00:00`):null;
      if(start&&end&&!Number.isNaN(start.getTime())&&!Number.isNaN(end.getTime())){
        return `Early Voting • ${fmtShort(start)} – ${fmtShort(end)}`;
      }
      return 'Early Voting • Official range pending';
    }
    const election=official.electionDay?new Date(`${official.electionDay}T12:00:00`):current.date;
    return `Election Day • ${fmtShort(election)}`;
  };

  renderCurrent=function(){
    title.textContent='Important Dates & Rules';
    const current=nextRegularElection(), next=followingRegularElection(current);
    const currentRegistration=minusDays(current.date,21);
    const nextRegistration=minusDays(next.date,21);
    const currentParty=current.kind==='Primary Election'?minusDays(current.date,55):null;
    const nextParty=next.kind==='Primary Election'?minusDays(next.date,55):null;
    return `${pageHeading('Important Dates & Election Rules','Predictive dates for regular New Jersey Primary and General Elections. Special-election dates must come from the official published timeline.')}
      <section class="card"><p class="section-label">Upcoming Regular Election</p><h3>${esc(current.kind)}</h3><p><strong>${esc(fmt(current.date))}</strong></p><div class="report-stat"><span>Voter registration deadline</span><strong>${esc(fmt(currentRegistration))}</strong></div>${currentParty?`<div class="report-stat"><span>Party-affiliation change deadline</span><strong>${esc(fmt(currentParty))}</strong></div>`:''}<p class="small">Calculated from current NJ statutory rules. Verify against the official NJ and Morris County election calendars when published.</p></section>
      <section class="card"><p class="section-label">One Election Ahead</p><h3>${esc(next.kind)}</h3><p><strong>${esc(fmt(next.date))}</strong></p><div class="report-stat"><span>Voter registration deadline</span><strong>${esc(fmt(nextRegistration))}</strong></div>${nextParty?`<div class="report-stat"><span>Party-affiliation change deadline</span><strong>${esc(fmt(nextParty))}</strong></div>`:''}</section>
      ${ruleCard('Regular Primary Election','Held on the Tuesday after the first Monday in June. A currently affiliated voter who wants to change party affiliation must file by the 55th day before the Primary. An unaffiliated voter may declare a party through Primary Election Day.','NJ Division of Elections / NJAC 15:10 and NJSA Title 19')}
      ${ruleCard('Regular General Election','Held on the Tuesday after the first Monday in November. The voter-registration deadline is 21 days before the election.','NJ Division of Elections / NJSA Title 19')}
      ${ruleCard('Early Voting','Early Voting is a separate voting period before Election Day. It does not move the 55-day party deadline or the 21-day voter-registration deadline; those are measured from the election itself.','NJ Division of Elections')}
      ${ruleCard('17-Year-Old Primary Voters','A registered 17-year-old may vote in a Primary Election if they will turn 18 on or before the following General Election.','NJSA 19:4-1.2; NJ Division of Elections')}
      ${ruleCard('County Residency','A voter must meet the applicable 30-day county-residency requirement before the election.','NJ Division of Elections; Morris County voting requirements')}
      ${ruleCard('Special Elections','Special-election dates are set under the applicable statute or official election order. If a special election requires a primary, the special primary is held 20 to 30 days before the special election. Use the official NJ/Morris special-election timeline instead of predicting these dates.','NJSA 19:2-1 and 19:2-3')}
      ${ruleCard('Special-Election Registration','The 21-day voter-registration rule still applies to a special election. The app should show the official published deadline for that special election rather than rely only on a calculated date.','NJSA 19:31-6; NJ Division of Elections special-election notices')}
      ${ruleCard('Special-Primary Party Deadlines','Do not automatically apply the regular 55-day party-change calculation to a special primary. Use the official timeline published for that specific special election.','Official NJ special-election timeline required')}
      <section class="card"><h3>Official verification</h3><p class="small">Regular dates may be calculated in advance, but once the NJ Division of Elections or Morris County publishes the official calendar, those published dates control.</p><div class="controls"><a class="secondary" href="https://www.nj.gov/state/elections/" target="_blank" rel="noopener">NJ Elections</a><a class="secondary" href="https://www.morriscountynj.gov/Government/Voting-and-Elections" target="_blank" rel="noopener">Morris County Elections</a></div></section>`;
  };

  render();
})();
