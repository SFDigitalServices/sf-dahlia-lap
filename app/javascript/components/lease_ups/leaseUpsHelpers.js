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

export const PAGE_SIZE = 5

export const getLeaseUpStatusStyle = (status) => {
  var style = 'tertiary'
  var statusStyle = find(LEASE_UP_STATUS_OPTIONS, {value: status})
  if (statusStyle) style = statusStyle.style
  return style
}
