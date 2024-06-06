import * as XLSX from 'xlsx'

import { getApplicantsAndPrefs } from './dataHelpers'
import rootBucket from '../data/buckets'
import { Preferences } from '../utils/constants'

export const buildBuckets = (applicants, prefIDs) => {
  // clear out the applicants from any previous addApplicant calls
  rootBucket.reset()
  applicants.forEach((applicant) => rootBucket.addApplicant(applicant))

  const applicantPaths = rootBucket.getApplicants()
  // this assumes the last path component is unique across buckets
  const groupedApplicants = Object.values(applicantPaths).reduce((acc, applicant) => {
    if (acc[applicant[1].at(-1)]) {
      acc[applicant[1].at(-1)].push(applicant)
    } else {
      acc[applicant[1].at(-1)] = [applicant]
    }
    return acc
  }, {})

  const buckets = prefIDs.map((id) => {
    const bucket = {
      preferenceName: Preferences[id].name,
      preferenceResults:
        groupedApplicants[id]?.map(([{ Rank: lotteryRank, LotteryNum: lotteryNumber }]) => ({
          lotteryRank,
          lotteryNumber
        })) || []
    }

    return bucket
  })

  return buckets
}

export function processExcelData(data) {
  const workbook = XLSX.read(data)
  const sheetName = workbook.SheetNames[0].trim()

  const { applicants, prefIDs } = getApplicantsAndPrefs(workbook)

  const buckets = buildBuckets(applicants, prefIDs)

  return {
    listing: {
      name: sheetName,
      address: sheetName,
      date: 'someday'
    },
    results: {
      lotteryBuckets: buckets,
      lotteryStatus: 'Complete',
      lotteryDate: 'someday'
    }
  }
}
