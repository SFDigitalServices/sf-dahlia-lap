import * as XLSX from 'xlsx'

import { getPreferenceNameByShortcode } from './dataConstants'
import { getApplicantsAndPrefs } from './dataHelpers'

export const buildBuckets = (applicants, prefIDs) => {
  const buckets = applicants.reduce((acc, { Rank, LotteryNum, prefs }) => {
    let delegated = false
    for (const prefID of prefIDs) {
      if (prefs[prefID]) {
        if (acc[prefID]?.preferenceResults) {
          acc[prefID].preferenceResults.push({ Rank, LotteryNum })
        } else {
          acc[prefID] = {
            preferenceName: getPreferenceNameByShortcode(prefID),
            preferenceResults: [{ Rank, LotteryNum }]
          }
        }
        delegated = true
      } else {
        if (!acc[prefID]?.preferenceResults) {
          acc[prefID] = {
            preferenceName: getPreferenceNameByShortcode(prefID),
            preferenceResults: []
          }
        }
      }
    }

    if (!delegated) {
      if (acc.generalLottery?.preferenceResults) {
        acc.generalLottery.preferenceResults.push({ Rank, LotteryNum })
      } else {
        acc.generalLottery = {
          preferenceName: 'generalLottery',
          preferenceResults: [{ Rank, LotteryNum }]
        }
      }
    }
    return acc
  }, {})

  return Object.values(buckets)
}

export const processExcelData = (data) => {
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
