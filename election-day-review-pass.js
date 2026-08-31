// Election Day live-review corrections: opening, 3+3 search, primary rules, zero reports, and challengers.
(function(){
  const procedures=window.APP_DATA?.procedures||[];
  const electionOpening=procedures.find(p=>p.id==='opening' && p.modes?.includes('election'));
  const lesson=(procedure,id)=>procedure?.lessons?.find(x=>x.id===id);

  if(electionOpening){
    const room=lesson(electionOpening,'room-flow');
    if(room){
      room.lead='When the room allows, use the available space to create clear movement and enough separation between check-in and voting.';
      room.tips=[
        'When the room allows, leave substantial space between check-in tables and the voting-machine area so the two lines do not merge or cross.',
        'Use the best available layout for the room. Plan the flow as check in → voting area → exit without blocking accessible routes.',
        'Voting machines should be positioned with direct access to working wall outlets.'
      ];
    }

    const identify=lesson(electionOpening,'identify-machines');
    if(identify){
      identify.official=[
        'Locate the Key Envelope in the Red Bag.',
        'Confirm that the machine number on the Key Envelope matches the number on the voting machine.',
        'Separately inspect the voting-machine seals. If a required seal is missing, broken, or does not match the seal information recorded for that machine, stop and contact the Voting Machine Warehouse.'
      ];
      identify.tips=[
        'The Election Day Red Bag is in the Maroon Bag with the Election Day materials.',
        'The machine keys may be in separate small manila Key Envelopes labeled with the corresponding machine number. Match the machine number before opening the machine.'
      ];
    }

    const physical=lesson(electionOpening,'machine-physical');
    if(physical){
      physical.tips=[
        'Move table equipment to the check-in area after it is removed from the voting machine.',
        'After setup, return the barrel keys and Key Envelopes to the Red Bag. Do not leave machine keys at, on, or in the voting machine.'
      ];
      physical.actions=['Machine positioned, wheels locked, cover removed, rear equipment removed, rear compartment re-locked.','Barrel keys and Key Envelopes returned to the Red Bag.'];
    }

    const epb=lesson(electionOpening,'epb-layout');
    if(epb){
      epb.official=[
        'Follow the visual station diagram supplied with the Election Day ePollbook materials.',
        'Confirm that the Touchpad/ePollbook number matches both printer numbers.',
        'Match the labeled/color-coded connections to the corresponding labeled ports on the Epson printer, ExpressVote printer, server, and associated cables.',
        'Route equipment wires down the poll-worker side of the table, not the voter side. Keep wires bundled and out of voter paths; use the supplied blue tape for potential tripping hazards.'
      ];
    }

    const machineOpen=lesson(electionOpening,'machine-open');
    if(machineOpen){
      machineOpen.official=[
        'Verify the required seals against the machine-opening information before removing them.',
        'Plug the voting machine into the working wall outlet and verify its power indicators.',
        'Use the barrel key to open the Top Access Compartment, use the red power button to start the machine, then close and lock the compartment.',
        'Continue the official ExpressVote XL Opening Procedures in the Voting Machine Manual through Open Poll and the ready-for-voting checks.',
        'Two Zero Reports print automatically. Verify that every number on both reports is ZERO (0). Two poll workers from opposing parties sign both reports and place them in the Red Bag.',
        'If a Zero Report is not zero, STOP opening that machine and contact the Voting Machine Warehouse before proceeding.',
        'After the machine-opening sequence is complete, return the barrel key and Key Envelope to the Red Bag.'
      ];
    }

    const admin=lesson(electionOpening,'manuals-admin');
    if(admin){
      admin.title='Manuals, signage, paperwork, reports, and final readiness';
      admin.lead='Keep the reference manuals at the table, finish the required paperwork and signage, verify opening reports, and prepare the room for voters.';
      admin.official=[
        'Complete and sign the Oath of Office before undertaking election duties.',
        'Post the required polling-place, accessibility, electioneering, sample-ballot, and voting-machine instruction signs as applicable.',
        'Select an official clock for the polling place and coordinate timekeeping to it so opening and closing times are consistent.',
        'Coordinate the voting-machine zero-printout time with the official clock. If the times differ, the judge determines the official time.',
        'For each ePollbook, complete opening/login and place the printed Poll Opening Report in the Clear Envelope.',
        'Election Day materials include the Morris County manuals and the New Jersey State manual.'
      ];
      admin.tips=[
        'Keep the green Morris County Poll Worker Manual at the check-in table and keep the New Jersey State District Board Member Training Manual accessible throughout the day.',
        'If a voter situation is unfamiliar, explain that you are checking the manual so the procedure is handled correctly the first time.',
        'If no suitable wall clock is available, agree on one reliable time source before the polls open and use it consistently.',
        'The Master Poll Worker should verify attendance and completion of the required opening paperwork before the room is declared ready.'
      ];
      admin.actions=['Manuals accessible.','Required opening paperwork and signage reviewed.','Zero Reports verified as zero and signed.','ePollbook Poll Opening Reports secured in the Clear Envelope.','Polling place ready for voters.'];
    }
  }

  const checkin=procedures.find(p=>p.id==='checkin');
  if(checkin){
    const search=lesson(checkin,'search');
    if(search){
      search.official=[
        'Election Day: use the 3+3 search method with the district voter list.',
        'Early Voting: use the 4+4 search method with the countywide voter list.',
        'Use the voter information provided to locate the correct record.',
        'Review the result list carefully before selecting a voter.'
      ];
      search.tips=[
        'Election Day reminder: use 3+3 first because the district list is much smaller.',
        'Early Voting reminder: use 4+4 because the voter list is countywide.',
        'Use alternate search methods when spelling, spacing, or a compound surname may affect the result.',
        'If a voter presents a scannable sample ballot or driver’s license, use the available scan function when appropriate. DO NOT turn this into a request for ID.'
      ];
    }

    if(!lesson(checkin,'primary-party')){
      checkin.lessons.push({
        id:'primary-party',
        title:'Primary Election — party affiliation',
        lead:'Primary Election only: verify party status before issuing the ballot style.',
        official:[
          'Only voters affiliated with the Democratic or Republican Party may vote that party’s Primary Election ballot.',
          'A voter already affiliated with a party cannot change parties at the polling place and vote in the new party’s Primary Election.',
          'An unaffiliated voter may declare either Democratic or Republican at the polling place and then vote that party’s Primary Election ballot.',
          'For an unaffiliated voter, use Declare Party in the ePollbook; the voter selects and confirms the party, then signs normally.',
          'Once an unaffiliated voter declares a party, that becomes the voter’s affiliation until the voter notifies the election office otherwise.',
          'A voter changing from an existing party affiliation must notify the commissioner of registration at least 55 days before the Primary Election for that change to apply to that Primary.'
        ],
        why:'Primary ballot eligibility depends on the voter’s existing affiliation or an unaffiliated voter’s declaration at check-in.',
        tips:['A registration application or party declaration form may be offered for a future affiliation change; it does not permit an already-affiliated voter to switch parties and vote the new party’s ballot that day.'],
        mistakes:['Allowing an already-affiliated voter to cross party lines at the polling place.','Issuing a provisional ballot merely so an already-affiliated voter can vote another party’s Primary ballot.'],
        actions:['Primary party status verified before the ballot style is issued.']
      });
    }
  }

  if(!procedures.some(p=>p.id==='challengers' && p.modes?.includes('election'))){
    const spoilIndex=procedures.findIndex(p=>p.id==='spoil');
    const challenger={
      id:'challengers',
      title:'Election Day Challengers',
      modes:['election'],
      type:'teaching',
      summary:'Know where challengers belong, what they may observe, and when a formal voter challenge must be escalated into the documented challenge process.',
      badges:['Election Day','Official Procedure'],
      lessons:[{
        id:'challenger-basics',
        title:'Challenger basics and boundaries',
        lead:'Challengers observe from a designated position; they do not run the check-in table or speak directly to voters.',
        official:[
          'Challengers may not speak directly to voters. Questions must be directed to district board members.',
          'Challengers may not handle election documents, sit at the district board table, or approach the voting machine to examine counters.',
          'A challenger may inspect the zero-proof report at opening and the vote-total printout at closing.',
          'The challenger table should be close enough for the challenger to hear the voter’s name when the district board member reads it aloud, but challengers do not sit with the district board.'
        ],
        why:'The challenger role is observational and procedural; voter interaction and election equipment remain under the district board’s control.',
        tips:[
          'Morris County training places challengers behind or near the check-in area at a separate table, out of the voter workflow.',
          'Morris County training says challengers should not greet voters or touch election equipment.',
          'Candidates appearing on the ballot may act as challengers without an ordinary challenger badge; verify candidate identity with the Sample Ballot or contact the Board if unsure.'
        ],
        mistakes:['Allowing a challenger to question a voter directly.','Allowing a challenger to handle ePollbooks, printers, forms, or voting-machine equipment.'],
        actions:['Challenger location and boundaries established without interfering with voter flow.']
      },{
        id:'formal-challenge',
        title:'If a voter is formally challenged',
        lead:'STOP ordinary check-in and follow the State challenge procedure; do not improvise the challenge decision.',
        official:[
          'A challenger must complete a Challenger Affidavit stating the reason for the challenge.',
          'Give the challenged voter a copy of the Challenger Affidavit and read the Information for Challenged Voter sheet as required.',
          'The voter completes the Challenged Voter Affidavit and provides the applicable identifying document for inspection.',
          'District board members review the materials and vote on whether the voter may vote. A tie vote is resolved in the voter’s favor.',
          'Every district board member signs the Challenged Voter Affidavit; retain the original documents for return to the County Board of Election.'
        ],
        why:'A formal challenge has a specific affidavit, notice, review, and board-vote process with voter rights that must be preserved.',
        tips:['If there is uncertainty or conflict, involve the Master Poll Worker and contact the Board of Elections rather than debating the challenger or voter.'],
        mistakes:['Letting the challenger conduct the questioning.','Skipping the affidavit or voter-rights paperwork.','Making an informal eligibility decision without the documented board process.'],
        actions:['Formal challenge handled through the documented affidavit and district-board process.']
      }]
    };
    procedures.splice(spoilIndex>=0?spoilIndex+1:procedures.length,0,challenger);
  }

  function decorate(){
    if(state.mode!=='election' || state.route!=='guide') return;
    const cards=[...main.querySelectorAll('[data-procedure="opening"]')];
    const card=cards.find(el=>el.querySelector('.procedure-heading h3')?.textContent.trim()==='Election Day Opening');
    if(!card) return;
    const manual=card.querySelector('.election-manual-callout');
    if(manual){
      const strong=manual.querySelector('strong');
      if(strong) strong.textContent='★ KEEP THE MANUALS AT THE TABLE ★';
    }
  }

  const observer=new MutationObserver(decorate);
  observer.observe(main,{childList:true,subtree:true});
  render();
  decorate();
})();
