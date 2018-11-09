import { find } from 'lodash'

export const LEASE_UP_STATUS_OPTIONS = [
  {value: 'No Status', label: 'No Status'},
  {value: 'Processing', label: 'Processing', style: 'is-processing'},
  {value: 'Disqualified', label: 'Disqualified', style: 'is-disqualified'},
  {value: 'Approved', label: 'Approved', style: 'is-approved'},
  {value: 'Lease Signed', label: 'Lease Signed', style: 'is-leased'},
  {value: 'Waitlisted', label: 'Waitlisted', style: 'is-waitlisted'},
  {value: 'Withdrawn', label: 'Withdrawn', style: 'is-withdrawn'},
  {value: 'Appealed', label: 'Appealed', style: 'is-appealed'},
  {value: null, label: 'All Status'}
]

export const getLeaseUpStatusClass = (status) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, {value: status})
  return statusOption ? statusOption.style : 'tertiary'
}

export default LEASE_UP_STATUS_OPTIONS
