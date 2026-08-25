window.APP_DATA = {
  procedures: [
    {
      id:'opening', title:'Opening Overview', modes:['early','election'],
      summary:'Gather workers, verify equipment identity, and follow the secured binder sequence without working ahead.',
      badges:['Same for Both','Official Procedure'],
      warning:'Use the current machine binder. Do not reconstruct secured opening instructions from memory.',
      steps:['Gather workers at the master table or cage.','Distribute badges and explain assignments.','Explain that workers must stop if a seal, report, screen, or number differs.','Match each binder to the correct machine.','Set up one numbered ePollbook station at a time.','Confirm one blank activation card is loaded before test check-in.']
    },
    {
      id:'morning', title:'Intermediate Morning Opening', modes:['early'],
      summary:'Verify the carried-forward media-door seal, power on, print readiness report, and prepare the machine.',
      badges:['Early Voting','Master Worker Practice'],
      steps:['Compare the numbered string seal with the carried-forward value.','Initial the seal log after physical verification.','Cut the seal and place it in the green used-seal bag.','Open the media-access door with the barrel key.','Power on, close the door, remove the key, and return it to the red pouch.','Print the System Readiness Report.','Have two workers from different parties review and initial the report.','Place the report into the correct daily black pouch.','Confirm power, status light, locked wheels, curtains, rods, and accessible setup.']
    },
    {
      id:'shutdown', title:'Intermediate Nightly Shutdown', modes:['early'],
      summary:'Reconcile, exchange the canister, reseal, power down, and prepare for the next day.',
      badges:['Early Voting','Critical'],
      warning:'DO NOT SELECT CLOSE POLL during an ordinary intermediate early-voting night.',
      steps:['Verify and remove the right-side red tape seal.','Place the removed tape seal on the index card in the daily envelope.','Remove the outgoing canister.','Verify the red front canister seal.','Apply and verify the outgoing blue transport seal.','Give the sealed outgoing canister to the runner.','Record the incoming canister and blue seal information.','Remove the incoming blue seal and place it in the green used-seal bag.','Insert the replacement canister and lock it into place.','Apply the new red tape panel seal across both surfaces.','Carry forward known information only after physical verification.']
    },
    {
      id:'checkin', title:'Standard Voter Check-In', modes:['early','election'], type:'teaching',
      summary:'Confirm the voter, inspect flags, verify signature, preload the activation card, and complete check-in once.',
      badges:['Same for Both','Teaching Guide Prototype'],
      lessons:[
        {
          id:'search', title:'Search for the voter',
          lead:'Use the correct search method for the current mode and keep searching before escalating.',
          official:['Use the voter information provided to locate the correct record.','Review the result list carefully before selecting a voter.'],
          why:'A rushed search can lead to the wrong record, a missed existing record, or an unnecessary escalation.',
          tips:['Early voting uses the countywide voter list, so search broadly and carefully.','Use alternate search methods when spelling, spacing, or a compound surname may affect the result.'],
          mistakes:['Selecting the first similar name without verifying the record.','Treating a failed first search as proof that the voter is not registered.'],
          actions:[]
        },
        {
          id:'confirm', title:'Confirm the correct voter record',
          lead:'Verify that the record on screen belongs to the person standing in front of you.',
          official:['Ask the voter to state information used to confirm the record, such as address or date of birth.','Compare the stated information with the voter record before continuing.'],
          why:'People with identical or similar names may live at the same address or appear next to one another in search results.',
          tips:['Date of birth is especially useful when distinguishing a parent and adult child or possible senior/junior records.','Use the information in the record rather than relying on appearance alone.','When something feels inconsistent, pause and verify before moving forward.'],
          mistakes:['Reading the answer from the screen and asking the voter only to agree.','Assuming a person is the correct voter because the name and address look familiar.'],
          actions:[]
        },
        {
          id:'flags', title:'Review eligibility and every flag',
          lead:'Do not move past the voter screen until eligibility and all visible flags have been reviewed.',
          official:['Read and follow each applicable ePollbook instruction.','Escalate when the flag or remedy is unclear.'],
          why:'Flags may change whether the voter receives a regular ballot, provisional ballot, identification request, or Board assistance.',
          tips:['Say the flag name aloud during training so the worker learns to notice it.','Teach workers to stop rather than click through an unfamiliar message.'],
          mistakes:['Focusing on the voter’s name and missing a flag.','Treating different flags as though they all have the same remedy.'],
          actions:[]
        },
        {
          id:'signature', title:'Obtain and verify the signature',
          lead:'Follow the signature prompts and distinguish a current mismatch from a No Signature on File flag.',
          official:['Have the voter sign where directed.','Use Sign Again when the current signature needs another attempt.','Contact the Board when the discrepancy remains unresolved.'],
          why:'No Signature on File and a mismatch during the current check-in are different situations and may require different procedures.',
          tips:['Slow the process down before asking for a second signature so the voter understands why another attempt is needed.'],
          mistakes:['Treating every signature issue as provisional.','Ignoring the distinction between a missing stored signature and a current mismatch.'],
          actions:[]
        },
        {
          id:'preload', title:'Confirm the activation card is preloaded',
          lead:'Before completing check-in, physically confirm that one blank activation card is loaded in the ExpressVote printer.',
          official:['Confirm one blank activation card is loaded before every check-in.','When check-in is complete but the card was not preloaded, use Reprint.','Do not check the voter in again.'],
          why:'A missed preload interrupts the voter flow and creates a recovery situation that workers may accidentally handle as a second check-in.',
          tips:['Place a small handwritten PRELOAD CARD reminder on or directly in front of the Epson printer.','The authority slip is often the last item removed from the Epson printer, making that location an effective final visual reminder.','Keep blank cards in one consistent location and build the preload check into the transition between voters.'],
          mistakes:['Completing check-in without physically checking the card slot.','Checking the voter in a second time instead of using Reprint.'],
          actions:['Blank activation card physically confirmed before completing check-in.']
        },
        {
          id:'complete', title:'Complete check-in and manage printed materials',
          lead:'Complete the transaction once, keep the printed materials organized, and return the station to Process Next Voter.',
          official:['Complete check-in only after the voter record, flags, signature, initials, and preload are confirmed.','Manage the authority slip and activation card according to the current instructions.','Return the ePollbook to Process Next Voter.'],
          why:'A consistent closing rhythm prevents materials from being mixed between voters and leaves the station ready for the next person.',
          tips:['Use the same placement pattern for the authority slip and activation card at every station.','Teach the worker to perform a final screen-and-printer reset before greeting the next voter.'],
          mistakes:['Beginning the next search while materials from the prior voter remain on the work surface.','Repeating check-in because an expected printout is missing.'],
          actions:['Worker initials completed.','Activation card and authority slip handled correctly.','Station returned to Process Next Voter.']
        }
      ]
    },
    {
      id:'mailin', title:'Mail-In Ballot', modes:['early','election'],
      summary:'A mail-in voter cannot receive a regular machine ballot and must be processed provisionally when voting in person.',
      badges:['Same for Both','Current Morris Update'],
      warning:'Do not accept a completed mail-in ballot at the polling location.',
      steps:['Confirm the Mail-In Ballot flag.','Explain that the voter cannot receive a regular machine ballot.','Process the voter provisionally.','Use Box 13 on the provisional envelope for mail-in opt-out when requested.','Direct returned mail-in ballots to an authorized drop box or Board location.']
    },
    {
      id:'notfound', title:'Voter Not Found', modes:['early','election'],
      summary:'Stop, search again, use alternate methods, and contact the Board before selecting Voter Not Found.',
      badges:['Same for Both','Critical'],
      warning:'DO NOT EVER SELECT VOTER NOT FOUND WITHOUT EXPRESS BOARD OF ELECTIONS DIRECTION.',
      steps:['Confirm spelling.','Search again.','Use alternate search methods.','Use address or district lookup.','Contact the master worker or Board.','Do not begin a new check-in unless directed.']
    },
    {
      id:'provisional', title:'Provisional Ballots', modes:['early','election'],
      summary:'Complete the ePollbook process, secure the envelope, tally it, and reconcile the physical count.',
      badges:['Same for Both','Official Procedure'],
      steps:['Confirm that provisional voting is the correct remedy.','Complete the ePollbook provisional process.','Confirm a blank activation card is loaded before printing.','Complete the affirmation envelope and required notices.','Seal the completed activation card inside the envelope.','Place the sealed envelope in the orange provisional bag.','Add one tally mark to the reconciliation sheet.','At closing, physically count envelopes and compare with the tally sheet.','Obtain required signatures and seal through both grommet and zipper hole.']
    },
    {
      id:'reprint', title:'Reprint', modes:['early','election'],
      summary:'Recover an item from a completed check-in without checking the voter in again.',
      badges:['Same for Both','Current Morris Update'],
      warning:'Do not check the voter in again.',
      steps:['Confirm that check-in is already complete.','Identify the missing or damaged printed item.','Use Reprint for the activation card, authority slip, assistance form, or jammed print.','Confirm the correct printer is connected.','Return to the normal workflow after the replacement prints.']
    },
    {
      id:'spoil', title:'Spoil a Ballot', modes:['early','election'],
      summary:'Cancel the uncast ballot, eject the card, process the spoil, and decide whether to reissue.',
      badges:['Early Voting / Election Day Difference','Current Morris Update'],
      steps:['At the machine, have the voter select Cancel.','Send two workers from different parties to the machine.','Protect voter privacy during the administrative screen.','Use the voter-choice cancellation reason and eject the card.','During early voting, process the spoil at any appropriate site station.','On Election Day, return the voter to the assigned district table.','Ask whether the voter wants another ballot now.','For reissue, preload a blank activation card before printing.','For no reissue, do not create another check-in.','Cross out the barcode, fold to the barcode, write SPOILED, and place the card in the green bag.']
    }
  ],
  dosDonts:{
    dos:[
      {text:'Follow the current screen and secured binder instructions in order.',detail:'Stop when a screen, seal, report, number, or physical setup differs from expectations.',tags:['Official Procedure','Same for Both']},
      {text:'Confirm the correct voter record before continuing.',detail:'Use voter-stated information such as address or date of birth to distinguish similar records.',tags:['Official Procedure','Check-In']},
      {text:'Review every voter flag and follow the specific remedy.',detail:'Different flags can lead to different outcomes; do not treat them as interchangeable.',tags:['Official Procedure','Check-In']},
      {text:'Confirm one blank activation card is loaded before completing check-in.',detail:'A missing preload is recovered through Reprint after check-in is complete.',tags:['Current Morris Update','Check-In']},
      {text:'Stop and ask the master worker or Board before improvising.',detail:'Escalation is safer than creating a duplicate record or using the wrong ballot process.',tags:['Official Procedure','Same for Both']}
    ],
    donts:[
      {text:'Do not ask every voter for identification.',detail:'Request identification only when the voter record shows Voter ID Required.',tags:['Official Do Not','Check-In']},
      {text:'Do not select Voter Not Found without express Board direction.',detail:'Continue searching and escalate before beginning any new-record process.',tags:['Critical','Same for Both']},
      {text:'Do not check a voter in a second time to recover a missing printout.',detail:'Use Reprint when the original check-in is already complete.',tags:['Current Morris Update','Reprint']},
      {text:'Do not confuse Reprint with Spoil.',detail:'Reprint recovers a missing printed item; Spoil cancels an uncast ballot card.',tags:['Current Morris Update','Same for Both']},
      {text:'Do not select Close Poll during an intermediate early-voting night.',detail:'Use the secured nightly shutdown path in the current binder.',tags:['Critical','Early Voting']}
    ]
  },
  trainingTopics:[
    'Opening and worker orientation','Numbered station setup','Activation-card preload','Standard voter check-in','Mail-In Ballot','Already Voted','Early Voted','Voter Not Found','ID Required','Provisional ballots','Reprint','Spoil','Crowd flow','Who to call before improvising'
  ],
  currentLinks:[
    {title:'Morris County Elections',url:'https://www.morriscountynj.gov/Departments/Elections'},
    {title:'New Jersey Division of Elections',url:'https://www.nj.gov/state/elections/'},
    {title:'New Jersey Election Law — Title 19',url:'https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu'}
  ]
};

