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

export const LEASE_UP_SUBSTATUS_OPTIONS = {
  Withdrawn: [
    { value: 'Written withdrawal', label: 'Written withdrawal' },
    { value: 'Verbal withdrawal', label: 'Verbal withdrawal' },
    { value: 'Letter sent to applicant confirming withdrawal', label: 'Letter sent to applicant confirming withdrawal' }
  ],
  Appealed: [
    { value: 'Pending documentation from third party', label: 'Pending documentation from third party' },
    { value: 'None of the above', label: 'None of the above' }
  ],
  Waitlisted: [
    { value: 'None of the above', label: 'None of the above' }
  ],
  Disqualified: [
    { value: 'No response after two or more attempts', label: 'No response after two or more attempts' },
    { value: 'Does not meet credit standards', label: 'Does not meet credit standards' }
  ],
  Approved: [
    { value: 'Waiting for subsidy inspection', label: 'Waiting for subsidy inspection' }
  ]
}

export const getLeaseUpStatusClass = (status) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, {value: status})
  return statusOption ? statusOption.style : 'tertiary'
}

export default LEASE_UP_STATUS_OPTIONS
