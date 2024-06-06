import {
  buildApplicantsAndPrefs,
  getRowAsObject,
  getCols
} from 'components/LotteryResultsPdfGenerator/data/dataHelpers'

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

const testRow = [
  458,
  '01382810',
  'Shirley Gainey',
  'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
  false
]

const testCols = {
  Rank: {
    label: 'Lottery Rank (Unsorted)',
    index: 0
  },
  LotteryNum: {
    label: 'Lottery Number',
    index: 1
  },
  Name: {
    label: 'Primary Applicant Contact: Full Name',
    index: 2
  },
  PrefName: {
    label: 'Preference',
    index: 3
  },
  HasPref: {
    label: 'Receives Preference',
    index: 4
  },
  PrefRank: {
    label: 'Preference Rank',
    index: 5
  }
}

const testResponseObject = {
  Rank: 458,
  LotteryNum: '01382810',
  Name: 'Shirley Gainey',
  PrefName: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
  HasPref: false
}

const testHeaders = [
  'Lottery Rank (Unsorted)',
  'Lottery Number',
  'Primary Applicant Contact: Full Name',
  'Preference',
  'Receives Preference',
  'Preference Rank'
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
  describe('getRowAsObject', () => {
    test('it receives a row and cols and returns an object', () => {
      expect(getRowAsObject(testRow, testCols)).toEqual(testResponseObject)
    })
  })

  describe('getCols', () => {
    test('it receives headers and returns the correct column data', () => {
      expect(getCols(testHeaders)).toEqual(testCols)
    })
  })
})
