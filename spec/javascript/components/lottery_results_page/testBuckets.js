export const testBuckets = [
  {
    application: {
      general_lottery: false,
      general_lottery_rank: null,
      lottery_number: '01445058',
      lottery_number_manual: null,
      unsorted_lottery_rank: 240
    },
    preference_lottery_rank: 1,
    custom_preference_type: 'DTHP',
    record_type_for_app_preferences: 'DTHP',
    preference_name: 'Displaced Tenant Housing Preference (DTHP)'
  },
  {
    application: {
      general_lottery: false,
      general_lottery_rank: null,
      lottery_number: '01445059',
      lottery_number_manual: null,
      unsorted_lottery_rank: 250
    },
    preference_lottery_rank: 1,
    custom_preference_type: 'DTHP',
    record_type_for_app_preferences: 'DTHP',
    preference_name: 'Displaced Tenant Housing Preference (DTHP)'
  },
  {
    application: {
      general_lottery: false,
      general_lottery_rank: null,
      lottery_number: '01445060',
      lottery_number_manual: null,
      unsorted_lottery_rank: 260
    },
    preference_lottery_rank: 1,
    custom_preference_type: 'COP',
    record_type_for_app_preferences: 'COP',
    preference_name: 'Certificate of Preference (COP)'
  },
  {
    application: {
      general_lottery: false,
      general_lottery_rank: null,
      lottery_number: '01445060',
      lottery_number_manual: null,
      unsorted_lottery_rank: 260
    },
    preference_lottery_rank: 1,
    custom_preference_type: 'DTHP',
    record_type_for_app_preferences: 'DTHP',
    preference_name: 'Displaced Tenant Housing Preference (DTHP)'
  },
  {
    application: {
      general_lottery: false,
      general_lottery_rank: null,
      lottery_number: '01445061',
      lottery_number_manual: null,
      unsorted_lottery_rank: 270
    },
    preference_lottery_rank: 1,
    custom_preference_type: 'DTHP',
    record_type_for_app_preferences: 'DTHP',
    preference_name: 'Displaced Tenant Housing Preference (DTHP)'
  },
  {
    application: {
      general_lottery: false,
      general_lottery_rank: null,
      lottery_number: '01445062',
      lottery_number_manual: null,
      unsorted_lottery_rank: 280
    },
    preference_lottery_rank: 1,
    custom_preference_type: 'DTHP',
    record_type_for_app_preferences: 'DTHP',
    preference_name: 'Displaced Tenant Housing Preference (DTHP)'
  }
]

export const testBucketResults = [
  {
    preferenceName: 'Unfiltered Rank',
    preferenceResults: [
      {
        lottery_number: '01445058',
        unsorted_lottery_rank: 240
      },
      {
        lottery_number: '01445059',
        unsorted_lottery_rank: 250
      },
      {
        lottery_number: '01445060',
        unsorted_lottery_rank: 260
      },
      {
        lottery_number: '01445061',
        unsorted_lottery_rank: 270
      },
      {
        lottery_number: '01445062',
        unsorted_lottery_rank: 280
      }
    ],
    shortCode: 'Unfiltered'
  },
  {
    shortCode: 'COP',
    preferenceName: 'COP',
    preferenceResults: [
      {
        lottery_number: '01445060',
        unsorted_lottery_rank: 260
      }
    ]
  },
  {
    shortCode: 'DTHP',
    preferenceName: 'DTHP',
    preferenceResults: [
      {
        lottery_number: '01445058',
        unsorted_lottery_rank: 240
      },
      {
        lottery_number: '01445059',
        unsorted_lottery_rank: 250
      },
      {
        lottery_number: '01445060',
        unsorted_lottery_rank: 260
      },
      {
        lottery_number: '01445061',
        unsorted_lottery_rank: 270
      },
      {
        lottery_number: '01445062',
        unsorted_lottery_rank: 280
      }
    ]
  },
  {
    shortCode: 'NRHP',
    preferenceName: 'NRHP',
    preferenceResults: []
  },
  {
    shortCode: 'L_W',
    preferenceName: 'Live/Work',
    preferenceResults: []
  },
  {
    shortCode: 'generalLottery',
    preferenceName: 'General List',
    preferenceResults: []
  }
]
