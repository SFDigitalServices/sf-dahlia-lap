const Units100Pct = 'Up to 100% of units'
const Units100PctRemaining = 'Up to 100% of remaining units'
const Units40Pct = 'Up to 40% of units'
const Units20Pct = 'Up to 20% of units'
const UnitsRemaining = 'Remaining units'

// the first item in each array is the preference name supplied by Salesforce.
// the second is a shorter ID we want to use to refer to it in our code and in
// the results PDF.  the third item is a subtitle only used in the PDF.
export const Preferences = [
  {
    name: 'Veteran with Certificate of Preference (V-COP)',
    id: 'V-COP',
    subtitle: Units100Pct
  },
  {
    name: 'Certificate of Preference (COP)',
    id: 'COP',
    subtitle: Units100Pct
  },
  {
    name: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
    id: 'V-DTHP',
    subtitle: Units20Pct
  },
  {
    name: 'Displaced Tenant Housing Preference (DTHP)',
    id: 'DTHP',
    subtitle: Units20Pct
  },
  {
    name: 'Veteran with Neighborhood Resident Housing Preference (V-NRHP)',
    id: 'V-NRHP',
    subtitle: Units40Pct
  },
  {
    name: 'Neighborhood Resident Housing Preference (NRHP)',
    id: 'NRHP',
    subtitle: Units40Pct
  },
  {
    name: 'Veteran with Live or Work in San Francisco Preference (V-L_W)',
    id: 'V-LW',
    subtitle: Units100PctRemaining
  },
  {
    name: 'Live or Work in San Francisco Preference',
    id: 'LW',
    shortName: 'Live/Work',
    subtitle: Units100PctRemaining
  },
  {
    name: 'generalLottery',
    id: 'General List',
    subtitle: UnitsRemaining
  },
  {
    name: 'Unfiltered',
    id: 'Unfiltered Rank',
    subtitle: 'Ticket #'
  }
].reduce((result, { name, id, subtitle, shortName = id }, index) => {
  const isVeteran = id.startsWith('V-')
  const relatedPrefID = isVeteran ? id.slice(2) : ''
  const pref = { id, name, subtitle, shortName, index, isVeteran, relatedPrefID }

  // make the pref accessible by both name and ID
  result[name] = result[id] = pref

  return result
}, {})

export const PreferenceIDs = [...new Set(Object.values(Preferences).map(({ id }) => id))]
export const IndexByPrefID = Object.fromEntries(PreferenceIDs.map((id, i) => [id, i]))
