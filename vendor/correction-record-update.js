// Latest Morris field clarification for the combined Correction of Record / Affirmation of Residence form.
(function(){
  const item=window.FIELD_PROCEDURES?.items?.find(x=>x.id==='record-correction');
  if(!item) return;

  item.statuses=['Current Morris Guidance'];
  item.meaning='The top Correction of Record portion of the combined Morris form may be used at the polling place to report or correct voter-record information. A voter does not need to be flagged in the ePollbook in order to use it.';
  item.steps=[
    'Identify the voter-record information being corrected or reported.',
    'Use the printed choices on the Correction of Record section when they fit the situation. These are common uses, not a closed list.',
    'For another legitimate voter-record discrepancy, clearly state the reason and the corrected or reported information on the form.',
    'The voter or reporting person may write the information, or a poll worker may write it as appropriate. Complete the form under poll-worker supervision so the reason and information are clear.',
    'Obtain the signatures required by the form for the situation being reported.',
    'Return the completed form with the proper election materials for Board processing.'
  ];
  item.notDo=[
    'Do not treat the printed checkboxes as the only reasons the Correction of Record portion may be used.',
    'Do not imply that completing the form directly edits the official voter-registration database.',
    'Do not use the Correction of Record portion itself to decide regular versus provisional ballot eligibility; follow the underlying voter procedure.'
  ];
  item.outcome='The correction or report is sent to the Board of Elections for processing. Any voting outcome is determined by the underlying voter situation, not by the Correction of Record form alone.';
  item.form='Morris County Correction of Record / Affirmation of Residence combined form — use the top Correction of Record portion for corrections and reports; the bottom Affirmation of Residence portion is a separate function.';
  item.tip='Master Poll Worker Tip: older voter records can contain unusual database information, such as an obviously incorrect birth year (for example, 1800). A legitimate record discrepancy like this may be documented on the Correction of Record form even when it does not neatly match a printed checkbox.';
  item.escalation='Call the Board when the information being reported cannot be clearly documented, the requested change appears unrelated to voter registration, or the voting remedy is unclear.';
  delete item.boardQuestion;

  const q=window.FIELD_PROCEDURES.boardQueue||[];
  window.FIELD_PROCEDURES.boardQueue=q.filter(x=>!x.startsWith('Correction of Record:'));

  // Refresh the current view if this script loads while Procedures or Board Questions is already displayed.
  if(typeof render==='function') render();
})();
