import React from 'react'

const Context = React.createContext()

export default Context

/*
This is being using for consuming context.
You have to wrap your component with this function to have access to the context.
The context is pass to your component as a property named `store`
*/
export const withContext = (Component) => {
  const ContextComponent = (props) => {
    return (
      <Context.Consumer>
        {value => <Component {...props} store={value} />}
      </Context.Consumer>
    )
  }

  return ContextComponent
}
