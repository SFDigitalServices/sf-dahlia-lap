import listing from 'spec/javascript/fixtures/listing'
import * as XLSX from 'xlsx'

import { getApplicantsAndPrefs } from './dataHelpers'
import rootBucket from '../data/buckets'
import { Preferences } from '../utils/constants'

export function processExcelData(data) {
  const workbook = getWorkbook(data)
  return processData(workbook)
}

const getWorkbook = (data) => {
  return XLSX.read(data)
}

const createDataResponseObject = (sheetName, buckets) => {
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

export function processData(workbook) {
  const sheetName = workbook.SheetNames[0].trim()
  const { applicants, prefIDs } = getApplicantsAndPrefs(workbook)

  // clear out the applicants from any previous addApplicant calls
  rootBucket.reset()
  applicants.forEach((applicant) => rootBucket.addApplicant(applicant))

  const applicantPaths = rootBucket.getApplicants()
  // this assumes the last path component is unique across buckets
  const groupedApplicants = Object.groupBy(applicantPaths, ([, path]) => path.at(-1))
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

  return createDataResponseObject(sheetName, buckets)
}
