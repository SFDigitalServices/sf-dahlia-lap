import { performInSequence, performAllInSequence } from 'utils/promiseUtils'

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const getPromiseFunc = (retValue, onCompletedSpy = () => {}, slow = false) => {
  const markCompletedAndReturn = () => {
    onCompletedSpy()
    return retValue
  }

  return () => wait(slow ? 300 : 0).then(markCompletedAndReturn)
}

const wasCalledBefore = (spy1, spy2) =>
  spy1.mock.invocationCallOrder[0] < spy2.mock.invocationCallOrder[0]

const wereCalledInOrder = (spies) => {
  return spies.every((spy, i) => {
    if (i === 0) return true

    const lastSpy = spies[i - 1]
    return wasCalledBefore(lastSpy, spy)
  })
}

describe('performInSequence', () => {
  test('it returns the responses in order', () => {
    performInSequence(getPromiseFunc(1), getPromiseFunc(2))
      .then(responses => expect(responses).toEqual([1, 2]))
  })

  test('it returns the responses in order even when slow promise is first', () => {
    performInSequence(getPromiseFunc(1, () => {}, true), getPromiseFunc(2))
      .then(responses => expect(responses).toEqual([1, 2]))
  })

  test('it completes the responses in order even when slow promise is second', () => {
    const firstCompletedSpy = jest.fn()
    const secondCompletedSpy = jest.fn()
    performInSequence(
      getPromiseFunc(1, firstCompletedSpy),
      getPromiseFunc(2, secondCompletedSpy, true)
    ).then(responses => {
      expect(responses).toEqual([1, 2])
      expect(wasCalledBefore(firstCompletedSpy, secondCompletedSpy)).toBeTruthy()
    })
  })

  test('it completes the responses in order even when slow promise is first', () => {
    const firstCompletedSpy = jest.fn()
    const secondCompletedSpy = jest.fn()
    performInSequence(
      getPromiseFunc(1, firstCompletedSpy, true),
      getPromiseFunc(2, secondCompletedSpy)
    ).then(responses => {
      expect(responses).toEqual([1, 2])
      expect(wasCalledBefore(firstCompletedSpy, secondCompletedSpy)).toBeTruthy()
    })
  })
})

describe('performAllInSequence', () => {
  test('it returns the responses in order', () => {
    performAllInSequence([
      getPromiseFunc(1),
      getPromiseFunc(2),
      getPromiseFunc(3),
      getPromiseFunc(4)
    ]).then(responses => expect(responses).toEqual([1, 2, 3, 4]))
  })

  test('it returns the responses in order even when slow promise is first', () => {
    performAllInSequence([
      getPromiseFunc(1, () => {}, true),
      getPromiseFunc(2),
      getPromiseFunc(3),
      getPromiseFunc(4)
    ]).then(responses => expect(responses).toEqual([1, 2, 3, 4]))
  })

  test('it completes the responses in order even when slow promise is last', () => {
    const completedSpies = [jest.fn(), jest.fn(), jest.fn(), jest.fn()]
    performAllInSequence([
      getPromiseFunc(1, completedSpies[0]),
      getPromiseFunc(2, completedSpies[1]),
      getPromiseFunc(3, completedSpies[2]),
      getPromiseFunc(4, completedSpies[3], true)
    ]).then(responses => {
      expect(responses).toEqual([1, 2, 3, 4])
      expect(wereCalledInOrder(completedSpies)).toBeTruthy()
    })
  })

  test('it completes the responses in order even when slow promise is first', () => {
    const completedSpies = [jest.fn(), jest.fn(), jest.fn(), jest.fn()]
    performAllInSequence([
      getPromiseFunc(1, completedSpies[0], true),
      getPromiseFunc(2, completedSpies[1]),
      getPromiseFunc(3, completedSpies[2]),
      getPromiseFunc(4, completedSpies[3])
    ]).then(responses => {
      expect(responses).toEqual([1, 2, 3, 4])
      expect(wereCalledInOrder(completedSpies)).toBeTruthy()
    })
  })
})
