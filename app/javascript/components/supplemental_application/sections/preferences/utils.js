const test = (regex) => (value) => regex.test(value)

/* Preference name */

export const isCOP = test(/COP/)

export const isDTHP = test(/DTHP/)

export const isGriffith = test(/Griffith/)

export const isLWinSF = value => value === 'Live or Work in San Francisco Preference'

export const isADHP = test(/ADHP/)

export const isNRHP = test(/NRHP/)

export const isBurdenedAssistedHousing = value => value === 'Rent Burdened / Assisted Housing Preference'


/* Individual Prefrence */

export const isLiveInSF = value => value === 'Live in SF'

export const isAssistedHousing = value => value === 'Assisted Housing'

export const isRentBurdened = value => value === 'Rent Burdened'

export const getPreferenceName = ({ preference_name, individual_preference }) => {
  if (isLWinSF(preference_name)) {
    if (isLiveInSF(individual_preference)) {
      return "Live in San Francisco Preference"
    } else {
      return "Work in San Francisco Preference"
    }
  } else if (isBurdenedAssistedHousing(preference_name)) {
    if (isAssistedHousing(individual_preference)) {
      return "Assisted Housing Preference"
    } else if (isRentBurdened(individual_preference)) {
      return "Rent Burdened Preference"
    } else {
      return preference_name
    }
  } else {
    return preference_name
  }
}
