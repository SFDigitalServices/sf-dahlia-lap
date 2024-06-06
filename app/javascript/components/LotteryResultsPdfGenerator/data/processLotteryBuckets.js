import { Preferences } from '../utils/constants'

const isVeteranBucket = (bucket) => Preferences[bucket.preferenceName].isVeteran
const isNotVeteranBucket = (bucket) => !isVeteranBucket(bucket)

export const filterBuckets = (buckets) => {
  const veterans = new Set()

  // we know all the applicants in veteran buckets have the veteran preference,
  // so add the hasVeteranPref property to each and track their lottery numbers
  buckets.filter(isVeteranBucket).forEach((bucket) => {
    bucket.preferenceResults.forEach((applicant) => {
      veterans.add(applicant.lotteryNumber)
      applicant.hasVeteranPref = true
    })
  })

  // go through all the non-veteran buckets and set the hasVeteranPref property
  // for each applicant.  the applicant objects aren't shared across buckets,
  // so it's not enough to just set the property in the veteran buckets.
  buckets.filter(isNotVeteranBucket).forEach((bucket) => {
    bucket.preferenceResults.forEach((applicant) => {
      applicant.hasVeteranPref = veterans.has(applicant.lotteryNumber)
    })
  })

  return buckets
}

export const processLotteryBuckets = (rawBuckets, combineGroups = false) => {
  const buckets = filterBuckets(rawBuckets)

  if (!combineGroups) {
    return buckets
  }

  // we have to make a copy of the array because we mutate it in the loop below
  const bucketsQueue = [...buckets]
  const processed = []

  bucketsQueue.forEach((bucket, index) => {
    const bucketInfo = Preferences[bucket.preferenceName]

    if (bucketInfo.isVeteran) {
      const veteranApplicants = bucket.preferenceResults
      // we assume the list is always ordered by the Veteran preference and then
      // the related non-Veteran preference
      const relatedBucket = bucketsQueue[index + 1]
      // remove all the Veteran applicants from the related bucket
      const nonVeteranApplicants = relatedBucket.preferenceResults.filter(
        ({ hasVeteranPref }) => !hasVeteranPref
      )
      const combinedApplicants = [...veteranApplicants, ...nonVeteranApplicants]

      // remove the related bucket from the list so we skip it, since we just
      // processed it
      bucketsQueue.splice(index + 1, 1)

      // add the combined list of Veteran and non-Veteran applicants to a copy
      // of the related bucket, since we don't want to mutate the list in the
      // original bucket, and return that.  we discard the Veteran bucket.
      processed.push({
        ...relatedBucket,
        preferenceResults: combinedApplicants
      })
    } else {
      processed.push(bucket)
    }
  })

  return processed
}
