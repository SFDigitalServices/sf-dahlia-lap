const SALESFORCE_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ"

const cleanField = (field) => {
  // try {
    // if (!field) return field
    return field.replace(/__c/g, '').replace(/_/g, ' ')
  // } catch(error) {
    // console.log(`${field} failed`)
    // throw error
  // }
}

export default {
  cleanField,
  SALESFORCE_DATE_FORMAT,
}
