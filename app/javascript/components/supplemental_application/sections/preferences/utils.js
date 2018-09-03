import React from 'react'
import FormGrid from '~/components/molecules/FormGrid'

import formUtils from '~/utils/formUtils'

const test = (regex) => (value) => regex.test(value)

/* Preference name */

export const isCOP = test(/COP/)

export const isDTHP = test(/DTHP/)

export const isAliceGriffith = test(/Griffith/)

export const isLWinSF = value => value === 'Live or Work in San Francisco Preference'

export const isADHP = test(/ADHP/)

export const isNRHP = test(/NRHP/)

export const isRentBurdenedAssistedHousing = value => value === 'Rent Burdened / Assisted Housing Preference'

/* Individual Preference */

export const isLiveInSF = value => value === 'Live in SF'

export const isAssistedHousing = value => value === 'Assisted Housing'

export const isRentBurdened = value => value === 'Rent Burdened'

export const getPreferenceName = ({ preferenceName, individualPreference }) => {
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

export const statusOptions = formUtils.toOptions(['Confirmed', 'Unconfirmed', 'Invalid'])

export const individualPreferenceOptions = formUtils.toOptions(['Live in SF', 'Work in SF'])

export const FormItem = ({label, children}) => (
  <FormGrid.Item>
    <FormGrid.Group label={label}>
      {children}
    </FormGrid.Group>
  </FormGrid.Item>
)

export const Comment = ({children}) => (
  <p className='t-base c-steel'>
    {children}
  </p>
)
