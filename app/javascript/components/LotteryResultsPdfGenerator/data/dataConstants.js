export const Preferences = [
  ['Veteran with Certificate of Preference (V-COP)', 'V-COP'],
  ['Certificate of Preference (COP)', 'COP'],
  ['Veteran with Displaced Tenant Housing Preference (V-DTHP)', 'V-DTHP'],
  ['Displaced Tenant Housing Preference (DTHP)', 'DTHP'],
  ['Veteran with Neighborhood Resident Housing Preference (V-NRHP)', 'V-NRHP'],
  ['Neighborhood Resident Housing Preference (NRHP)', 'NRHP'],
  ['Veteran with Live or Work in San Francisco Preference (V-L_W)', 'V-LW'],
  ['Live or Work in San Francisco Preference', 'LW']
].reduce(
  (result, [name, id], index) => ({
    ...result,
    [name]: { id, index }
  }),
  {}
)

export const PreferenceIDs = Object.values(Preferences).map(({ id }) => id)
export const IndexByPrefID = Object.fromEntries(PreferenceIDs.map((id, i) => [id, i]))

export function getPreferenceByName(prefName) {
  // some preference names may not include the shortcodes in parens above
  const result = Object.entries(Preferences).find(([key]) => key.startsWith(prefName))

  return result ? result[1] : null
}

export const InputColumns = [
  ['Rank', 'Lottery Rank (Unsorted)'],
  ['LotteryNum', 'Lottery Number'],
  ['Name', 'Primary Applicant Contact: Full Name'],
  ['PrefName', 'Preference'],
  ['HasPref', 'Receives Preference'],
  ['PrefRank', 'Preference Rank']
]

export const VetPref = 'VET'
