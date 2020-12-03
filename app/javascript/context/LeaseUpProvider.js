import React, { createContext, useReducer } from 'react'

import { createActions } from 'context/leaseUpActionCreators'
import LeaseUpReducer, { getEmptyApplication, getEmptyListing } from 'context/LeaseUpReducer'

const initialState = {
  breadcrumbData: {
    listing: getEmptyListing(),
    application: getEmptyApplication()
  }
}

export const AppContext = createContext()

const LeaseUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LeaseUpReducer, initialState)
  const actions = createActions(dispatch)
  return <AppContext.Provider value={[state, actions]}>{children}</AppContext.Provider>
}

export default LeaseUpProvider
