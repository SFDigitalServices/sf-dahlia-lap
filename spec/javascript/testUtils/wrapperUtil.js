export const findByNameAndProps = (wrapper, name, props) => {
  const predicate = n => n.name() === name && Object.keys(props).every(k => n.prop(k) === props[k])

  return wrapper.findWhere(predicate)
}
