export const testApplicants = [
  {
    Name: 'Estefany Portillo',
    Rank: 449,
    LotteryNum: '01384819',
    prefs: {
      'V-COP': false,
      VET: false,
      COP: false,
      'V-DTHP': false,
      DTHP: false,
      'V-LW': false,
      LW: false
    }
  },
  {
    Name: 'Nora Ismail',
    Rank: 500,
    LotteryNum: '01384816',
    prefs: {
      'V-COP': false,
      VET: false,
      COP: false,
      'V-DTHP': false,
      DTHP: false,
      'V-LW': false,
      LW: false
    }
  },
  {
    Name: 'Sheng Yang',
    Rank: 771,
    LotteryNum: '01384818',
    prefs: {
      'V-COP': false,
      VET: true,
      COP: false,
      'V-DTHP': false,
      DTHP: false,
      'V-LW': true,
      LW: true
    }
  },
  {
    Name: 'Stephanie Davis',
    Rank: 1337,
    LotteryNum: '01384817',
    prefs: {
      'V-COP': false,
      VET: false,
      COP: false,
      'V-DTHP': false,
      DTHP: false,
      'V-LW': false,
      LW: false
    }
  }
]

export const testPrefIDs = ['V-COP', 'COP', 'V-DTHP', 'DTHP', 'V-LW', 'LW', 'General List']

export const testBucketResults = [
  {
    preferenceName: 'Veteran with Certificate of Preference (V-COP)',
    preferenceResults: []
  },
  {
    preferenceName: 'Certificate of Preference (COP)',
    preferenceResults: []
  },
  {
    preferenceName: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
    preferenceResults: []
  },
  {
    preferenceName: 'Displaced Tenant Housing Preference (DTHP)',
    preferenceResults: []
  },
  {
    preferenceName: 'Veteran with Live or Work in San Francisco Preference (V-L_W)',
    preferenceResults: [
      {
        lotteryRank: 771,
        lotteryNumber: '01384818'
      }
    ]
  },
  {
    preferenceName: 'Live or Work in San Francisco Preference',
    preferenceResults: [
      {
        lotteryRank: 771,
        lotteryNumber: '01384818'
      }
    ]
  },
  {
    preferenceName: 'generalLottery',
    preferenceResults: [
      {
        lotteryRank: 449,
        lotteryNumber: '01384819'
      },
      {
        lotteryRank: 500,
        lotteryNumber: '01384816'
      },
      {
        lotteryRank: 1337,
        lotteryNumber: '01384817'
      }
    ]
  }
]
