import _ from 'lodash'
import moment from 'moment'

const mapListing = (listing) => {
  return {
    id: listing.Id,
    name: listing.Name
  }
}

const mapApplicationProperty = (application) => {
  return {
    id: application.Id,
    number: application.Name,
    name: application.Applicant.Name,
    listing: mapListing(application.Listing)
  }
}

const mapStatusHistoryItem = (item) => {
  return {
    status: item.Processing_Status,
    note: item.Processing_Comment,
    date: item.Processing_Date_Updated,
    timestamp: moment(item.Processing_Date_Updated).unix()
  }
}

const mapStatusHistoryProperty = (statusHistory) => {
  if (_.isEmpty(statusHistory))
    return []
  return statusHistory.map(mapStatusHistoryItem)
}

const mapFormFields = (application) => {
  return {
    dependents: application.Total_Household_Size,
    maritalStatus: application.Applicant.Marital_Status
  }
}

const mapProperties = ({application, statusHistory}) => {
  return {
    application: mapApplicationProperty(application),
    statusHistory: mapStatusHistoryProperty(statusHistory),
    formFields: mapFormFields(application)
  }
}

export default mapProperties
