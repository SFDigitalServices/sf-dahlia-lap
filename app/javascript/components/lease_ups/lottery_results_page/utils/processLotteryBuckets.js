import { Preferences } from './preferences'

const emptyBuckets = {
  COP: [],
  'V-COP': [],
  DTHP: [],
  'V-DTHP': [],
  NRHP: [],
  'V-NRHP': [],
  L_W: [],
  'V-L_W': [],
  generalLottery: []
}

export const groupBuckets = (applicationPreferences) => {
  return Object.values(applicationPreferences).reduce((acc, appPref) => {
    const cleanApp = {
      lottery_number:
        appPref.application.lottery_number_manual ?? appPref.application.lottery_number,
      unsorted_lottery_rank: appPref.application.unsorted_lottery_rank
    }
    if (appPref.application.general_lottery) {
      acc.generalLottery.push(cleanApp)
    } else {
      if (acc[appPref.custom_preference_type]) {
        acc[appPref.custom_preference_type].push(cleanApp)
      }
    }
    return acc
  }, emptyBuckets)
}

const sortUnfilteredBuckets = (unfilteredPreferenceResults) => {
  const filtered = unfilteredPreferenceResults.sort(
    (a, b) => a.unsorted_lottery_rank - b.unsorted_lottery_rank
  )
  return filtered
}

export const processUnfilteredBucket = (combinedBuckets) => {
  const unfilteredBucket = {
    preferenceName: 'Unfiltered Rank',
    preferenceResults: [],
    shortCode: 'Unfiltered'
  }

  const combinedPrefResults = combinedBuckets.reduce(
    (prefResults, bucket) => [...prefResults, ...bucket.preferenceResults],
    []
  )

  const uniquePrefResults = combinedPrefResults.reduce((uniqPrefResults, prefResult) => {
    // find new prefResult in unique pref result
    const foundMatch = uniqPrefResults.find(
      (uniqPrefResult) => uniqPrefResult.lottery_number === prefResult.lottery_number
    )

    if (!foundMatch) {
      uniqPrefResults.push(prefResult)
    }

    return uniqPrefResults
  }, [])

  unfilteredBucket.preferenceResults = sortUnfilteredBuckets(uniquePrefResults)

  // put the bucket of unfiltered applicants first
  return [unfilteredBucket, ...Object.values(combinedBuckets)]
}

const emptyCombinedBuckets = {
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

const processVeteranBucket = (bucketApplications, relatedVeteranApplications) => {
  const nonVeteranApplications = []
  const veteranApplications = []
  for (const application of bucketApplications) {
    const lotteryNumber = application.lottery_number
    if (
      relatedVeteranApplications.find((application) => application.lottery_number === lotteryNumber)
    ) {
      application.isVeteran = true
      veteranApplications.push(application)
    } else {
      nonVeteranApplications.push(application)
    }
  }
  return [...veteranApplications, ...nonVeteranApplications]
}

export const combineVeteranBuckets = (buckets) => {
  const combinedBuckets = emptyCombinedBuckets

  // shape of bucket is ["bucketKey e.g. COP or V-COP", [array of applications]]
  for (const [bucketKey, bucketApplications] of buckets) {
    const bucketInfo = Preferences[bucketKey]

    if (bucketKey !== 'generalLottery' && !bucketInfo.isVeteran) {
      const relatedVeteranBucket = buckets.find((bucket) => bucket[0] === `V-${bucketKey}`)

      if (relatedVeteranBucket) {
        combinedBuckets[bucketKey].preferenceResults = processVeteranBucket(
          bucketApplications,
          relatedVeteranBucket[1]
        )
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

export const massageLotteryBuckets = (buckets) => {
  const processedBuckets = buckets.map((bucket) => ({
    shortCode: bucket.preferenceShortCode || 'generalLottery',
    preferenceResults: bucket.preferenceResults.map((result) => ({
      lottery_number: result.lotteryNumber
    }))
  }))

  const unfilteredResults = []
  buckets.forEach((bucket) =>
    bucket.preferenceResults.forEach((result) =>
      unfilteredResults.push({
        lottery_number: result.lotteryNumber,
        unsorted_lottery_rank: result.lotteryRank
      })
    )
  )

  return [
    {
      preferenceName: 'Unfiltered Rank',
      preferenceResults: sortUnfilteredBuckets(unfilteredResults),
      shortCode: 'Unfiltered'
    },
    ...processedBuckets
  ]
}
