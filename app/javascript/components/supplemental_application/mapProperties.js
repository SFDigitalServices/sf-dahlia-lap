import _ from 'lodash'
import moment from 'moment'

import { mapApplication } from '../propMappers'

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

const mapProperties = ({application, statusHistory}) => {
  return {
    application: mapApplication(application),
    statusHistory: mapStatusHistory(statusHistory)
  }
}

export default mapProperties
