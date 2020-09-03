/**
 * Given two functions that resolve to promises, resolve them sequentially and
 * return a promise that resolves to an array of the individual promise results.
 *
 * Note that this takes two _functions_ that resolve to promises, not the promises
 * themselves. That's because once a promise is created it's already firing asyncronously.
 * @param {() => Promise)} promiseFunc1
 * @param {() => Promise} promiseFunc2
 * @return a promise that resolves to an array with each promise result in order.
 */
export const performInSequence = (promiseFunc1, promiseFunc2) =>
  promiseFunc1()
    .then(result1 =>
      promiseFunc2().then(result2 => [result1, result2]))
