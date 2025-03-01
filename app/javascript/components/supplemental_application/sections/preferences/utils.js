import React from 'react'

import { reject, orderBy } from 'lodash'

import FormGrid from 'components/molecules/FormGrid'
import formUtils from 'utils/formUtils'

const testRegex = (regex) => (value) => regex.test(value)

/* Preference name */

export const isCOP = testRegex(/COP/)

export const isDTHP = testRegex(/DTHP/)

export const isAliceGriffith = testRegex(/AG/)

export const isRightToReturn = testRegex(/RTR/)

export const isLWinSF = (value) => value === 'Live or Work in San Francisco Preference'

export const isADHP = testRegex(/ADHP/)

export const isNRHP = testRegex(/NRHP/)

export const isRentBurdenedAssistedHousing = (value) =>
  value === 'Rent Burdened / Assisted Housing Preference'

/* Individual Preference */

export const isLiveInSF = (value) => value === 'Live in SF'

export const isAssistedHousing = (value) => value === 'Assisted Housing'

export const isRentBurdened = (value) => value === 'Rent Burdened'

const onlyValid = (preferences) => {
  return reject(preferences, (pref) => {
    return !pref.receives_preference
  })
}

export const sortAndFilter = (preferences) => {
  const sortedPreferences = orderBy(preferences, 'preference_order', 'asc')
  return onlyValid(sortedPreferences)
}

export const getPreferenceName = (preference) => {
  const preferenceName = preference.preference_name
  const individualPreference = preference.individual_preference
  if (isLWinSF(preferenceName)) {
    if (isLiveInSF(individualPreference)) {
      return 'Live in San Francisco Preference'
    } else {
      return 'Work in San Francisco Preference'
    }
  } else if (isRentBurdenedAssistedHousing(preferenceName)) {
    if (isAssistedHousing(individualPreference)) {
      return 'Assisted Housing Preference'
    } else if (isRentBurdened(individualPreference)) {
      return 'Rent Burdened Preference'
    } else {
      return preferenceName
    }
  } else {
    return preferenceName
  }
}

export const statusOptions = formUtils.toOptions(['Unconfirmed', 'Confirmed', 'Invalid'])

export const individualPreferenceOptions = formUtils.toOptions(['Live in SF', 'Work in SF'])

export const FormItem = ({ label, children }) => (
  <FormGrid.Item>
    <FormGrid.Group label={label}>{children}</FormGrid.Group>
  </FormGrid.Item>
)

export const Comment = ({ children }) => <p className='t-base c-steel'>{children}</p>
