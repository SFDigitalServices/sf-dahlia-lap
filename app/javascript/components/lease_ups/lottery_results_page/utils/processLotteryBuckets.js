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

// Problems worth telling the user about, rather than only the console: a
// preference we can't map to a column, or veteran data that doesn't line up
// with its base preference.  Callers pass an array to collect them, and the
// page shows them above the results.  They're warnings, not errors: the
// results still render, and for a given listing the housing team may already
// know a message can be ignored.
const warn = (warnings, message) => {
  console.warn(message)
  warnings.push(message)
}

const applicantCount = (count) => `${count} ${count === 1 ? 'application' : 'applications'}`

// a preference type in Salesforce that isn't in preferences.js gets no column
// of its own.  it needs to be added there, with a name and subtitle, before it
// can be displayed as its own set of results.
const unknownPreferenceWarning = (preferenceType, count) =>
  `“${preferenceType}” isn't a preference this page can display, so its ${applicantCount(count)} ` +
  `${count === 1 ? 'appears' : 'appear'} only in the Unfiltered Rank column.`

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

export const groupBuckets = (applicationPreferences, warnings = []) => {
  const unknownTypes = {}

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
        const type = String(preferenceType)

        unknownTypes[type] = (unknownTypes[type] || 0) + 1
        acc[UNKNOWN_KEY].push(cleanApp)
      }
    }

    return acc
  }, buildEmptyBuckets())

  Object.entries(unknownTypes).forEach(([type, count]) => {
    warn(warnings, unknownPreferenceWarning(type, count))
  })

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

// fold a V-<pref> bucket into its base <pref> bucket: veterans are flagged (the
// UI marks them with a *) and listed first.  every veteran application should
// also hold the base preference, so a veteran missing from the base bucket is a
// data problem: it's surfaced as a warning and the applicant is kept rather
// than dropped.
const processVeteranBucket = (
  bucketApplications,
  relatedVeteranApplications,
  bucketKey,
  warnings = []
) => {
  const veteranLotteryNumbers = new Set(
    relatedVeteranApplications.map(({ lottery_number: lotteryNumber }) => lotteryNumber)
  )
  const nonVeteranApplications = []
  const veteranApplications = []
  const seenVeterans = new Set()

  for (const application of bucketApplications) {
    if (veteranLotteryNumbers.has(application.lottery_number)) {
      application.isVeteran = true
      veteranApplications.push(application)
      seenVeterans.add(application.lottery_number)
    } else {
      nonVeteranApplications.push(application)
    }
  }

  let missingFromBase = 0

  for (const application of relatedVeteranApplications) {
    if (!seenVeterans.has(application.lottery_number)) {
      application.isVeteran = true
      veteranApplications.push(application)
      seenVeterans.add(application.lottery_number)
      missingFromBase += 1
    }
  }

  if (missingFromBase) {
    const { name, shortName } = Preferences[bucketKey]

    warn(
      warnings,
      `${applicantCount(missingFromBase)} ${missingFromBase === 1 ? 'has' : 'have'} the veteran ` +
        `version of ${name} but not the preference itself, which shouldn't happen. ` +
        `${missingFromBase === 1 ? "It's" : "They're"} included in the ${shortName} column, but ` +
        'the application data may need to be checked.'
    )
  }

  return [...veteranApplications, ...nonVeteranApplications]
}

