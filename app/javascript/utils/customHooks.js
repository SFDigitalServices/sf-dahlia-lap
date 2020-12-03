import { useEffect, useState } from 'react'

import { isFunction } from 'lodash'
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

/**
 * React state hooks default to overriding the entire object state, this is not ideal since usually
 * you just want to update a subset of the attributes on the state if it's an object.
 *
 *
 * This hook does the same thing as the original useState hook, but it returns one additional helper so
 * you can set state without overriding the entire state.
 *
 * returns [state, setState, overrideEntireState] where:
 *   state is the current state
 *   setState is a function that either takes a function (prevState) => newStateOverrides or an object
 *     with the new state overrides. This function will only override the values provided in the new
 *     state object, it won't override the entire state object
 *   overrideEntireState is an optional function that behaves the same as the second response param of
 *     the original useState hook.
 *
 * @param {Object} initialStateObject the initial state to set the first time the component is mounted
 */
export const useStateObject = (initialStateObject) => {
  const [state, overrideEntireState] = useState(initialStateObject)

  const setState = (newStateOrCallback) => {
    overrideEntireState((prevState) => {
      const newStateOverrides = isFunction(newStateOrCallback)
        ? newStateOrCallback(prevState)
        : newStateOrCallback

      return {
        ...prevState,
        ...newStateOverrides
      }
    })
  }

  return [state, setState, overrideEntireState]
}
