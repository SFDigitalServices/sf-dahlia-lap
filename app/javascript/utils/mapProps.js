import React from 'react'

const mapProps = (propsMapper) => (BaseComponent) => {
  return (props) => <BaseComponent {...propsMapper(props)} />
}

export default mapProps
