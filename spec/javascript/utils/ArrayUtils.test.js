import React from 'react'
import arrayUtils from 'utils/arrayUtils'

describe('arrayUtils', () => {
  describe('cycle', () => {
    test('it should go back to beginning whe next', () => {
      const cycle = arrayUtils.cycle([1,2,3])

      expect(cycle.next()).toEqual(2)
      expect(cycle.next()).toEqual(3)
      expect(cycle.next()).toEqual(1)
      expect(cycle.next()).toEqual(2)
      expect(cycle.next()).toEqual(3)
      expect(cycle.next()).toEqual(1)
    })

    test('it should go from begining to end when prev', () => {
      const cycle = arrayUtils.cycle([1,2,3])

      expect(cycle.prev()).toEqual(3)
      expect(cycle.prev()).toEqual(2)
      expect(cycle.prev()).toEqual(1)
      expect(cycle.prev()).toEqual(3)
      expect(cycle.prev()).toEqual(2)
      expect(cycle.prev()).toEqual(1)
    })
  })
})
