/**
 * Given two functions that resolve to promises, resolve them sequentially and
 * return a promise that resolves to an array of the individual promise results in
 * order.
 *
 * Note that this takes two _functions_ that resolve to promises, not the promises
 * themselves. That's because once a promise is created it's already firing asyncronously.
 * @param {() => Promise} promiseFunc1
 * @param {() => Promise} promiseFunc2
 * @return a promise that resolves to an array with each promise result in order.
 */
export const performInSequence = (promiseFunc1, promiseFunc2) =>
  promiseFunc1()
    .then(result1 =>
      promiseFunc2().then(result2 => [result1, result2]))

/**
 * Given a list of functions that resolve to promises, resolve them sequentially and
 * return a promise that resolves to an array of the individual promise results in
 * order.
 *
 * Note that this takes an array of _functions_ that resolve to promises, not the promises
 * themselves. That's because once a promise is created it's already firing asyncronously.
 * @param {[() => Promise]} promiseFuncs
 */
export const performAllInSequence = (promiseFuncs) => {
  const reducer = (accumulatorPromise, promiseFunc) =>
    performInSequence(
      () => accumulatorPromise,
      promiseFunc
    ).then(([completedPromisesArr, currPromiseResult]) => [...completedPromisesArr, currPromiseResult])

  return promiseFuncs.reduce(reducer, Promise.resolve([]))
}

export const performOrDefault = async (condition, promiseFunc, defaultValue) => {
  return condition ? promiseFunc() : defaultValue
}
