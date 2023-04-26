import { performAllInSequence, performInSequence, performOrDefault } from 'utils/promiseUtils'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getPromiseFunc = ({
  value = null,
  onCompletedSpy = () => {},
  slow = false,
  fail = false
} = {}) => {
  const markCompletedAndReturn = () => {
    onCompletedSpy()
    return value
  }

  return () =>
    wait(slow ? 300 : 0)
      .then(markCompletedAndReturn)
      .then((result) => {
        if (fail) throw new Error('Promise failed with return value: ' + value)

        return value
      })
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

describe('performOrDefault', () => {
  const defaultValue = 1
  const promiseValue = 2

  let promiseTriggeredSpy
  let resultValue
  let errorCaught

  const runPerformOrDefault = async ({ condition, promiseFails = false }) => {
    resultValue = await performOrDefault(
      condition,
      getPromiseFunc({
        value: promiseValue,
        onCompletedSpy: promiseTriggeredSpy,
        fail: promiseFails
      }),
      defaultValue
    ).catch(() => {
      errorCaught = true
    })
  }

  beforeEach(() => {
    promiseTriggeredSpy = jest.fn()
    errorCaught = false
    resultValue = undefined
  })

  describe('when the condition is true', () => {
    beforeEach(async () => {
      await runPerformOrDefault({ condition: true })
    })

    test('it returns the promise value', async () => {
      expect(resultValue).toEqual(promiseValue)
    })

    test('it triggers the promise', async () => {
      expect(promiseTriggeredSpy.mock.calls).toHaveLength(1)
    })

    test('it does not cause an error', async () => {
      expect(errorCaught).toBeFalsy()
    })

    describe('when the request fails', () => {
      beforeEach(async () => {
        await runPerformOrDefault({ condition: true, promiseFails: true })
      })

      test('it errors out', async () => {
        expect(errorCaught).toBeTruthy()
      })
    })
  })

  describe('when the condition is false', () => {
    beforeEach(async () => {
      await runPerformOrDefault({ condition: false })
    })

    test('it returns the default value', async () => {
      expect(resultValue).toEqual(defaultValue)
    })

    test('it does not trigger the promise', async () => {
      expect(promiseTriggeredSpy.mock.calls).toHaveLength(0)
    })

    test('it does not cause an error', async () => {
      expect(errorCaught).toBeFalsy()
    })

    describe('when the request fails', () => {
      beforeEach(async () => {
        await runPerformOrDefault({ condition: false, promiseFails: true })
      })

      test('it does not error out', async () => {
        expect(errorCaught).toBeFalsy()
      })
    })
  })
})

describe('performInSequence', () => {
  describe('when all promises are successful', () => {
    test('it returns the responses in order', async () => {
      await performInSequence(getPromiseFunc({ value: 1 }), getPromiseFunc({ value: 2 })).then(
        (responses) => expect(responses).toEqual([1, 2])
      )
    })

    test('it returns the responses in order even when slow promise is first', async () => {
      await performInSequence(
        getPromiseFunc({ value: 1, slow: true }),
        getPromiseFunc({ value: 2 })
      ).then((responses) => expect(responses).toEqual([1, 2]))
    })

    test('it completes the responses in order even when slow promise is second', async () => {
      const firstCompletedSpy = jest.fn()
      const secondCompletedSpy = jest.fn()
      await performInSequence(
        getPromiseFunc({ value: 1, onCompletedSpy: firstCompletedSpy }),
        getPromiseFunc({ value: 2, onCompletedSpy: secondCompletedSpy, slow: true })
      ).then((responses) => {
        expect(responses).toEqual([1, 2])
        expect(wasCalledBefore(firstCompletedSpy, secondCompletedSpy)).toBeTruthy()
      })
    })

    test('it completes the responses in order even when slow promise is first', async () => {
      const firstCompletedSpy = jest.fn()
      const secondCompletedSpy = jest.fn()
      await performInSequence(
        getPromiseFunc({ value: 1, onCompletedSpy: firstCompletedSpy, slow: true }),
        getPromiseFunc({ value: 2, onCompletedSpy: secondCompletedSpy })
      ).then((responses) => {
        expect(responses).toEqual([1, 2])
        expect(wasCalledBefore(firstCompletedSpy, secondCompletedSpy)).toBeTruthy()
      })
    })
  })

  describe('when some responses fail', () => {
    it('fails when the first promise is rejected', async () => {
      const firstCompletedSpy = jest.fn()
      const secondCompletedSpy = jest.fn()
      let errorCaught = false

      await performInSequence(
        getPromiseFunc({ value: 1, onCompletedSpy: firstCompletedSpy, fail: true }),
        getPromiseFunc({ value: 2, onCompletedSpy: secondCompletedSpy })
      ).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(firstCompletedSpy.mock.calls).toHaveLength(1)
      expect(secondCompletedSpy.mock.calls).toHaveLength(0)
    })

    it('fails when the second promise is rejected', async () => {
      const firstCompletedSpy = jest.fn()
      const secondCompletedSpy = jest.fn()
      let errorCaught = false

      await performInSequence(
        getPromiseFunc({ value: 1, onCompletedSpy: firstCompletedSpy }),
        getPromiseFunc({ value: 2, onCompletedSpy: secondCompletedSpy, fail: true })
      ).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(firstCompletedSpy.mock.calls).toHaveLength(1)
      expect(secondCompletedSpy.mock.calls).toHaveLength(1)
    })

    it('fails when the both promises are rejected', async () => {
      const firstCompletedSpy = jest.fn()
      const secondCompletedSpy = jest.fn()
      let errorCaught = false

      await performInSequence(
        getPromiseFunc({ value: 1, onCompletedSpy: firstCompletedSpy, fail: true }),
        getPromiseFunc({ value: 2, onCompletedSpy: secondCompletedSpy, fail: true })
      ).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(firstCompletedSpy.mock.calls).toHaveLength(1)
      expect(secondCompletedSpy.mock.calls).toHaveLength(0)
    })
  })
})

describe('performAllInSequence', () => {
  let completedSpies

  beforeEach(() => {
    completedSpies = [jest.fn(), jest.fn(), jest.fn(), jest.fn()]
  })

  test('it works with an empty list', async () => {
    await performAllInSequence([]).then((responses) => expect(responses).toEqual([]))
  })

  test('it works with a single promise', async () => {
    await performAllInSequence([getPromiseFunc({ value: 1 })]).then((responses) =>
      expect(responses).toEqual([1])
    )
  })

  test('it returns the responses in order', async () => {
    await performAllInSequence([
      getPromiseFunc({ value: 1 }),
      getPromiseFunc({ value: 2 }),
      getPromiseFunc({ value: 3 }),
      getPromiseFunc({ value: 4 })
    ]).then((responses) => expect(responses).toEqual([1, 2, 3, 4]))
  })

  test('it returns the responses in order even when slow promise is first', async () => {
    await performAllInSequence([
      getPromiseFunc({ value: 1, slow: true }),
      getPromiseFunc({ value: 2 }),
      getPromiseFunc({ value: 3 }),
      getPromiseFunc({ value: 4 })
    ]).then((responses) => expect(responses).toEqual([1, 2, 3, 4]))
  })

  test('it completes the responses in order even when slow promise is last', async () => {
    await performAllInSequence([
      getPromiseFunc({ value: 1, onCompletedSpy: completedSpies[0] }),
      getPromiseFunc({ value: 2, onCompletedSpy: completedSpies[1] }),
      getPromiseFunc({ value: 3, onCompletedSpy: completedSpies[2] }),
      getPromiseFunc({ value: 4, onCompletedSpy: completedSpies[3], slow: true })
    ]).then((responses) => {
      expect(responses).toEqual([1, 2, 3, 4])
      expect(wereCalledInOrder(completedSpies)).toBeTruthy()
    })
  })

  test('it completes the responses in order even when slow promise is first', async () => {
    await performAllInSequence([
      getPromiseFunc({ value: 1, onCompletedSpy: completedSpies[0], slow: true }),
      getPromiseFunc({ value: 2, onCompletedSpy: completedSpies[1] }),
      getPromiseFunc({ value: 3, onCompletedSpy: completedSpies[2] }),
      getPromiseFunc({ value: 4, onCompletedSpy: completedSpies[3] })
    ]).then((responses) => {
      expect(responses).toEqual([1, 2, 3, 4])
      expect(wereCalledInOrder(completedSpies)).toBeTruthy()
    })
  })

  describe('when some responses fail', () => {
    let errorCaught

    beforeEach(() => {
      errorCaught = false
    })

    test('it rejects when the first promise fails', async () => {
      await performAllInSequence([
        getPromiseFunc({ value: 1, onCompletedSpy: completedSpies[0], fail: true }),
        getPromiseFunc({ value: 2, onCompletedSpy: completedSpies[1] }),
        getPromiseFunc({ value: 3, onCompletedSpy: completedSpies[2] }),
        getPromiseFunc({ value: 4, onCompletedSpy: completedSpies[3] })
      ]).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(completedSpies.map((spy) => spy.mock.calls.length)).toEqual([1, 0, 0, 0])
    })

    test('it rejects when the second promise fails', async () => {
      await performAllInSequence([
        getPromiseFunc({ value: 1, onCompletedSpy: completedSpies[0] }),
        getPromiseFunc({ value: 2, onCompletedSpy: completedSpies[1], fail: true }),
        getPromiseFunc({ value: 3, onCompletedSpy: completedSpies[2] }),
        getPromiseFunc({ value: 4, onCompletedSpy: completedSpies[3] })
      ]).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(completedSpies.map((spy) => spy.mock.calls.length)).toEqual([1, 1, 0, 0])
    })

    test('it rejects when the last promise fails', async () => {
      await performAllInSequence([
        getPromiseFunc({ value: 1, onCompletedSpy: completedSpies[0] }),
        getPromiseFunc({ value: 2, onCompletedSpy: completedSpies[1] }),
        getPromiseFunc({ value: 3, onCompletedSpy: completedSpies[2] }),
        getPromiseFunc({ value: 4, onCompletedSpy: completedSpies[3], fail: true })
      ]).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(completedSpies.map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1, 1])
    })

    test('it rejects when all of the promises fail', async () => {
      expect(errorCaught).toBeFalsy()
      await performAllInSequence([
        getPromiseFunc({ value: 1, onCompletedSpy: completedSpies[0], fail: true }),
        getPromiseFunc({ value: 2, onCompletedSpy: completedSpies[1], fail: true }),
        getPromiseFunc({ value: 3, onCompletedSpy: completedSpies[2], fail: true }),
        getPromiseFunc({ value: 4, onCompletedSpy: completedSpies[3], fail: true })
      ]).catch(() => {
        errorCaught = true
      })

      expect(errorCaught).toBeTruthy()
      expect(completedSpies.map((spy) => spy.mock.calls.length)).toEqual([1, 0, 0, 0])
    })
  })
})
