// Source-reconciliation pass: paraphrases official state/county rules into concise app language.
(function(){
  const get=id=>fieldData.items.find(x=>x.id===id);
  const STATE_MANUAL='https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf';
  const MORRIS_MANUAL='https://www.morriscountynj.gov/files/sharedassets/public/departments/elections/poll-worker-manual.pdf';
  const stateSource=(section,pdfPage)=>({title:'2024 New Jersey District Board Member Training Manual',authority:'NJ Department of State, Division of Elections',section,url:pdfPage?`${STATE_MANUAL}#page=${pdfPage}`:STATE_MANUAL});
  const morrisSource=(section,pdfPage)=>({title:'Morris County Poll Worker Manual — Election Day',authority:'Morris County Board of Elections',section,date:'Last revised May 7, 2024',url:pdfPage?`${MORRIS_MANUAL}#page=${pdfPage}`:MORRIS_MANUAL});

  // Exact-page source links use PDF page numbers, not the printed manual page number.
  const affirm=get('flag-affirm-address');
  if(affirm){affirm.source=morrisSource('ePollbook Manual, Affirm Address, p. 23',27);}

  const moved=get('record-changed-residence');
  if(moved){
    moved.statuses=['Official Procedure'];
    moved.meaning='First determine where the voter moved and when. The voting method changes by residence branch.';
    moved.branchTitle='Residence Path';
    moved.branches=[
      {label:'Same election district',text:'Complete the county change-of-address form and continue with a regular machine ballot.'},
      {label:'Different district within Morris County',text:'Direct the voter to the polling place for the new address; the voter votes provisionally there.'},
      {label:'Out of county — within 21 days before Election Day',text:'Follow the state former-county procedure and complete the required form; the voter may vote on the machine in the former county.'},
      {label:'Out of county — more than 21 days before Election Day',text:'The voter was required to register in the new county and may not vote in the former county.'}
    ];
    moved.steps=[];
    moved.notDo=['Do not treat every move as provisional.','Do not send a same-district mover away from the polling place when the state procedure allows the address change and regular machine vote there.'];
    moved.outcome=null;
    moved.boardQuestion=null;
    moved.source=stateSource('Voters Who Have Changed Their Residence, p. 20',23);
  }

  const signature=get('flag-signature');
  if(signature){signature.source=stateSource('Signature Required, p. 19',22);}

  const idreq=get('flag-id');
  if(idreq){
    idreq.statuses=['Official Procedure','Current Morris Guidance'];
    idreq.meaning='This flag means identification is required before regular check-in can continue.';
    idreq.critical='DO NOT ASK EVERY VOTER FOR ID. Ask only when the voter record specifically requires it.';
    idreq.steps=[
      'Because the voter record shows ID Required, ask the voter to provide an acceptable current identification document.',
      'Verify that the identification corresponds to the voter record.',
      'Use Record ID and complete the identification choices shown on the ePollbook.'
    ];
    idreq.decision={question:'Was acceptable ID provided and recorded?',yes:'Continue regular check-in.',no:'Use the Not Provided path. Process the voter provisionally.'};
    idreq.outcome=null;
    idreq.boardQuestion=null;
    idreq.source=morrisSource('ePollbook Manual, ID Required p. 22; Provisional Ballot Procedures pp. 37–38',26);
  }

  const mailin=get('flag-mailin');
  if(mailin){mailin.source=morrisSource('ePollbook Manual, Mail-In Ballot, p. 21',25);}

  const early=get('flag-early');
  if(early){early.source=morrisSource('ePollbook Manual, Early Voted, p. 21',25);}

  const already=get('flag-already');
  if(already){already.source=morrisSource('ePollbook Manual, Already Voted, p. 22',26);}

  const assistance=get('assistance-field');
  if(assistance){assistance.source=morrisSource('ePollbook Manual, Processing Voter Assistance, pp. 17–20',21);}

  const primary=get('primary-field');
  if(primary){
    primary.statuses=['Official Procedure','Current Morris Guidance'];
    primary.meaning='In a New Jersey primary, affiliated Democratic and Republican voters vote their registered party. An unaffiliated voter may declare Democratic or Republican at check-in and then vote that party’s primary.';
    primary.steps=[
      'If the voter is already affiliated Democratic or Republican, process the voter for that registered party. Do not switch an affiliated voter to the other party at the polling place.',
      'If the voter is UNA, tap Declare Party. The screen flips to the voter so the voter—not the poll worker—selects Democratic or Republican and confirms the choice.',
      'After the declaration, have the voter sign and continue normal check-in. The selected party becomes the voter’s affiliation.',
      'That affiliation remains in effect until the voter notifies the election office of a later change.',
      'A party change intended to affect a Primary Election must be filed at least 55 days before that Primary Election.',
      'A voter may be offered the registration/party-declaration form for a future affiliation change.'
    ];
    primary.notDo=['Do not allow an already-affiliated voter to cross party lines at the polling place.','Do not issue a provisional ballot simply because a voter wants to vote a different party than the party they are registered with.'];
    primary.boardQuestion=null;
    primary.source={title:'Morris County Poll Worker Info Guide — Primary Election, Issue 2',authority:'Morris County Board of Elections',section:'Primary Election FAQs / Unaffiliated Voters / Declare Party; 55-day deadline'};
  }

  const reprint=get('xref-reprint');
  if(reprint){
    reprint.statuses=['Current Morris Guidance'];
    reprint.meaning='Use Re-Print after a check-in is complete when the ballot/activation card or authority slip needs to be printed again.';
    reprint.steps=['Begin from the ePollbook home screen after the original check-in has been completed.','Open Launchpad and choose Re-Print.','Find the completed voter record using the standard Election Day 3 & 3 search.','Choose the correct voter and use Re-Print for the item that must be replaced.','Confirm the replacement printed correctly, then resume normal check-in workflow.'];
    reprint.source=morrisSource('ePollbook Manual, Re-Printing a Ballot or Authority Slip, p. 25',29);
  }

  const provisional=get('xref-provisional');
  if(provisional){
    provisional.source=morrisSource('Provisional Ballot Procedures, pp. 35–45',39);
    provisional.meaning='A provisional ballot is used only when the voter’s situation requires it. Morris specifically lists Mail-In Ballot, Early Voted, Already Voted, No ID Provided, Moved within Morris County, and No Signature on File among provisional reasons.';
  }

  const spoil=get('xref-spoil');
  if(spoil){spoil.source=morrisSource('Spoiling a Ballot Procedures, pp. 47–54',51);}

  const equipment=get('equipment-escalation');
  if(equipment){equipment.source=morrisSource('Troubleshoot Guide, p. 55 and following',59);}

  // A source without a stable/public target remains text-only rather than pointing to the wrong document.
  // Questions that were previously open are now answered by the supplied official sources.
  fieldData.boardQueue=[];
  render();
})();
