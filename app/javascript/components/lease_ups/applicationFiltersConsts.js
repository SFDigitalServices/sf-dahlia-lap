import { clone } from 'lodash'

import formUtils from 'utils/formUtils'
import { LEASE_UP_ACCESSIBILITY_OPTIONS } from 'utils/statusUtils'

export const getLeaseUpApplicationFilters = (
  listingId,
  statusOptions,
  includePreferences = true
) => {
  const filters = [
    {
      label: 'Household Members',
      getOptions: () => formUtils.toOptions(['1', '2', '3', '4', '5+']),
      fieldName: 'total_household_size'
    },
    {
      label: 'Accessibility Requests',
      getOptions: () => [...clone(LEASE_UP_ACCESSIBILITY_OPTIONS)],
      fieldName: 'accessibility',
      placeholder: 'Accessibility Requests'
    },
    {
      label: 'Application Status',
      getOptions: () =>
        formUtils.toOptions([formUtils.toOption('No Status'), ...clone(statusOptions)]),
      fieldName: 'status',
      placeholder: 'Status'
    }
  ]

  if (includePreferences) {
    filters.unshift({
      label: 'Preferences',
      getOptions: ({ listingPreferences }) =>
        formUtils.toOptions([...listingPreferences, ['general', 'General']]),
      fieldName: 'preference',
      placeholder: 'Preference'
    })
  }

  return filters
}
