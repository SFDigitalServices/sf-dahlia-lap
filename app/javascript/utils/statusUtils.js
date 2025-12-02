import { find, map } from 'lodash'

export const LEASE_UP_STATUS_OPTIONS = [
  {
    value: 'Processing',
    label: 'Processing',
    statusClassName: 'is-processing',
    commentRequired: true
  },
  { value: 'Withdrawn', label: 'Withdrawn', statusClassName: 'is-withdrawn' },
  { value: 'Appealed', label: 'Appealed', statusClassName: 'is-appealed', commentRequired: true },
  {
    value: 'Waitlisted',
    label: 'Waitlisted',
    statusClassName: 'is-waitlisted',
    commentRequired: true
  },
  {
    value: 'Disqualified',
    label: 'Disqualified',
    statusClassName: 'is-disqualified',
    commentRequired: true
  },
  { value: 'Approved', label: 'Approved', statusClassName: 'is-approved', commentRequired: true },
  { value: 'Lease Signed', label: 'Lease Signed', statusClassName: 'is-leased' }
]

export const LEASE_UP_SUBSTATUS_OPTIONS = {
  Processing: [
    { value: 'Invited to Apply', label: '📧 Invited to Apply' },
    { value: 'Check for docs: Showed interest', label: '📂 Check for docs: Showed interest' },
    { value: 'Reviewing application', label: 'Reviewing application' }
  ],
  Withdrawn: [
    { value: 'Written withdrawal', label: 'Written withdrawal' },
    { value: 'Verbal withdrawal', label: 'Verbal withdrawal', commentRequired: true },
    {
      value: 'Letter sent to applicant confirming withdrawal',
      label: 'Letter sent to applicant confirming withdrawal'
    }
  ],
  Appealed: [
    {
      value: 'Pending documentation from applicant to support request',
      label: 'Pending documentation from applicant to support request'
    },
    {
      value: 'Pending documentation from third party',
      label: 'Pending documentation from third party'
    },
    { value: 'Appeal meeting scheduled', label: 'Appeal meeting scheduled' },
    { value: 'None of the above', label: 'None of the above' }
  ],
  Waitlisted: [
    { value: 'Written confirmation sent', label: 'Written confirmation sent' },
    // {
    //   value: 'Asked to be contacted about future vacancies',
    //   label: 'Asked to be contacted about future vacancies'
    // },
    { value: 'None of the above', label: 'None of the above' }
  ],
  Disqualified: [
    {
      value: 'No response after two or more attempts',
      label: 'No response after two or more attempts'
    },
    { value: 'Missed 2 or more appointments', label: 'Missed 2 or more appointments' },
    { value: 'Under occupancy', label: 'Under occupancy' },
    { value: 'Over occupancy', label: 'Over occupancy' },
    { value: 'Missing documents', label: 'Missing documents' },
    { value: 'Under income, no rent subsidy', label: 'Under income, no rent subsidy' },
    { value: 'Over income', label: 'Over income' },
    { value: 'Does not meet credit standards', label: 'Does not meet credit standards' },
    { value: 'Does not meet criminal background', label: 'Does not meet criminal background' },
    {
      value: 'Does not meet other building restrictions',
      label: 'Does not meet other building restrictions'
    },
    {
      value: 'Unit did not pass subsidy inspection',
      label: 'Unit did not pass subsidy inspection'
    },
    { value: 'Does not meet age restrictions', label: 'Does not meet age restrictions' }
  ],
  Approved: [
    { value: 'Approval letter sent', label: 'Approval letter sent' },
    { value: 'Unit selected', label: 'Unit selected' },
    { value: 'Waiting for subsidy inspection', label: 'Waiting for subsidy inspection' }
  ]
}

export const LEASE_UP_STATUS_VALUES = LEASE_UP_STATUS_OPTIONS.map((option) => option.value)
export const LEASE_UP_SUBSTATUS_VALUES = map(LEASE_UP_SUBSTATUS_OPTIONS, (substatusList) =>
  map(substatusList, 'value')
).flat()

export const getLeaseUpStatusClass = (status) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, { value: status })
  return statusOption ? statusOption.statusClassName : 'tertiary'
}

export const getStatusPillClass = (status) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, { value: status })
  return statusOption ? statusOption.statusClassName : 'is-no-status'
}

export const getStatusPillLabel = (status) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, { value: status })
  return statusOption ? statusOption.label : null
}

export const getSubStatusLabel = (status, subStatus) => {
  const subStatusOption = find(LEASE_UP_SUBSTATUS_OPTIONS[status] || [], { value: subStatus })
  return subStatusOption ? subStatusOption.label : subStatus
}

export const statusRequiresComments = (status, substatus) => {
  const statusOption = find(LEASE_UP_STATUS_OPTIONS, { value: status })
  if (statusOption && statusOption.commentRequired) {
    return true
  } else if (substatus) {
    const subStatusOption = find(LEASE_UP_SUBSTATUS_OPTIONS[status], { value: substatus })
    return subStatusOption && subStatusOption.commentRequired
  }
  return false
}

export const validateStatusForm = (values) => {
  if (statusRequiresComments(values.status, values.subStatus) && values.comment.length) {
    return true
  } else if (values.status && !statusRequiresComments(values.status, values.subStatus)) {
    return true
  } else if (values.status && !LEASE_UP_SUBSTATUS_OPTIONS[values.status]) {
    return true
  }
  return null
}

export const LEASE_UP_ACCESSIBILITY_OPTIONS = [
  { value: 'Mobility impairments', label: 'Mobility' },
  { value: 'Vision impairments, Hearing impairments', label: 'Vision/Hearing' },
  { value: 'HCBS Units', label: 'HCBS units' }
]

export default LEASE_UP_STATUS_OPTIONS
