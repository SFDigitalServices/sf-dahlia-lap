import React from 'react'

const mapProps = (propsMapper) => (BaseComponent) => {
  const MapProps = (props) => <BaseComponent {...propsMapper(props)} />
  return MapProps
}

export default mapProps
