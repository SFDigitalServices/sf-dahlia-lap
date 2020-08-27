import moment from 'moment'

// 8-25-2020 -> 1598386370
const toTimeStamp = (dateString) => moment(dateString, 'mm-dd-yyyy').utc().format('X')

const statusItem = {
  status: 'Approved',
  subStatus: 'Approval letter sent',
  comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque bibendum condimentum lorem consectetur eleifend.',
  timeStamp: toTimeStamp('08-25-2020')
}

export const mockStatusItem = (overrides = {}) => ({ ...statusItem, ...overrides })

export const mockStatusItems = () => [
  mockStatusItem({
    timeStamp: toTimeStamp('08-25-2020')
  }),
  mockStatusItem({
    subStatus: 'Unit selected',
    timeStamp: toTimeStamp('08-24-2020')
  }),
  mockStatusItem({
    subStatus: 'Waiting for subsidy inspection',
    timeStamp: toTimeStamp('08-23-2020')
  }),
  mockStatusItem({
    status: 'Waitlisted',
    subStatus: 'Written confirmation sent',
    timeStamp: toTimeStamp('08-22-2020'),
    comment: null }),
  mockStatusItem({
    status: 'Lease Signed',
    subStatus: null,
    timeStamp: toTimeStamp('08-21-2020')
  }),
  mockStatusItem({
    status: 'Lease Signed',
    subStatus: null,
    comment: null,
    timeStamp: toTimeStamp('08-20-2020')
  })
]

export const mockManyStatusItems = (n) =>
  Array.from({ length: n }, () => mockStatusItem())
