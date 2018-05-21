import React from 'react'
import moment from 'moment'


const getFormat = (type) => {
  switch (type) {
    case 'short':
      return 'D/MM/YY'
    default:
      return 'D MMM YY'
  }
}

const PrettyTime = ({ time, formatType }) => {
  const format = getFormat(formatType)

  return <div>{moment(time).format(format)}</div>
}

export default PrettyTime
