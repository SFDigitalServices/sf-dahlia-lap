import React, { createContext, useReducer } from 'react'

import LeaseUpReducer from 'stores/LeaseUpReducer'

const initialState = {
  breadcrumbData: {
    listing: {
      id: null,
      name: null,
      buildingAddress: null
    },
    application: {
      id: null,
      number: null,
      applicantFirstName: null,
      applicantLastName: null
    }
  }
}

export const LeaseUpStateContext = createContext()
export const LeaseUpDispatchContext = createContext()

const LeaseUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LeaseUpReducer, initialState)
  return (
    <LeaseUpStateContext.Provider value={state}>
      <LeaseUpDispatchContext.Provider value={dispatch}>{children}</LeaseUpDispatchContext.Provider>
    </LeaseUpStateContext.Provider>
  )
}

export default LeaseUpProvider
