// Morris County official election-calendar values used when published.
// Regular Primary/General dates remain calculable fallbacks in important-dates.js.
// Verified against Morris County Voting & Elections / Election Calendar on 2026-08-30.
window.MPW_OFFICIAL_ELECTION_CALENDAR = {
  jurisdiction: 'Morris County, New Jersey',
  verifiedOn: '2026-08-30',
  sources: {
    calendar: 'https://www.morriscountynj.gov/Government/Voting-and-Elections/Election-Calendar',
    elections: 'https://www.morriscountynj.gov/Government/Voting-and-Elections',
    specialSchoolNotice: 'https://www.morriscountynj.gov/Home/Tabs/Public-Legal-Notices/Public-Legal-Notices/PUBLIC-NOTICE-TO-VOTERS-IN-THE-MORRIS-SCHOOL-DISTRICT-Morris-Township-Town-of-Morristown'
  },
  events: [
    {
      id: '2026-special-school-morris-district',
      kind: 'Special School Election',
      electionDay: '2026-09-15',
      scope: 'Morris School District — Morris Township & Morristown',
      special: true,
      source: 'specialSchoolNotice'
    },
    {
      id: '2026-general',
      kind: 'General Election',
      electionDay: '2026-11-03',
      earlyVotingStart: '2026-10-24',
      earlyVotingEnd: '2026-11-01',
      special: false,
      source: 'calendar'
    }
  ]
};