export const combineVeteranBuckets = (buckets, warnings = []) => {
  const bucketsByKey = Object.fromEntries(buckets)
  const combinedBuckets = {}

  NonVeteranPreferenceIDs.forEach((bucketKey) => {
    const relatedVeteranApplications = bucketsByKey[`V-${bucketKey}`]
    // the preference-record path seeds every known preference, but the
    // LotteryResult API returns only the buckets a listing actually has, so a
    // veteran bucket can arrive without its base bucket.  fall back to an empty
    // base rather than dropping those applicants from the page entirely
    const bucketApplications = bucketsByKey[bucketKey] || (relatedVeteranApplications ? [] : null)

    if (!bucketApplications) {
      return
    }

    // only ever-present preferences keep an empty column, so that adding a new
    // preference type doesn't add blank columns to every listing's PDF
    if (
      !bucketApplications.length &&
      !relatedVeteranApplications?.length &&
      !AlwaysVisiblePreferenceIDs.includes(bucketKey)
    ) {
      return
    }

    combinedBuckets[bucketKey] = {
      shortCode: bucketKey,
      preferenceName: Preferences[bucketKey].shortName,
      preferenceResults: relatedVeteranApplications
        ? processVeteranBucket(bucketApplications, relatedVeteranApplications, bucketKey, warnings)
        : bucketApplications
    }
  })

  return combinedBuckets
}

export const processLotteryBuckets = (applicationPreferences, warnings = []) => {
  // group application preferences into buckets by preference type
  const buckets = groupBuckets(Object.values(applicationPreferences), warnings)

  // combine non-veteran and their related veteran bucket
  const combinedBuckets = combineVeteranBuckets(Object.entries(buckets), warnings)

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

// the LotteryResult API returns one bucket per preference, with the veteran
// variants kept separate.  reshape its records into the same form the
// preference-record path produces, then run them through the same combining,
// so both paths render identical columns.
export const massageLotteryBuckets = (buckets, warnings = []) => {
  const unknownShortCodes = {}
  const unknownResults = []
  const resultsByShortCode = {}
  const orderByShortCode = {}

  buckets.forEach((bucket) => {
    // the general lottery bucket comes back without a short code
    const shortCode = bucket.preferenceShortCode || GENERAL_LOTTERY_KEY

    // the listing's own preference order, which is what the columns should
    // follow.  it is not part of the preference-record query, so that path
    // still falls back to the order the preferences are defined in.
    if (bucket.preferenceOrder != null) {
      orderByShortCode[shortCode] = bucket.preferenceOrder
    }
    const results = (bucket.preferenceResults || []).map((result) => ({
      lottery_number: result.lotteryNumber,
      unsorted_lottery_rank: result.lotteryRank
    }))

    if (Preferences[shortCode]) {
      // a short code can appear more than once if the API ever splits a
      // preference across buckets, so accumulate rather than overwrite
      resultsByShortCode[shortCode] = (resultsByShortCode[shortCode] || []).concat(results)
    } else {
      // an unmapped preference gets no column of its own, but its applicants
      // still belong in the unfiltered rank
      const code = String(shortCode)

      unknownShortCodes[code] = (unknownShortCodes[code] || 0) + results.length
      unknownResults.push(...results)
    }
  })

  Object.entries(unknownShortCodes).forEach(([shortCode, count]) => {
    warn(warnings, unknownPreferenceWarning(shortCode, count))
  })

  const combinedBuckets = combineVeteranBuckets(Object.entries(resultsByShortCode), warnings)

  // a folded column takes its base preference's position, or the veteran
  // bucket's if that is all the listing has.  anything the API sent without an
  // order keeps its relative position after the ordered columns.
  const columnOrder = (shortCode) =>
    orderByShortCode[shortCode] ?? orderByShortCode[`V-${shortCode}`] ?? Number.MAX_SAFE_INTEGER

  const orderedBuckets = Object.fromEntries(
    Object.entries(combinedBuckets).sort(
      ([aShortCode], [bShortCode]) => columnOrder(aShortCode) - columnOrder(bShortCode)
    )
  )

  // the general lottery always comes last, after the preference columns
  if (resultsByShortCode[GENERAL_LOTTERY_KEY]) {
    orderedBuckets[GENERAL_LOTTERY_KEY] = {
      shortCode: GENERAL_LOTTERY_KEY,
      preferenceName: 'General List',
      preferenceResults: resultsByShortCode[GENERAL_LOTTERY_KEY]
    }
  }

  return processUnfilteredBucket(orderedBuckets, unknownResults)
}
