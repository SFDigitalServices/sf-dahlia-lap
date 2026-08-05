import {
  AlwaysVisiblePreferenceIDs,
  LotteryPreferenceIDs,
  NonVeteranPreferenceIDs,
  Preferences
} from './preferences'

const GENERAL_LOTTERY_KEY = 'generalLottery'
// applications whose preference type we don't recognize are collected here so
// that they still show up in the Unfiltered Rank column rather than vanishing
const UNKNOWN_KEY = '__unknown'

// build a fresh set of empty buckets on every call.  these used to be
// module-level literals that were mutated in place, which leaked results
// between invocations.
const buildEmptyBuckets = () => {
  const buckets = { [GENERAL_LOTTERY_KEY]: [], [UNKNOWN_KEY]: [] }

  LotteryPreferenceIDs.forEach((id) => {
    buckets[id] = []
  })

  return buckets
}

export const groupBuckets = (applicationPreferences) => {
  const unknownTypes = new Set()

  const buckets = Object.values(applicationPreferences).reduce((acc, appPref) => {
    const cleanApp = {
      lottery_number:
        appPref.application.lottery_number_manual ?? appPref.application.lottery_number,
      unsorted_lottery_rank: appPref.application.unsorted_lottery_rank
    }

    if (appPref.application.general_lottery) {
      acc[GENERAL_LOTTERY_KEY].push(cleanApp)
    } else {
      const preferenceType = appPref.custom_preference_type

      if (acc[preferenceType]) {
        acc[preferenceType].push(cleanApp)
      } else {
        unknownTypes.add(String(preferenceType))
        acc[UNKNOWN_KEY].push(cleanApp)
      }
    }

    return acc
  }, buildEmptyBuckets())

  if (unknownTypes.size) {
    // a new preference type in Salesforce that isn't in preferences.js will end
    // up here.  it needs to be added there to get its own results column.
    console.warn(
      `Unknown lottery preference type(s), omitted from preference columns: ${[
        ...unknownTypes
      ].join(', ')}`
    )
  }

  return buckets
}

const sortUnfilteredBuckets = (unfilteredPreferenceResults) => {
  const filtered = unfilteredPreferenceResults.sort(
    (a, b) => a.unsorted_lottery_rank - b.unsorted_lottery_rank
  )
  return filtered
}

const uniqueLotteryNumbers = (results) => {
  const seen = new Set()

  return results.filter(({ lottery_number: lotteryNumber }) => {
    if (seen.has(lotteryNumber)) {
      return false
    }

    seen.add(lotteryNumber)

    return true
  })
}

export const processUnfilteredBucket = (combinedBuckets, extraResults = []) => {
  const combinedPrefResults = Object.values(combinedBuckets).reduce(
    (prefResults, bucket) => [...prefResults, ...bucket.preferenceResults],
    [...extraResults]
  )

  const unfilteredBucket = {
    preferenceName: 'Unfiltered Rank',
    preferenceResults: sortUnfilteredBuckets(uniqueLotteryNumbers(combinedPrefResults)),
    shortCode: 'Unfiltered'
  }

  // put the bucket of unfiltered applicants first
  return [unfilteredBucket, ...Object.values(combinedBuckets)]
}

const processVeteranBucket = (bucketApplications, relatedVeteranApplications) => {
  const veteranLotteryNumbers = new Set(
    relatedVeteranApplications.map(({ lottery_number: lotteryNumber }) => lotteryNumber)
  )
  const nonVeteranApplications = []
  const veteranApplications = []

  for (const application of bucketApplications) {
    if (veteranLotteryNumbers.has(application.lottery_number)) {
      application.isVeteran = true
      veteranApplications.push(application)
    } else {
      nonVeteranApplications.push(application)
    }
  }

  return [...veteranApplications, ...nonVeteranApplications]
}

export const combineVeteranBuckets = (buckets) => {
  const bucketsByKey = Object.fromEntries(buckets)
  const combinedBuckets = {}

  NonVeteranPreferenceIDs.forEach((bucketKey) => {
    const bucketApplications = bucketsByKey[bucketKey]

    if (!bucketApplications) {
      return
    }

    // only ever-present preferences keep an empty column, so that adding a new
    // preference type doesn't add blank columns to every listing's PDF
    if (!bucketApplications.length && !AlwaysVisiblePreferenceIDs.includes(bucketKey)) {
      return
    }

    const relatedVeteranApplications = bucketsByKey[`V-${bucketKey}`]

    combinedBuckets[bucketKey] = {
      shortCode: bucketKey,
      preferenceName: Preferences[bucketKey].shortName,
      preferenceResults: relatedVeteranApplications
        ? processVeteranBucket(bucketApplications, relatedVeteranApplications)
        : bucketApplications
    }
  })

  return combinedBuckets
}

export const processLotteryBuckets = (applicationPreferences) => {
  // group application preferences into buckets by preference type
  const buckets = groupBuckets(Object.values(applicationPreferences))

  // combine non-veteran and their related veteran bucket
  const combinedBuckets = combineVeteranBuckets(Object.entries(buckets))

  // add general lottery bucket
  if (buckets[GENERAL_LOTTERY_KEY]) {
    combinedBuckets[GENERAL_LOTTERY_KEY] = {
      shortCode: GENERAL_LOTTERY_KEY,
      preferenceName: 'General List',
      preferenceResults: buckets[GENERAL_LOTTERY_KEY]
    }
  }

  // add the unfiltered bucket, including any applications we couldn't bucket
  return processUnfilteredBucket(combinedBuckets, buckets[UNKNOWN_KEY])
}

export const massageLotteryBuckets = (buckets) => {
  const massagedBuckets = []
  const unfilteredResults = []
  const unknownShortCodes = new Set()

  buckets.forEach((bucket) => {
    const shortCode = bucket.preferenceShortCode || GENERAL_LOTTERY_KEY
    const massagedBucket = {
      shortCode,
      preferenceResults: []
    }

    if (!Preferences[shortCode]) {
      unknownShortCodes.add(String(shortCode))
    }

    bucket.preferenceResults.forEach((result) => {
      unfilteredResults.push({
        lottery_number: result.lotteryNumber,
        unsorted_lottery_rank: result.lotteryRank
      })
      massagedBucket.preferenceResults.push({ lottery_number: result.lotteryNumber })
    })

    massagedBuckets.push(massagedBucket)
  })

  if (unknownShortCodes.size) {
    console.warn(`Unknown lottery preference short code(s): ${[...unknownShortCodes].join(', ')}`)
  }

  return [
    {
      preferenceName: 'Unfiltered Rank',
      preferenceResults: uniqueLotteryNumbers(sortUnfilteredBuckets(unfilteredResults)),
      shortCode: 'Unfiltered'
    },
    ...massagedBuckets
  ]
}