window.FIELD_PROCEDURES = {
  categories:[
    {id:'flags',title:'ePollbook Flags',description:'Flags and tagged voter records that interrupt normal check-in.'},
    {id:'records',title:'Forms & Record Changes',description:'Affirmation, correction, name and address changes.'},
    {id:'provisional',title:'Provisional Ballots',description:'When provisional voting is the required outcome.'},
    {id:'mail',title:'Vote-by-Mail',description:'Mail-In flags and in-person options.'},
    {id:'reprint',title:'Reprint',description:'Recover a missing print without checking in twice.'},
    {id:'spoil',title:'Spoil',description:'Cancel and replace an uncast ballot.'},
    {id:'assistance',title:'Voter Assistance',description:'Accessibility and assistance procedures.'},
    {id:'primary',title:'Primary Election',description:'Party affiliation and primary-only situations.'},
    {id:'openclose',title:'Opening / Closing',description:'Cross-links to existing opening and closing procedures.'},
    {id:'equipment',title:'Equipment / Troubleshooting',description:'Operational recovery and escalation.'}
  ],
  items:[
    {
      id:'flag-normal', category:'flags', title:'Normal / No Flag', aliases:['normal','no flag','regular voter'], modes:['early','election'],
      statuses:['Official Procedure'], meaning:'No special ePollbook tag changes the normal voter-processing workflow.',
      steps:['Confirm the correct voter record.','Review the screen for any flags before continuing.','Follow the standard signature, activation-card preload, and check-in workflow.'],
      outcome:'Regular ballot, assuming no other issue appears during processing.', relatedGuide:'checkin'
    },
    {
      id:'flag-affirm-address', category:'flags', title:'Affirm Address', aliases:['affirm','affirm address','affirmation','residence','returned mail','moved','change address','address change','correction','correction of record'], modes:['early','election'],
      statuses:['Official Procedure','Needs Board Confirmation'],
      meaning:'The voter record is flagged for an address/residency affirmation. The voter must complete the applicable residency form before the voting outcome is determined.',
      decision:{question:'Does the voter still reside within the election district shown for the record?',yes:'YES → Complete the Affirmation of Residency. If the voter affirms they still reside in the district, they vote by machine.',no:'NO → Use the changed-residence path. Same-district moves use the county record-change form and still vote by machine; another district within the county requires voting at the new polling place by provisional ballot.'},
      steps:['Do not ask the voter for ID or proof of address solely because of the Affirm Address flag.','Have the voter complete the Affirmation of Residency Affidavit / county-supplied residency form.','Review the form and determine residency status using the information provided by the voter.','If the voter states they have not moved and still reside in the election district, continue to a regular machine ballot.','If the voter has moved, follow the Changed Residence procedure rather than having the voter affirm the old address.'],
      notDo:['Do not demand identification or proof of address for this flag alone.','Do not treat every move as the same provisional-ballot situation.'],
      outcome:'Depends on residence: same district → regular machine ballot after the required form; another district within Morris County → new polling place and provisional ballot. Other county-move situations require the specific changed-residence rule.',
      form:'Affirmation of Residency / Morris County Correction of Record–Affirmation of Residence form.',
      escalation:'Call the Board when the voter’s residence situation does not fit the documented branches, the ePollbook action is unclear, or current Morris guidance conflicts with the state manual.',
      boardQuestion:'The 2024 State manual does not state that two workers from different parties must witness this Affirmation. Confirm whether Morris County currently requires that practice.',
      source:{title:'2024 New Jersey District Board Member Training Manual',authority:'NJ Department of State, Division of Elections',section:'Affirm Address; Voters Who Have Changed Their Residence, pp. 19–20 (PDF pages 22–23)',date:'2024-10-25',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'},
      relatedGuide:'checkin'
    },
    {
      id:'record-changed-residence', category:'records', title:'Changed Residence / Address Change', aliases:['moved','address change','change address','correction of record','new address'], modes:['early','election'], statuses:['Official Procedure'],
      meaning:'A voter reports that the residence in the voter record is no longer current. The voting outcome depends on where and when the voter moved.',
      steps:['Determine whether the move is within the same election district, to another district in the same county, or outside the county.','Within the same election district: have the voter complete the county form used to record the address change; the voter votes by machine.','Another election district within Morris County: direct the voter to the polling place for the new residence; the voter votes by provisional ballot there.','Outside the county after the close of registration: follow the state rule for the former county and complete the proper form.','Outside the county in time to register there: the state manual says the voter was required to register in the new county and may not vote in the prior county.'],
      notDo:['Do not reduce every address change to “Moved = Provisional.”'],
      outcome:'Same district → regular machine ballot. Different district in county → provisional at new polling place. Out-of-county outcome depends on timing of the move.',
      form:'County-supplied record-change form. Morris combined Correction of Record / Affirmation of Residence form should be attached when available in the project sources.',
      source:{title:'2024 New Jersey District Board Member Training Manual',authority:'NJ Department of State, Division of Elections',section:'Voters Who Have Changed Their Residence, p. 20',date:'2024-10-25',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'},
      relatedGuide:'checkin'
    },
    {
      id:'record-correction', category:'records', title:'Correction of Record', aliases:['correction','correction of record','name change','address change','deceased','death','former information','new information'], modes:['early','election'], statuses:['Needs Board Confirmation'],
      meaning:'Use the current Morris County record-correction form for changes or reports supported by the form and current county instructions.',
      steps:['Identify the exact change being reported.','Use the current county form rather than reconstructing fields from memory.','Complete only the section that applies to the reported change.','Follow the current Morris return/filing instructions.'],
      outcome:'Record maintenance procedure; voting outcome depends on the underlying voter situation.',
      form:'Morris County Correction of Record / Affirmation of Residence combined form.',
      escalation:'Until the uploaded/current form is available in the working repository, verify form fields and filing instructions with the Board before treating detailed uses as official.',
      boardQuestion:'Verify the current combined form field-by-field, including deceased-voter reporting and whether signature updates belong on this form.'
    },
    {
      id:'flag-signature', category:'flags', title:'Signature Required / No Signature on File', aliases:['signature required','no signature','missing signature','signature'], modes:['early','election'], statuses:['Official Procedure'],
      meaning:'The voter’s stored poll-book signature is missing or marked No Signature.',
      steps:['Recognize this as a missing stored signature issue, not merely a current signature mismatch.','Process the voter using the provisional-ballot procedure.'],
      notDo:['Do not treat this as an ordinary Sign Again situation.'], outcome:'Provisional ballot.',
      source:{title:'2024 New Jersey District Board Member Training Manual',authority:'NJ Department of State, Division of Elections',section:'Signature Required, p. 19',date:'2024-10-25',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'}, relatedGuide:'checkin'
    },
    {id:'flag-mailin',category:'flags',title:'Mail-In Ballot',aliases:['mail in','mail-in','vote by mail','vbm'],modes:['early','election'],statuses:['Official Procedure','Current Morris Guidance'],meaning:'The voter record indicates a mail-in ballot status that changes in-person voting options.',sharedProcedure:'mailin',outcome:'If voting in person under the documented mail-in exception, provisional ballot; do not accept the voter’s completed mail-in ballot at the polling place.'},
    {id:'flag-id',category:'flags',title:'ID Required / Active Need ID',aliases:['id required','need id','active need id'],modes:['early','election'],statuses:['Official Procedure'],meaning:'The voter record specifically requires identification before a regular ballot can be issued.',steps:['Ask for a current and valid identifying document only when the voter record shows the ID requirement.','If the voter cannot provide the required ID, process according to the provisional-ballot rule.'],outcome:'Required ID provided → continue regular processing. Required ID not provided → provisional ballot.',source:{title:'2024 New Jersey District Board Member Training Manual',authority:'NJ Department of State, Division of Elections',section:'ID Required, p. 19',date:'2024-10-25',url:'https://www.nj.gov/state/elections/assets/pdf/guidelines/2024/2024-1025-board-worker-training-manual.pdf'}},
    {id:'flag-notfound',category:'flags',title:'Voter Not Found',aliases:['not found','voter not found','missing voter'],modes:['early','election'],statuses:['Master Worker Practice','Critical'],meaning:'The initial search did not locate the voter; this is a search/escalation state, not permission to create a new path without direction.',sharedProcedure:'notfound',outcome:'Additional determination required / contact Board.'},
    {id:'flag-already',category:'flags',title:'Already Voted',aliases:['already voted','voted'],modes:['early','election'],statuses:['Official Procedure'],meaning:'The record indicates the voter has already been credited as voting. Stop ordinary check-in and follow the existing Already Voted escalation procedure.',outcome:'Additional determination required / contact Board.'},
    {id:'flag-early',category:'flags',title:'Early Voted',aliases:['early voted','voted early'],modes:['early','election'],statuses:['Official Procedure'],meaning:'The record indicates an early-voting participation status. Stop ordinary check-in and follow the existing Early Voted procedure.',outcome:'Additional determination required / contact Board.'},
    {id:'xref-provisional',category:'provisional',title:'Provisional Ballots',aliases:['provisional','paper ballot'],modes:['early','election'],statuses:['Official Procedure'],sharedProcedure:'provisional',meaning:'Cross-link to the existing shared provisional-ballot procedure.'},
    {id:'xref-reprint',category:'reprint',title:'Reprint',aliases:['reprint','missing card','jammed print'],modes:['early','election'],statuses:['Current Morris Guidance'],sharedProcedure:'reprint',meaning:'Cross-link to the existing shared Reprint procedure.'},
    {id:'xref-spoil',category:'spoil',title:'Spoil a Ballot',aliases:['spoil','spoiled ballot','cancel ballot'],modes:['early','election'],statuses:['Current Morris Guidance'],sharedProcedure:'spoil',meaning:'Cross-link to the existing shared Spoil procedure.'},
    {id:'xref-opening',category:'openclose',title:'Opening Overview',aliases:['opening','open polls'],modes:['early','election'],statuses:['Official Procedure'],sharedProcedure:'opening',meaning:'Cross-link to the existing opening procedure.'},
    {id:'xref-shutdown',category:'openclose',title:'Intermediate Nightly Shutdown',aliases:['shutdown','night close','closing'],modes:['early'],statuses:['Master Worker Practice','Critical'],sharedProcedure:'shutdown',meaning:'Cross-link to the existing intermediate early-voting shutdown procedure.'}
  ],
  boardQueue:[
    'Exact two-worker/different-party requirement for Affirmation of Residence in current Morris practice.',
    'Whether the combined Correction of Record form is used for signature updates; if not, identify the correct process.',
    'Four-and-four Early Voting search practice.',
    'Spoiled-ballot attempt limit.',
    'No Reissue / later-return procedure.',
    'Election Day cross-machine voting after district check-in.',
    'Own-district requirement for Election Day spoil.',
    'Accessible-machine assignment.'
  ]
};
