import moment from 'moment'

const toTimeStamp = (dateString) => moment.utc(dateString, 'MM-DD-YYYY hh:mm').unix()

const statusItem = {
  status: 'Approved',
  substatus: 'Approval letter sent',
  comment:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque bibendum condimentum lorem consectetur eleifend.',
  timestamp: toTimeStamp('08-25-2020 20:00')
}

export const mockStatusItem = (overrides = {}) => ({ ...statusItem, ...overrides })

export const mockStatusItems = () => [
  mockStatusItem({
    timestamp: toTimeStamp('08-25-2020 20:00')
  }),
  mockStatusItem({
    substatus: 'Unit selected',
    timestamp: toTimeStamp('08-24-2020 20:00')
  }),
  mockStatusItem({
    substatus: 'Waiting for subsidy inspection',
    timestamp: toTimeStamp('08-23-2020 20:00')
  }),
  mockStatusItem({
    status: 'Waitlisted',
    substatus: 'Written confirmation sent',
    timestamp: toTimeStamp('08-22-2020 20:00'),
    comment: null
  }),
  mockStatusItem({
    status: 'Lease Signed',
    substatus: null,
    timestamp: toTimeStamp('08-21-2020 20:00')
  }),
  mockStatusItem({
    status: 'Lease Signed',
    substatus: null,
    comment: null,
    timestamp: toTimeStamp('08-20-2020 20:00')
  })
]

export const mockManyStatusItems = (n) => Array.from({ length: n }, () => mockStatusItem())
