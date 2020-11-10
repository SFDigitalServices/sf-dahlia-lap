import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

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

/**
 * Get the url param if it exists. This is only usable in a react routed component,
 * because it uses the useLocation() hook.
 *
 * @param {String} paramName
 */
export const useQueryParam = (paramName) => new URLSearchParams(useLocation().search).get(paramName)

/**
 * Get a boolean query parameter from the url, if it's not specified, return defaultValue.
 */
export const useQueryParamBoolean = (paramName, defaultValue = false) => {
  const param = useQueryParam(paramName)
  if (param == null) {
    return defaultValue
  }

  return param === 'true'
}
