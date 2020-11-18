import { clone } from 'lodash'

import formUtils from 'utils/formUtils'
import { LEASE_UP_ACCESSIBILITY_OPTIONS, LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

export const LEASE_UP_APPLICATION_FILTERS = [
  {
    label: 'Preferences',
    getOptions: ({ listingPreferences }) =>
      formUtils.toOptions([
        formUtils.toEmptyOption('Any Preference'),
        ...listingPreferences,
        ['general', 'General']
      ]),
    fieldName: 'preference',
    placeholder: 'Preference'
  },
  {
    label: 'Household Members',
    getOptions: () =>
      formUtils.toOptions([formUtils.toEmptyOption('Any HH Members'), '1', '2', '3', '4', '5+']),
    fieldName: 'total_household_size'
  },
  {
    label: 'Accessibility Requests',
    getOptions: () => [
      formUtils.toEmptyOption('Any Accessibility Request'),
      ...clone(LEASE_UP_ACCESSIBILITY_OPTIONS)
    ],
    fieldName: 'accessibility',
    placeholder: 'Accessibility Requests'
  },
  {
    label: 'Application Status',
    getOptions: () =>
      formUtils.toOptions([
        formUtils.toEmptyOption('Any Status'),
        formUtils.toOption('No Status'),
        ...clone(LEASE_UP_STATUS_OPTIONS)
      ]),
    fieldName: 'status',
    placeholder: 'Status'
  }
]
