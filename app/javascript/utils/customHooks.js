import { useEffect } from 'react'

/**
 * Perform the useEffect hook one time only on component mount.
 *
 * This method should be used instead of calling useEffect with an
 * empty dependency array like useEffect(..., []) to avoid a conflict
 * with the react-hooks/exhaustive-deps lint rule.
 *
 * @param {() => Any} f The effect function to perform once on component mount.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useEffectOnMount = (f) => useEffect(f, [])
