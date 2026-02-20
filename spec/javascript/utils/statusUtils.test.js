import { LEASE_UP_STATUSES } from 'utils/statusUtils'

describe('statusUtils', () => {
  describe('LEASE_UP_STATUSES', () => {
    test('should have the correct order of status options', () => {
      const expectedOrder = [
        'Outreach',
        'Processing',
        'Withdrawn',
        'Appealed',
        'Waitlisted',
        'Disqualified',
        'Approved',
        'Lease Signed'
      ]
      const actualOrder = LEASE_UP_STATUSES.map((status) => status.value)
      expect(actualOrder).toEqual(expectedOrder)
    })
  })
})
