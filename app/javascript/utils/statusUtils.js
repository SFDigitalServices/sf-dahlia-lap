import { find } from 'lodash'

export const LEASE_UP_STATUS_OPTIONS = [
  {value: 'Processing', label: 'Processing', style: 'is-processing'},
  {value: 'Withdrawn', label: 'Withdrawn', style: 'is-withdrawn'},
  {value: 'Appealed', label: 'Appealed', style: 'is-appealed'},
  {value: 'Waitlisted', label: 'Waitlisted', style: 'is-waitlisted'},
  {value: 'Disqualified', label: 'Disqualified', style: 'is-disqualified'},
  {value: 'Approved', label: 'Approved', style: 'is-approved'},
  {value: 'Lease Signed', label: 'Lease Signed', style: 'is-leased'}
]

export const getLeaseUpStatusClass = (status) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, {value: status})
  return statusOption ? statusOption.style : 'tertiary'
}
