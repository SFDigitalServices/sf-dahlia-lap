import arrayUtils from 'utils/arrayUtils'

describe('arrayUtils', () => {
  describe('cycle', () => {
    test('it should go back to beginning when next', () => {
      const cycle = arrayUtils.cycle([1, 2, 3])

      expect(cycle.next()).toBe(2)
      expect(cycle.next()).toBe(3)
      expect(cycle.next()).toBe(1)
      expect(cycle.next()).toBe(2)
      expect(cycle.next()).toBe(3)
      expect(cycle.next()).toBe(1)
    })

    test('it should go from begining to end when prev', () => {
      const cycle = arrayUtils.cycle([1, 2, 3])

      expect(cycle.prev()).toBe(3)
      expect(cycle.prev()).toBe(2)
      expect(cycle.prev()).toBe(1)
      expect(cycle.prev()).toBe(3)
      expect(cycle.prev()).toBe(2)
      expect(cycle.prev()).toBe(1)
    })
  })
  describe('split', () => {
    const testArray = [1, 2, 3, 4, 5]
    test('it should split on splitOn if provided', () => {
      const { firstHalf, secondHalf } = arrayUtils.split(testArray, 4)
      expect(firstHalf).toEqual([1, 2, 3, 4])
      expect(secondHalf).toEqual([5])
    })
    test('it should split in half if no index is provided', () => {
      const { firstHalf, secondHalf } = arrayUtils.split(testArray)
      expect(firstHalf).toEqual([1, 2])
      expect(secondHalf).toEqual([3, 4, 5])
    })
  })
})
