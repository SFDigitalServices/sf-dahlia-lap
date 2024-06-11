import { by } from './byFunction'
import { Preferences } from './constants'

const emptyBuckets = {
  COP: {
    shortCode: 'COP',
    preferenceName: 'COP',
    preferenceResults: []
  },
  DTHP: {
    shortCode: 'DTHP',
    preferenceName: 'DTHP',
    preferenceResults: []
  },
  NRHP: {
    shortCode: 'NRHP',
    preferenceName: 'NRHP',
    preferenceResults: []
  },
  L_W: {
    shortCode: 'L_W',
    preferenceName: 'Live/Work',
    preferenceResults: []
  }
}

export const groupBuckets = (applicationPreferences) => {
  return Object.values(applicationPreferences).reduce((acc, appPref) => {
    if (appPref.application.general_lottery) {
      if (acc.generalLottery) {
        acc.generalLottery.push(appPref)
      } else {
        acc.generalLottery = [appPref]
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

export const processUnfilteredBucket = (combinedBuckets) => {
  const included = []
  const unfilteredPreferenceResults = combinedBuckets.reduce((acc, bucket) => {
    if (bucket.preferenceResults.length > 0) {
      for (const pref of bucket.preferenceResults) {
        if (!included.includes(pref.application.lottery_number)) {
          included.push(pref.application.lottery_number)
          acc.push(pref)
        }
      }
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

export const combineVeteranBuckets = (buckets) => {
  const combinedBuckets = emptyBuckets

  for (const bucket of buckets) {
    // shape of bucket is ["bucketKey e.g. COP or V-COP", [array of applications]]
    const bucketKey = bucket[0]
    const bucketApplications = bucket[1]
    const bucketInfo = Preferences[bucketKey]

    if (bucketKey !== 'generalLottery' && !bucketInfo.isVeteran) {
      const relatedVeteranBucket = buckets.find(
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

  return combinedBuckets
}

export const processLotteryBuckets = (applicationPreferences) => {
  // group application preferences into buckets by preference type
  const buckets = groupBuckets(Object.values(applicationPreferences))

  // combine non-veteran and their related veteran bucket
  const combinedBuckets = combineVeteranBuckets(Object.entries(buckets))

  // add general lottery bucket
  if (buckets.generalLottery) {
    combinedBuckets.generalLottery = {
      shortCode: 'generalLottery',
      preferenceName: 'General List',
      preferenceResults: buckets.generalLottery
    }
  }

  // add the unfiltered bucket
  const processedBuckets = processUnfilteredBucket(Object.values(combinedBuckets))

  return processedBuckets
}
