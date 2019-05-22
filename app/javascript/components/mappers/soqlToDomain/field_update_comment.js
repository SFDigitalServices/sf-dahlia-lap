import moment from 'moment'

export const mapFieldUpdateComment = (item) => ({
  status: item.Processing_Status,
  substatus: item.Sub_Status,
  comment: item.Processing_Comment,
  date: item.Processing_Date_Updated,
  timestamp: moment(item.Processing_Date_Updated).unix()
})
