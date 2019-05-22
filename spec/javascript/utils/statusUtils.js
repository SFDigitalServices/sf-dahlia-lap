const requiredStatuses = ['processing', 'appealed', 'waitlisted', 'disqualified', 'approved']
const requiredSubstatuses = ['verbal withdrawal']

export const statusRequiresComments = (status, substatus) => {
  const statusOption = requiredStatuses.some(val => status.includes(val))
  if (statusOption) {
    return true
  } else {
    return requiredSubstatuses.some(val => substatus.includes(val))
  }
}
