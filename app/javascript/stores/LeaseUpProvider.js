import React, { createContext, useReducer } from 'react'

import LeaseUpReducer from 'stores/LeaseUpReducer'

const initialState = { count: 0 }

export const LeaseUpContext = createContext()

const LeaseUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LeaseUpReducer, initialState)
  return <LeaseUpContext.Provider value={{ state, dispatch }}>{children}</LeaseUpContext.Provider>
}

export default LeaseUpProvider
