import { createFactory } from 'react'

const mapProps = (propsMapper) => (BaseComponent) => {
  const factory = createFactory(BaseComponent)
  const MapProps = (props) => factory(propsMapper(props))
  return MapProps
}

export default mapProps
