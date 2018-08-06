const SALESFORCE_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ"

const cleanField = (field) => {
  return field.replace(/__c/g, '').replace(/_/g, ' ')
}

export default {
  cleanField,
  SALESFORCE_DATE_FORMAT,
}
