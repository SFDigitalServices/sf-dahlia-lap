import React, { createContext, useReducer } from 'react'

import { createActions } from 'context/actionCreators/actionCreators'
import Reducer, { getInitialState } from 'context/Reducer'

export const AppContext = createContext()

const initialState = getInitialState()

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  const actions = createActions(dispatch)
  return <AppContext.Provider value={[state, actions]}>{children}</AppContext.Provider>
}

export default Provider
