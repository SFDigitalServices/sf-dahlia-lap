import { buildApplicantsAndPrefs } from 'components/LotteryResultsPdfGenerator/data/dataHelpers'

const testRowObjects = [
  {
    Rank: 1,
    LotteryNum: '01381911',
    Name: 'Lawanda Travis',
    PrefName: 'Veteran with Certificate of Preference (V-COP)',
    HasPref: false
  },
  {
    Rank: 1369,
    LotteryNum: '01383117',
    Name: 'Jalexus Tillery',
    PrefName: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
    HasPref: false
  }
]

const applicationsResult = [
  {
    Name: 'Lawanda Travis',
    Rank: 1,
    LotteryNum: '01381911',
    prefs: {
      'V-COP': false,
      VET: false
    }
  },
  {
    Name: 'Jalexus Tillery',
    Rank: 1369,
    LotteryNum: '01383117',
    prefs: {
      'V-DTHP': false,
      VET: false
    }
  }
]

const testPrefIDsResult = ['V-COP', 'V-DTHP', 'General List']
describe('Data Helpers', () => {
  describe('buildApplicantsAndPrefs returns correct result', () => {
    test('it should return the correct data', () => {
      expect(buildApplicantsAndPrefs(testRowObjects)).toEqual({
        applicants: applicationsResult,
        prefIDs: testPrefIDsResult
      })
    })
  })
})
