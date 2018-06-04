import _ from 'lodash'
import moment from 'moment'

import { mapApplication } from '../propMappers'
import { updateApplicationAction } from './actions'

// NOTE: what kind of saleforce domain object is this one? Fed
const mapStatusHistoryItem = (item) => {
  return {
    status: item.Processing_Status,
    note: item.Processing_Comment,
    date: item.Processing_Date_Updated,
    timestamp: moment(item.Processing_Date_Updated).unix()
  }
}

const mapStatusHistory = (statusHistory) => {
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
  console.log(application)
  return {
    formFields: mapFormFields(application),
    application: mapApplication(application),
    statusHistory: mapStatusHistory(statusHistory),
    onSubmit: (values) => updateApplicationAction(application, values)
  }
}

export default mapProperties
