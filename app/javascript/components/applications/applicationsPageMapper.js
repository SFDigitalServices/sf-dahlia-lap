// import { map } from 'lodash'
// import apiService from '~/apiService'
//
// const mapListing = (application) => {
//   return {
//     name: application['Listing.Name'],
//     lottery_date: application['Listing.Lottery_Date'],
//   }
// }
//
// const mapApplicant = (application) => {
//   return {
//     first_name: application['Applicant.First_Name'],
//     last_name: application['Applicant.Last_Name'],
//   }
// }
//
// const mapApplication = (application) => {
//   return {
//     id: application.Id,
//     number: application.Name,
//     applicant: mapApplicant(application),
//     total_house_hold_size: application.Total_Household_Size,
//     submitted_date: application.Application_Submitted_Date,
//     submission_type: application.Application_Submission_Type,
//     listing: mapListing(application),
//   }
// }
//
// const onFetchData = async (page, { filters} ) => {
//   const response = await apiService.fetchApplications({ page, filters })
//   return {
//     records: response.records.map(mapApplication),
//     pages: response.pages
//   }
// }
//
// const mapListingsOptions = (value) => {
//   return {
//     id: value.Id,
//     name: value.Name
//   }
// }
//
// const mapProperties = ({ listings }) => {
//   return {
//     onFetchData: onFetchData,
//     listings: map(listings, mapListingsOptions)
//   }
// }
//
// export default mapProperties
