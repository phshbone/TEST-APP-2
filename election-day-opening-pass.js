// Election Day Opening guide. Separates Election Day from the Early Voting binder workflow.
(function(){
  const procedures=window.APP_DATA?.procedures||[];
  const sharedOpening=procedures.find(p=>p.id==='opening');
  if(!sharedOpening) return;

  // The secured-binder opening remains Early Voting only.
  sharedOpening.modes=['early'];
  sharedOpening.badges=(sharedOpening.badges||[]).filter(x=>x!=='Same for Both');
  if(!sharedOpening.badges.includes('Early Voting')) sharedOpening.badges.unshift('Early Voting');

  const electionOpening={
    id:'opening',
    title:'Election Day Opening',
    modes:['election'],
    type:'teaching',
    summary:'Set the room for safe voter flow, identify the correct machines, open and position the voting equipment, then wire and configure one ePollbook station at a time.',
    badges:['Election Day','Official Procedure + Master Worker Field Guidance'],
    lessons:[
      {
        id:'room-flow',
        title:'Room layout and traffic flow',
        lead:'Use the available room to create clear movement and enough separation between check-in and voting.',
        official:[
          'Position voting machines and tables so voters can move through the polling place safely and privately.',
          'Keep voting-machine cords secured and out of walking paths.',
          'Maintain accessible routes and remove obstacles that could interfere with disabled or elderly voters.'
        ],
        why:'A narrow gap between check-in lines and voting-machine lines can turn into a bottleneck once turnout increases.',
        tips:[
          'When the room allows, leave substantial space between check-in tables and the voting-machine area so the two lines do not merge or cross.',
          'Plan the flow as check in → voting area → exit rather than clustering every station together for convenience.',
          'Voting machines should be positioned with direct access to working wall outlets.'
        ],
        mistakes:[
          'Placing check-in tables so close to the machines that voter lines intermingle.',
          'Using a convenient layout that blocks accessible paths or creates cord hazards.'
        ],
        actions:['Room flow checked before equipment setup begins.']
      },
      {
        id:'identify-machines',
        title:'Identify machines and retrieve the correct keys',
        lead:'Match the numbered Key Envelope to the correct voting machine before opening anything.',
        official:[
          'Locate the Key Envelope in the Red Bag.',
          'Confirm that the machine number on the Key Envelope matches the number on the voting machine.',
          'If a seal is missing, broken, or does not match the Key Envelope, stop and contact the Voting Machine Warehouse.'
        ],
        why:'Election Day materials are assigned to specific machines; a number mismatch is a stop condition, not something to work around.',
        tips:[
          'The Election Day Red Bag is carried with the Election Day materials in the Maroon Bag.',
          'The machine keys may be in separate small manila Key Envelopes labeled with the corresponding machine number. Match the label before opening the machine.'
        ],
        mistakes:['Beginning setup from memory before matching the machine number and Key Envelope.'],
        actions:['Machine number and Key Envelope physically matched.']
      },
      {
        id:'machine-physical',
        title:'Voting-machine physical setup',
        lead:'Position, secure, unseal, uncover, and remove the stored Election Day equipment from the correct machine.',
        official:[
          'Use the chrome handles to position the machine and lock the swivel castors.',
          'Move the light stick to the vertical position.',
          'Use scissors to cut the white seal on the machine covers; place the used seal in the green Spoiled Ballot/Used Seal Bag.',
          'Remove, fold, and place the machine covers at the back of the machine.',
          'Use the barrel key to open the back compartment. Remove the materials stored there, then close and lock the compartment.',
          'Activation Cards, extension reel, and power strips may be split between machines when a district has two machines. The power strips are for ePollbook stations only.'
        ],
        why:'The rear compartment contains the check-in equipment needed for Election Day, and the machine itself must be secured before it is opened for voting.',
        tips:['Move table equipment to the check-in area after it is removed from the voting machine.'],
        mistakes:['Leaving used seals loose instead of placing them in the green Spoiled Ballot/Used Seal Bag.'],
        actions:['Machine positioned, wheels locked, cover removed, rear equipment removed, rear compartment re-locked.']
      },
      {
        id:'router-power',
        title:'Router first — voting machines directly to the wall',
        lead:'Power the location router first, and keep voting-machine power separate from the check-in extension reel and power strips.',
        official:[
          'If the location has the bubble-wrapped router, remove it from the marked voting machine and plug it into a working outlet; it turns on automatically.',
          'The yellow extension reel and power strip are for the check-in station.',
          'The voting machine must be plugged into a working wall outlet. Up to four voting machines may be daisy-chained to one outlet.',
          'Secure voting-machine cords so no one can trip over them.'
        ],
        why:'The router provides Election Day connectivity, while the voting machines have a separate direct-wall power requirement.',
        tips:['In a multi-district room, workers should identify immediately which district has the router and get it powered before check-in setup continues.'],
        mistakes:['Plugging a voting machine into the yellow extension reel or an ePollbook power strip.'],
        actions:['Router powered.','Voting-machine power path confirmed as direct wall power.']
      },
      {
        id:'epb-layout',
        title:'ePollbook station layout — wire first, no power',
        lead:'Lay out one complete station, match the device numbers, and make the equipment connections before supplying power.',
        official:[
          'Follow the visual station diagram supplied with the Election Day ePollbook materials.',
          'Confirm that the Touchpad/ePollbook number matches both printer numbers.',
          'Match the labeled/color-coded connections to the corresponding labeled ports on the Epson printer, ExpressVote printer, server, and associated cables.',
          'Keep wires bundled, facing the poll-worker side, and out of the voter path; use the supplied blue tape for potential tripping hazards.'
        ],
        why:'Completing the physical wiring first makes it easier to catch a crossed connection before a station is powered and paired.',
        tips:[
          'Remove the ePollbooks from the upper section of the suitcase before unloading the heavier printers so the open case does not become top-heavy.',
          'Lay out the equipment and run every color-coded connection first — brown to brown, green to green, red to red, purple to purple, and so on — but DO NOT power the station yet.',
          'The power-strip connection is the final connection step for that individual station.'
        ],
        mistakes:[
          'Supplying power while the station is still being wired.',
          'Mixing printers from one numbered station with a different ePollbook.'
        ],
        actions:['Station numbers matched.','Color-coded wiring visually checked before power is supplied.']
      },
      {
        id:'epb-configure',
        title:'Power and configure one ePollbook station at a time',
        lead:'After the physical wiring is complete, energize one station and use the ePollbook interface to verify its printers before moving to the next station.',
        official:[
          'Set up one ePollbook station at a time to prevent cross-connections between numbered devices.',
          'Open the ePollbook application and verify that the location and district shown are correct; if they are not correct, call the Board of Elections immediately.',
          'The ExpressVote printer can be tested from the ePollbook settings using a loaded blank Activation Card.',
          'During opening/login, both printers provide a test option; use the Troubleshoot Guide if either printer is not working.'
        ],
        why:'Printer selection and testing are performed through the ePollbook software, so the ePollbook interface must be available for the functional test.',
        tips:[
          'Field sequence: once the station is fully wired, make the final power-strip connection, power the ePollbook, then configure the Epson printer and ExpressVote printer through the ePollbook interface.',
          'For printer selection/reconnection, use the matching numbered printer only. Use the interface sequence to Find/Select the matching printer, Test it, and Save the selection.',
          'The ExpressVote printer/server connection can take longer to appear. If it does not appear immediately, allow time and repeat the Find/Test step rather than selecting a different numbered printer.',
          'Use a blank Activation Card for the ExpressVote test when a printed test is easier to confirm in a noisy room.'
        ],
        mistakes:[
          'Powering both district stations at once and accidentally cross-connecting numbered devices.',
          'Selecting a different printer number because the correct printer is slow to appear.'
        ],
        actions:['First station fully tested before the second station is powered.']
      },
      {
        id:'machine-open',
        title:'Open the voting machine using Pilot / Co-Pilot',
        lead:'Use the official Voting Machine Manual in order; one worker reads while the other performs and confirms each step.',
        official:[
          'Verify the required seals against the Key Envelope before removing them.',
          'Plug the voting machine into the working wall outlet and verify its power indicators.',
          'Use the barrel key to open the Top Access Compartment, use the red power button to start the machine, then close and lock the compartment and return the key to the Key Envelope.',
          'Continue the official ExpressVote XL Opening Procedures in the Voting Machine Manual through the ready-for-voting checks.'
        ],
        why:'The machine-opening sequence contains seal, key, power, and readiness checks that should be followed in the published order rather than reconstructed from memory.',
        tips:['Pilot / Co-Pilot works especially well for the voting-machine opening: one person reads the manual step aloud and one person performs it; both verify before advancing.'],
        mistakes:['Working ahead of the reader or skipping a seal/number verification because the setup is familiar.'],
        actions:['Official machine-opening procedure completed and machine ready for voters.']
      },
      {
        id:'manuals-admin',
        title:'Manuals, signage, oath, and final readiness',
        lead:'Keep the reference manuals at the table, finish the required paperwork and signage, and prepare the room for voters.',
        official:[
          'Each district board member must take and sign the Oath of Office before undertaking election duties.',
          'Post the required polling-place, accessibility, electioneering, sample-ballot, and voting-machine instruction signs as applicable.',
          'Use the official clock and be ready to open the polls at the required time.',
          'Election Day materials include the Morris County manuals and the New Jersey State manual.'
        ],
        why:'The manuals are working references for procedures that may occur only occasionally during the day, including provisional, spoil, reprint, flags, and troubleshooting.',
        tips:[
          'Keep the green Morris County Poll Worker Manual at the check-in table and keep the New Jersey State District Board Member Training Manual accessible throughout the day.',
          'If a voter situation is unfamiliar, say that it is not something workers encounter often and that you are checking the manual so it is handled correctly the first time.',
          'The Master Poll Worker should verify attendance and completion of the required opening paperwork before the room is declared ready.'
        ],
        mistakes:['Guessing at an uncommon procedure instead of checking the manual or contacting the Board.'],
        actions:['Manuals accessible.','Required opening paperwork and signage reviewed.','Polling place ready for voters.']
      }
    ]
  };

  const openingIndex=procedures.indexOf(sharedOpening);
  const existingElection=procedures.findIndex((p,i)=>i!==openingIndex && p.id==='opening' && p.modes?.includes('election'));
  if(existingElection>=0) procedures.splice(existingElection,1);
  procedures.splice(openingIndex+1,0,electionOpening);

  function decorateElectionOpening(){
    if(state.mode!=='election' || state.route!=='guide') return;
    const card=main.querySelector('[data-procedure="opening"]');
    if(!card || card.dataset.electionOpeningDecorated) return;
    card.dataset.electionOpeningDecorated='1';
    const heading=card.querySelector('.procedure-heading');
    if(!heading) return;

    const manual=document.createElement('div');
    manual.className='election-manual-callout';
    manual.innerHTML='<strong>KEEP THE MANUALS AT THE TABLE</strong><span>Use the Morris County Poll Worker Manual and the New Jersey State manual whenever a procedure, flag, remedy, or setup step is unclear.</span>';
    heading.insertAdjacentElement('afterend',manual);

    const power=document.createElement('div');
    power.className='warning-box election-power-warning';
    power.innerHTML='<strong>DO NOT plug a voting machine into the yellow extension reel or an ePollbook power strip.</strong><span>Voting machines must use a working wall outlet.</span>';
    manual.insertAdjacentElement('afterend',power);
  }

  const observer=new MutationObserver(()=>decorateElectionOpening());
  observer.observe(main,{childList:true,subtree:true});
  render();
  decorateElectionOpening();
})();
