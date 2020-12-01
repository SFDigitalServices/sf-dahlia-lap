const LeaseUpReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export default LeaseUpReducer
