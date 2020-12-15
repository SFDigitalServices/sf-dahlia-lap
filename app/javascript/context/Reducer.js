import ApplicationDetailsSubreducer from 'context/subreducers/ApplicationDetailsSubreducer'
import ApplicationsListSubreducer from 'context/subreducers/ApplicationsListSubreducer'
import BreadcrumbSubreducer from 'context/subreducers/BreadcrumbSubreducer'

// If a new sub-reducer is added, you should just need to add it to this object
// and it will be integrated into the root reducer automatically.
const DATA_KEYS_TO_SUB_REDUCERS = {
  breadcrumbData: BreadcrumbSubreducer,
  applicationsListData: ApplicationsListSubreducer,
  applicationDetailsData: ApplicationDetailsSubreducer
}

const mapEachSubReducer = (mapFn) => {
  return Object.fromEntries(
    Object.entries(DATA_KEYS_TO_SUB_REDUCERS).map(([key, subReducer]) => [
      key,
      mapFn(subReducer, key)
    ])
  )
}

export const getInitialState = () => mapEachSubReducer((r) => r.getInitialState())
export const anyReducerHandlesAction = (actionType) =>
  Object.values(DATA_KEYS_TO_SUB_REDUCERS).some((r) => r.handlesActionType(actionType))

const Reducer = (state, action) => {
  if (!anyReducerHandlesAction(action.type)) {
    throw new Error(`Root reducer: Unhandled action type: ${action.type}`)
  }

  const getNewSubState = (oldSubState, subreducer) => {
    if (subreducer.handlesActionType(action.type)) {
      return subreducer.reducer(oldSubState, action)
    } else {
      return { ...oldSubState }
    }
  }

  // Loop over of substates and apply state transitions by each reducer that
  // subscribes to this action.
  return mapEachSubReducer((r, key) => getNewSubState(state[key], r))
}

export default Reducer
