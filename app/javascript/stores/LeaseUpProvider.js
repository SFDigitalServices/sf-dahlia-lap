import React, { createContext, useReducer } from 'react'

import LeaseUpReducer, {
  EMPTY_APPLICATION_BREADCRUMB,
  EMPTY_LISTING_BREADCRUMB
} from 'stores/LeaseUpReducer'

const initialState = {
  breadcrumbData: {
    listing: EMPTY_LISTING_BREADCRUMB,
    application: EMPTY_APPLICATION_BREADCRUMB
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
