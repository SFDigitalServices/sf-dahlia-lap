import React from 'react'
import moment from 'moment'

const getFormat = (type) => {
  switch (type) {
    case 'short':
      return 'M/DD/YY'
    default:
      return 'D MMM YY'
  }
}

const PrettyTime = ({ time, formatType }) => {
  const format = getFormat(formatType)

  return <div>{moment(time).format(format)}</div>
}

export default PrettyTime
