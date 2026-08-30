// Early Voting / shared Trainer Checklist content corrections captured during page review.
(function(){
  const procedures=window.APP_DATA?.procedures||[];
  const byId=id=>procedures.find(p=>p.id===id);

  const morning=byId('morning');
  if(morning){
    morning.title='Midweek Morning Opening';
    morning.steps=[
      'Gather the current numbered binder and opening materials: seal log, barrel key, small manila envelope, pen, and scissors.',
      'Compare the numbered string seal with the carried-forward value on the seal log.',
      'Initial the seal log after physical verification.',
      'Cut the seal and place it in the green used-seal bag.',
      'Open the media-access door with the barrel key.',
      'Power on, close the door, remove the key, and return it to the red pouch.',
      'Print the System Readiness Report.',
      'Have two workers from different parties review and initial the report.',
      'Place the report into the correct daily black pencil pouch.',
      'Confirm power, status light, locked wheels, curtains, rods, and accessible setup.'
    ];
  }

  const shutdown=byId('shutdown');
  if(shutdown){
    shutdown.title='Midweek Nightly Shutdown';
    shutdown.summary='Verify the machine count, print the System Readiness Report, power down, complete seal and canister work, then close the ePollbooks after reconciliation.';
    shutdown.warning='DO NOT SELECT CLOSE POLL during an ordinary midweek Early Voting night. DO NOT shut down all ePollbooks until the Master Poll Worker has verified and reconciled the totals. * Exact Early Voting close-for-day/resync screen labels and the voting-machine power-control label still require confirmation.';
    shutdown.steps=[
      'Gather the current binder and nightly closing materials. Retrieve the individual replacement seals from the small manila envelope so they are ready for the applicable seal steps.',
      'At each replacement-seal step, match the seal number to the seal log and initial after physical verification.',
      'Verify the voting machine public counter.',
      'Press Mode, enter the required password/passcode, and open the Reports menu.',
      'Print the System Readiness Report.',
      'Use the upper-right power control to shut down the voting machine.*',
      'Close the machine cover, then move to the rear media-access area.',
      'Verify the carried-forward media-access seal information and install the applicable replacement string seal after matching it to the seal log.',
      'Move to the side access door; verify and remove the right-side red tape seal.',
      'Place the removed tape seal on the index card in the daily envelope.',
      'Remove the outgoing canister.',
      'Verify the red front canister seal.',
      'Apply and verify the outgoing blue transport seal.',
      'Give the sealed outgoing canister to the runner.',
      'Record the incoming canister and blue seal information.',
      'Remove the incoming blue seal and place it in the green used-seal bag.',
      'Insert the replacement canister and lock it into place.',
      'Apply the new red tape panel seal across both surfaces and complete the applicable seal-log verification.',
      'Carry forward known information only after physical verification.',
      'After the Master Poll Worker has verified and reconciled the totals, unplug each ePollbook/iPad before beginning its shutdown.',
      'The worker must be logged in to log out. If needed, log back in, open the hamburger menu, and select Logout.',
      'Use the Early Voting close-for-day command*, enter the required password/passcode, and confirm the close-for-day prompt.',
      'Allow synchronization to complete. If transactions remain pending, use the resync control* and verify that syncing completes.',
      'Use the device app switcher and swipe the ePollbook app closed, then power off the iPad/device completely.',
      'Fold the ePollbook and move it to the secured Early Voting cage/storage area.',
      'Keep the router powered until all ePollbooks have finished synchronizing. Power the router down last, then return it to the secured cage/storage area.'
    ];
  }

  const checkin=byId('checkin');
  if(checkin){
    checkin.summary='Preload the activation card, confirm the voter, inspect every flag, verify the signature, and complete check-in once.';
    const lessons=checkin.lessons||[];
    const lesson=id=>lessons.find(x=>x.id===id);

    const preload=lesson('preload');
    if(preload){
      preload.lead='Before starting the next check-in, physically confirm that one blank activation card is loaded in the ExpressVote printer.';
      preload.official=[
        'Confirm one blank activation card is loaded before beginning every voter check-in.',
        'If the pending check-in screen still offers Reprint before advancing to the Authority Slip screen, use that on-screen Reprint immediately when a card was not preloaded.',
        'If you have already advanced to the Authority Slip screen, use Reprint from the hamburger menu.',
        'DO NOT check the voter in again.'
      ];
      preload.why='A missed preload interrupts voter flow and creates a recovery situation that must be handled with Reprint, not a second check-in.';
      preload.tips=[
        'Place a small handwritten PRELOAD CARD reminder on or directly in front of the Epson printer.',
        'The authority slip is often the last item removed from the Epson printer, making that location an effective final visual reminder.',
        'Build the preload check into the transition from the completed voter to the next voter.'
      ];
      preload.mistakes=[
        'DO NOT check the voter in a second time when the activation card was not preloaded; use Reprint.',
        'Beginning the next voter check-in without physically confirming the blank activation card.'
      ];
      preload.actions=['Blank activation card physically confirmed before starting the next voter check-in.'];
    }

    const search=lesson('search');
    if(search){
      search.lead='Use the correct search method for the current mode and keep searching before escalating.';
      search.official=[
        'Early Voting: use the 4+4 search method with the countywide voter list.',
        'Use the voter information provided to locate the correct record.',
        'Review the result list carefully before selecting a voter.'
      ];
      search.tips=[
        'Early Voting reminder: use 4+4. The voter list is countywide, so search broadly and carefully.',
        'Use alternate search methods when spelling, spacing, or a compound surname may affect the result.',
        'If a voter presents a scannable sample ballot, use the available sample-ballot scan function when appropriate.',
        'If a voter presents a driver’s license for scanning, use the available driver’s-license scan function when appropriate. DO NOT turn this into a request for ID.'
      ];
    }

    const confirm=lesson('confirm');
    if(confirm){
      confirm.official=[
        'Have the voter state the information used to confirm the record, such as address or date of birth.',
        'Compare the voter-stated information with the voter record before continuing.'
      ];
    }

    const signature=lesson('signature');
    if(signature){
      signature.official=[
        'Have the voter sign where directed.',
        'Use Sign Again when the current signature needs another attempt.',
        'Contact the Board of Elections when the discrepancy remains unresolved.'
      ];
      signature.tips=[
        'Slow the process down before asking for a second signature so the voter understands why another attempt is needed.',
        'Training phrasing used in the field: explain the difference between a quick “Home Depot signature” and the voter’s more formal or official signature.'
      ];
    }

    const complete=lesson('complete');
    if(complete){
      complete.lead='Complete the current voter check-in once, organize the printed materials, preload the next blank activation card, and return the ePollbook to Process Next Voter.';
      complete.official=[
        'Complete check-in only after the voter record, flags, signature, worker initials, and activation-card preload have been confirmed.',
        'Place the printed activation card into the Activation Card Sleeve to protect it from bending.',
        'Have the voter complete the required authority-slip signature. Retain the signed portion for the Yellow Signed Authority Slip Bag and give the voter the appropriate copy with the Activation Card Sleeve.',
        'Place the completed retained authority slip in the Yellow Signed Authority Slip Bag.',
        'Preload the blank activation card for the next voter.',
        'Return the ePollbook to Process Next Voter.'
      ];
      complete.why='A consistent closing rhythm keeps one voter’s materials together and leaves the ePollbook ready for the next voter.';
      complete.tips=[
        'Keep the voter’s authority-slip copy visibly associated with the Activation Card Sleeve rather than hidden inside it, so it is less likely to be missed or lost.',
        'Teach the worker to perform the final ePollbook-and-printer reset before greeting the next voter.'
      ];
      complete.mistakes=[
        'Beginning the next search while materials from the prior voter remain on the work surface.',
        'Repeating check-in because an expected printout is missing instead of using Reprint.'
      ];
      complete.actions=[
        'Worker initials completed.',
        'Activation card placed in the sleeve and authority slip handled correctly.',
        'Next blank activation card preloaded.',
        'ePollbook returned to Process Next Voter.'
      ];
    }

    const order=['preload','search','confirm','flags','signature','complete'];
    checkin.lessons=order.map(id=>lesson(id)).filter(Boolean);
  }

  const mailin=byId('mailin');
  if(mailin){
    mailin.steps=[
      'Confirm the Mail-In Ballot flag.',
      'Explain that the voter cannot receive a regular machine ballot.',
      'Explain the voter’s two practical choices: locate the mail-in ballot and return it to an authorized ballot drop box or the Morris County Board of Elections in Morristown, or vote provisionally in person.',
      'If the voter chooses to vote in person, process the voter provisionally.',
      'Use Box 13 on the provisional envelope for mail-in opt-out when requested.',
      'DO NOT accept the completed mail-in ballot at the polling location.'
    ];
  }

  const notfound=byId('notfound');
  if(notfound){
    notfound.steps=[
      'Confirm spelling.',
      'Search again.',
      'Use alternate search methods.',
      'Use address or district lookup.',
      'Contact the Master Poll Worker or Board of Elections.',
      'DO NOT begin a new check-in unless directed.'
    ];
  }

  const provisional=byId('provisional');
  if(provisional){
    provisional.steps=[
      'Confirm that provisional voting is the correct remedy.',
      'Complete the ePollbook provisional process.',
      'Confirm a blank activation card is loaded before printing.',
      'Have the voter complete the affirmation envelope based on the applicable voter flag and required information.',
      'Have the voter vote on the machine using the provisional activation card.',
      'Have the voter place the completed activation card inside the affirmation envelope, seal the envelope, and hand the sealed envelope to the poll worker.',
      'The poll worker places the sealed envelope in the orange provisional bag.',
      'Add one tally mark to the reconciliation sheet.',
      'At closing, physically count the provisional envelopes and compare the count with the tally sheet.',
      'Obtain required signatures and seal the orange provisional bag through both the grommet and zipper hole.'
    ];
  }

  const reprint=byId('reprint');
  if(reprint){
    reprint.summary='Replace a missing, misprinted, or unprinted item from an already completed check-in without checking the voter in again.';
    reprint.steps=[
      'Confirm that the voter check-in is already complete.',
      'Identify the missing, misprinted, or unprinted item.',
      'If the completed check-in screen still offers Reprint, use that on-screen Reprint first.',
      'If the completed check-in screen has already advanced, open the hamburger menu and select the appropriate Reprint option.',
      'Use Reprint for the activation card, authority slip, assistance form, or a printer-jam recovery as applicable.',
      'Confirm the correct printer is connected.',
      'After the replacement prints, return the ePollbook to the next voter check-in.',
      'DO NOT check the voter in again.'
    ];
  }

  const spoil=byId('spoil');
  if(spoil){
    spoil.summary='Cancel the printed, uncast ballot, eject the card, process the spoil, and decide whether to reissue.';
    spoil.steps=[
      'At the voting machine, have the voter select Cancel.',
      'Send two workers from different parties to the machine.',
      'Protect the administrative password from the voter’s view while preserving the voter’s ballot privacy.',
      'Use the voter-choice cancellation reason and eject the activation card.',
      'During Early Voting, process the spoil at an appropriate ePollbook.',
      'On Election Day, return the voter to the assigned district table.',
      'Ask whether the voter wants another ballot now.',
      'For reissue, preload a blank activation card before printing the replacement.',
      'For no reissue, DO NOT create another check-in.',
      'Mark the large barcode with one clear vertical pen line through one of its vertical bars so the spoiled card cannot be read again; complete the remaining SPOILED-card handling required by the current procedure.'
    ];
  }

  function preserveGuideTopicOnModeSwitch(){
    document.querySelectorAll('.mode-button').forEach(button=>{
      button.onclick=()=>{
        let anchorId=null;
        let offset=0;
        if(state.route==='guide'){
          const cards=[...main.querySelectorAll('[data-procedure]')];
          const top=main.getBoundingClientRect().top;
          const candidate=cards
            .map(el=>({el,d:Math.abs(el.getBoundingClientRect().top-top)}))
            .sort((a,b)=>a.d-b.d)[0]?.el;
          if(candidate){
            anchorId=candidate.dataset.procedure;
            offset=candidate.getBoundingClientRect().top-top;
          }
        }
        state.mode=button.dataset.mode;
        saveState();
        render();
        if(anchorId){
          requestAnimationFrame(()=>{
            const target=main.querySelector(`[data-procedure="${anchorId}"]`);
            if(target) main.scrollTop+=target.getBoundingClientRect().top-main.getBoundingClientRect().top-offset;
          });
        }
      };
    });
  }

  function applyGuidePresentation(){
    const shutdownCard=main.querySelector('[data-procedure="shutdown"]');
    const warning=shutdownCard?.querySelector('.warning-box');
    if(warning && !warning.dataset.guideHierarchy){
      warning.dataset.guideHierarchy='1';
      warning.innerHTML='<div class="shutdown-warning-title">★ DO NOT SELECT CLOSE POLL ★</div><div class="shutdown-warning-line">During an ordinary Midweek Early Voting night, use the nightly shutdown procedure.</div><div class="shutdown-warning-line"><strong>DO NOT</strong> shut down all ePollbooks until the Master Poll Worker has verified and reconciled the totals.</div><div class="shutdown-warning-note">* Exact Early Voting close-for-day/resync screen labels and the voting-machine power-control label still require confirmation.</div>';
    }

    const root=main.querySelector('[data-procedure="checkin"]')?.parentElement||main;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const targets=[];
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(node.parentElement?.closest('strong,.shutdown-warning-title')) continue;
      if(node.nodeValue?.includes('DO NOT')) targets.push(node);
    }
    targets.forEach(node=>{
      const parts=node.nodeValue.split('DO NOT');
      const frag=document.createDocumentFragment();
      parts.forEach((part,i)=>{
        if(i) { const strong=document.createElement('strong'); strong.className='critical-do-not'; strong.textContent='DO NOT'; frag.appendChild(strong); }
        if(part) frag.appendChild(document.createTextNode(part));
      });
      node.replaceWith(frag);
    });
  }

  const guideObserver=new MutationObserver(()=>applyGuidePresentation());
  guideObserver.observe(main,{childList:true,subtree:true});

  preserveGuideTopicOnModeSwitch();
  render();
  preserveGuideTopicOnModeSwitch();
  applyGuidePresentation();
})();
