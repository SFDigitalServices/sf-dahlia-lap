import React, { createContext, useReducer } from 'react'

import Reducer, { getInitialState } from 'context/Reducer'

export const AppContext = createContext()

const initialState = getInitialState()

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export default Provider
