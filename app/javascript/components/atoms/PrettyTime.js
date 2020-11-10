import React from 'react'

import moment from 'moment'

const getDisplayFormat = (type) => {
  switch (type) {
    case 'short':
      return 'M/DD/YY'
    default:
      return 'MM/DD/YYYY'
  }
}

const PrettyTime = ({ time, parseFormat = '', displayType }) => {
  const displayFormat = getDisplayFormat(displayType)
  return <div>{moment(time, parseFormat).format(displayFormat)}</div>
}

export default PrettyTime
