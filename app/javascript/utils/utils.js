const cleanField = (field) => {
  return field.replace(/__c/g, '').replace(/_/g, ' ')
}

export default {
  cleanField
}
