import { by } from './byFunction'
import { Preferences } from './constants'
// group application preferences into buckets by preference type
// {
//     "application": {
//       "general_lottery": false,
//       "general_lottery_rank": null,
//       "lottery_number": "01398467",
//       "lottery_number_manual": null,
//       ...
//    }
//   "preference_all_lottery_rank": 1,
//   "preference_lottery_rank": 1,
//   "custom_preference_type": "COP",
//   "record_type_for_app_preferences": "COP",
//   "preference_name": "Certificate of Preference (COP)",
//    ...
// }
const groupBuckets = (applicationPreferences) => {
  return Object.values(applicationPreferences).reduce((acc, appPref) => {
    if (appPref.application.general_lottery) {
      if (acc.generalList) {
        acc.generalList.push(appPref)
      } else {
        acc.generalList = [appPref]
      }
    } else {
      if (acc[appPref.custom_preference_type]) {
        acc[appPref.custom_preference_type].push(appPref)
      } else {
        acc[appPref.custom_preference_type] = [appPref]
      }
    }
    return acc
  }, {})
}

const processUnfilteredBucket = (combinedBuckets) => {
  const unfilteredPreferenceResults = Object.values(combinedBuckets).reduce((acc, bucket) => {
    if (bucket.preferenceResults.length > 0) {
      for (const result of bucket.preferenceResults) acc.push(result)
    }
    return acc
  }, [])

  const unfilteredBucket = {
    preferenceName: 'Unfiltered Rank',
    preferenceResults: unfilteredPreferenceResults.sort(by('preference_all_lottery_rank')),
    shortCode: 'Unfiltered'
  }

  // put the bucket of unfiltered applicants first
  return [unfilteredBucket, ...Object.values(combinedBuckets)]
}

export const processLotteryBuckets = (applicationPreferences) => {
  const buckets = groupBuckets(applicationPreferences)
  const bucketsQueue = Object.entries(buckets)

  const combinedBuckets = {
    COP: {
      shortCode: 'COP',
      preferenceName: 'COP',
      preferenceResults: []
    },
    L_W: {
      shortCode: 'L_W',
      preferenceName: 'Live/Work',
      preferenceResults: []
    },
    DTHP: {
      shortCode: 'DTHP',
      preferenceName: 'DTHP',
      preferenceResults: []
    },
    generalList: {
      shortCode: 'generalLottery',
      preferenceName: 'General List',
      preferenceResults: []
    }
  }
  for (const bucket of bucketsQueue) {
    // shape of bucket is ["bucketKey e.g. COP or V-COP", [array of applications]]
    const bucketKey = bucket[0]
    const bucketApplications = bucket[1]
    const bucketInfo = Preferences[bucketKey]

    if (bucketKey !== 'generalList' && !bucketInfo.isVeteran) {
      const relatedVeteranBucket = bucketsQueue.find(
        (veteranBucket) => veteranBucket[0] === `V-${bucketKey}`
      )

      const nonVeteranApplications = []
      const veteranApplications = []

      if (relatedVeteranBucket !== undefined) {
        for (const application of bucketApplications) {
          const name = application.application.name
          if (
            relatedVeteranBucket[1].find((application) => application.application.name === name)
          ) {
            application.isVeteran = true
            veteranApplications.push(application)
          } else {
            nonVeteranApplications.push(application)
          }
        }
        combinedBuckets[bucketKey].preferenceResults = [
          ...veteranApplications,
          ...nonVeteranApplications
        ]
      } else {
        combinedBuckets[bucketKey].preferenceResults = bucketApplications
      }
    }
  }

  if (buckets.generalList) {
    combinedBuckets.generalList.preferenceResults = buckets.generalList
  }

  return processUnfilteredBucket(combinedBuckets)
}
