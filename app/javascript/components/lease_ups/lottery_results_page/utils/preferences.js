// Canonical lottery preference definitions.
//
// `id` MUST match the Salesforce `Custom_Preference_Type__c` /
// `Record_Type_For_App_Preferences__c` value, since that's what the lottery
// results records are bucketed by.  Keep this list in sync with
// `Force::Preference::PREFERENCE_TYPES` in app/models/force/preference.rb.
//
// Salesforce is inconsistent about whether a preference name includes its
// abbreviation in parens (e.g. both "Certificate of Preference (COP)" and
// "Certificate of Preference" appear on real records), so each preference is
// registered under its id, its full name, AND its name with the parenthetical
// stripped.  Missing one of those aliases silently drops applicants from the
// results, which is what this indexing is guarding against.

const Units100Pct = 'Up to 100% of units'
const Units20Pct = 'Up to 20% of units'
const Units40Pct = 'Up to 40% of units'
const Units100PctRemaining = 'Up to 100% of remaining units'
const UnitsRemaining = 'Remaining units'

// preferences with no unit set-aside of their own are open to all the units.
// the subtitle is editable in the UI, so a listing that does set one aside can
// still be corrected by hand before printing.
const NoSetAside = Units100Pct

export const GENERAL_LOTTERY_ID = 'General List'
export const UNFILTERED_ID = 'Unfiltered Rank'

// Preferences that always get a column in the results, even when empty, to
// preserve the historical shape of the printed PDF.
export const AlwaysVisiblePreferenceIDs = ['COP', 'DTHP', 'NRHP', 'L_W']

const PreferenceDefinitions = [
  // Right to Return is per-development, so each one is its own record type.
  // Only the Hunters View code has been observed in lottery results data; other
  // developments (Sunnydale, Potrero) presumably follow the same RTR-<letter>
  // pattern but their codes are unconfirmed, and an unconfirmed guess here
  // would silently mislabel a column.  An unlisted code still reaches the
  // unfiltered rank and logs a warning, which is how this one was found.
  {
    id: 'RTR-H',
    name: 'Right to Return - Hunters View',
    shortName: 'RTR',
    subtitle: NoSetAside
  },
  {
    id: 'V-COP',
    name: 'Veteran with Certificate of Preference (V-COP)',
    subtitle: Units100Pct
  },
  {
    id: 'COP',
    name: 'Certificate of Preference (COP)',
    subtitle: Units100Pct
  },
  {
    id: 'V-DTHP',
    name: 'Veteran with Displaced Tenant Housing Preference (V-DTHP)',
    subtitle: Units20Pct
  },
  {
    id: 'DTHP',
    name: 'Displaced Tenant Housing Preference (DTHP)',
    subtitle: Units20Pct
  },
  {
    id: 'V-NRHP',
    name: 'Veteran with Neighborhood Resident Housing Preference (V-NRHP)',
    subtitle: Units40Pct
  },
  {
    id: 'NRHP',
    name: 'Neighborhood Resident Housing Preference (NRHP)',
    subtitle: Units40Pct
  },
  {
    id: 'V-L_W',
    name: 'Veteran with Live or Work in San Francisco Preference (V-L_W)',
    subtitle: Units100PctRemaining
  },
  {
    id: 'L_W',
    name: 'Live or Work in San Francisco Preference',
    shortName: 'Live/Work',
    subtitle: Units100PctRemaining
  },
  {
    id: 'V-ADHP',
    name: 'Veteran with Anti-Displacement Housing Preference (V-ADHP)',
    subtitle: NoSetAside
  },
  {
    id: 'ADHP',
    name: 'Anti-Displacement Housing Preference (ADHP)',
    subtitle: NoSetAside
  },
  {
    id: 'V-RB_AHP',
    name: 'Veteran with Rent Burdened / Assisted Housing Preference (V-RB_AHP)',
    shortName: 'V-RB/AHP',
    subtitle: NoSetAside
  },
  {
    id: 'RB_AHP',
    name: 'Rent Burdened / Assisted Housing Preference',
    shortName: 'RB/AHP',
    subtitle: NoSetAside
  },
  {
    id: 'V-AG',
    name: 'Veteran with Alice Griffith Housing Development Resident (V-AG)',
    shortName: 'V-Alice Griffith',
    subtitle: NoSetAside
  },
  {
    id: 'AG',
    name: 'Alice Griffith Housing Development Resident',
    shortName: 'Alice Griffith',
    subtitle: NoSetAside
  },
  {
    id: 'DFR',
    name: 'DALP First Responders',
    shortName: 'First Responders',
    subtitle: NoSetAside
  },
  {
    id: 'DSE',
    name: 'DALP Educators',
    shortName: 'Educator',
    subtitle: NoSetAside
  },
  {
    id: 'Custom',
    name: 'Custom',
    subtitle: NoSetAside
  },
  {
    id: GENERAL_LOTTERY_ID,
    name: 'generalLottery',
    subtitle: UnitsRemaining
  },
  {
    id: UNFILTERED_ID,
    name: 'Unfiltered',
    subtitle: 'Ticket #'
  }
]

// strip a trailing parenthetical abbreviation, e.g.
// "Certificate of Preference (COP)" -> "Certificate of Preference"
const nameWithoutID = (name) => name.replace(/ \(.+$/, '')

export const Preferences = PreferenceDefinitions.reduce(
  (result, { id, name, subtitle, shortName = id }, index) => {
    const isVeteran = id.startsWith('V-')
    const preference = {
      id,
      name,
      subtitle,
      shortName,
      index,
      isVeteran,
      relatedPrefID: isVeteran ? id.slice(2) : ''
    }

    // make the preference reachable by id, full name, and name sans abbreviation
    result[id] = preference
    result[name] = preference
    result[nameWithoutID(name)] = preference

    return result
  },
  {}
)

// ids of the actual lottery preferences, in display order, excluding the
// synthetic General List / Unfiltered Rank columns
export const LotteryPreferenceIDs = PreferenceDefinitions.map(({ id }) => id).filter(
  (id) => id !== GENERAL_LOTTERY_ID && id !== UNFILTERED_ID
)

// ids of the non-veteran lottery preferences, in display order
export const NonVeteranPreferenceIDs = LotteryPreferenceIDs.filter(
  (id) => !Preferences[id].isVeteran
)
