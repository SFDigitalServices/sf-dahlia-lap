// import _ from 'lodash'
// // import moment from 'moment'
//
// // NOTE: what kind of saleforce domain object is this one? Fed
// export const mapStatusHistoryItem = (item) => {
//   return {
//     status: item.Processing_Status,
//     note: item.Processing_Comment,
//     date: item.Processing_Date_Updated,
//     timestamp: moment(item.Processing_Date_Updated).unix()
//   }
// }
//
export const mapFormFields = (application) => {
  return {
    dependents: application.Number_of_Dependents,
    maritalStatus: application.Applicant.Marital_Status
  }
}
