import * as XLSX from 'xlsx'

import { getPreferenceByName, IndexByPrefID, InputColumns, VetPref } from './dataConstants'

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

function getRowObjects(workbook) {
  const ws = workbook.Sheets[workbook.SheetNames[0]]
  const [header, ...rows] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false })
  const cols = getCols(InputColumns, header)
  return rows.map((row) => getRowAsObject(row, cols))
}

export function buildApplicantsAndPrefs(rowObjects) {
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

  return { applicants: Object.values(applicantsByNumber), prefIDs: prefIDsInOrder }
}

export function getApplicantsAndPrefs(workbook) {
  const rowObjects = getRowObjects(workbook)
  return buildApplicantsAndPrefs(rowObjects)
}
