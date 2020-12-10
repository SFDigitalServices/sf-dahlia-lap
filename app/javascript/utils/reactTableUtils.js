import React from 'react'

import PrettyTime from 'components/atoms/PrettyTime'
import { SALESFORCE_DATE_FORMAT } from 'utils/utils'

const date = (cell) => {
  if (cell.value) {
    return <PrettyTime time={cell.value} parseFormat={SALESFORCE_DATE_FORMAT} />
  } else {
    return <i>none</i>
  }
}

export const cellFormat = {
  date
}

export const filterMethod = (filter, row) => {
  return (
    // do case insensitive RegExp match instead of the default "startsWith"
    row[filter.id].match(new RegExp(filter.value, 'ig'))
  )
}
