import { by } from '../utils/byFunction'
import { Preferences } from '../utils/constants'

export const processLotteryBuckets = (buckets) => {
  const bucketsQueue = Object.entries(buckets)

  const combinedBuckets = {}
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
        combinedBuckets[bucketKey] = [...veteranApplications, ...nonVeteranApplications]
      } else {
        combinedBuckets[bucketKey] = bucketApplications
      }
    }
  }

  if (buckets.generalList) {
    combinedBuckets.generalList = buckets.generalList
  }

  return combinedBuckets
}
