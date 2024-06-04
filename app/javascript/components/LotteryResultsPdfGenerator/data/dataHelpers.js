import * as XLSX from 'xlsx'

import { getPreferenceByName, IndexByPrefID } from './dataConstants'

const OutputHeaders = ['Lottery Rank', 'Lottery Number', 'Applicant Full Name']
const InputColumns = [
  ['Rank', 'Lottery Rank (Unsorted)'],
  ['LotteryNum', 'Lottery Number'],
  ['Name', 'Primary Applicant Contact: Full Name'],
  ['PrefName', 'Preference'],
  ['HasPref', 'Receives Preference'],
  ['PrefRank', 'Preference Rank']
]
const OutputSheet = 'Processed'
const VetPref = 'VET'

function getCols(columns, headers) {
  const cols = {}

  for (const [name, label] of columns) {
    cols[name] = {
      label,
      index: headers.indexOf(label)
    }
  }

  return cols
}

function getRowAsObject(row, cols) {
  const data = {}

  for (const [name, { index }] of Object.entries(cols)) {
    data[name] = row[index]
  }

  return data
}

export function getApplicantsAndPrefs(workbook) {
  const ws = workbook.Sheets[workbook.SheetNames[0]]
  const [header, ...rows] = XLSX.utils.sheet_to_json(ws, { header: 1 })
  const cols = getCols(InputColumns, header)
  const rowObjects = rows.map((row) => getRowAsObject(row, cols))
  const applicantsByNumber = {}
  const foundPrefs = new Set()

  // make sure the rows are sorted ascending by lottery rank, which may not always be the case in the exported file
  rowObjects.sort((a, b) => a.Rank - b.Rank)

  for (const row of rowObjects) {
    const { Name, Rank, LotteryNum, PrefName, HasPref } = row
    const applicant =
      applicantsByNumber[LotteryNum] ||
      (applicantsByNumber[LotteryNum] = { Name, Rank, LotteryNum, prefs: {} })
    // we can't just index into Preferences with the name because the names can vary by listing
    const prefID = getPreferenceByName(PrefName)?.id

    if (prefID) {
      applicant.prefs[prefID] = HasPref
      foundPrefs.add(prefID)

      if (prefID.startsWith('V-')) {
        applicant.prefs[VetPref] = HasPref
      }
    } else {
      console.error(`Unknown preference: ${PrefName}`)
    }
  }

  // put the prefs in the correct order, since foundPrefs will have them in whatever order they were found in.  then
  // call flat() to remove any holes in the array, which we'll have if the spreadsheet doesn't include the full
  // complement of available prefs.
  const prefIDsInOrder = [...foundPrefs]
    .reduce((result, id) => {
      result[IndexByPrefID[id]] = id

      return result
    }, [])
    .flat()

  // the "General List" contains everyone who has zero prefs, and isn't its
  // own preference, so it won't have been added to prefIDsInOrder.  but every
  // lottery should have that category, so add it.
  prefIDsInOrder.push('General List')

  return [Object.values(applicantsByNumber), prefIDsInOrder]
}

export function getWorkbookFromApplicants(applicants, prefIDs) {
  const outputRows = applicants.map((applicant) => {
    const { Rank, LotteryNum, Name } = applicant
    // convert the TRUE/FALSE from the spreadsheet to 1 or 0
    const prefs = prefIDs.map((pref) => Number(applicant.prefs[pref]))

    return [Rank, LotteryNum, Name, ...prefs]
  })

  // include columns for whatever prefs were found in the source spreadsheet
  outputRows.unshift([...OutputHeaders, ...prefIDs])

  return {
    SheetNames: [OutputSheet],
    Sheets: {
      [OutputSheet]: XLSX.utils.aoa_to_sheet(outputRows)
    }
  }
}

export function getRawOrder(applicants) {
  return applicants.map(({ LotteryNum }) => LotteryNum)
}

export function getOrderByPref(applicants, pref) {
  return applicants
    .filter((applicant) => !!applicant.prefs[pref])
    .map(({ LotteryNum }) => LotteryNum)
}

export function getNoPref(applicants) {
  // use == to handle "0" strings as well as numbers
  return applicants
    .filter(({ prefs }) => Object.values(prefs).every((hasPref) => hasPref === 0))
    .map(({ LotteryNum }) => LotteryNum)
}
