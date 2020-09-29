import React from 'react'

import { SALESFORCE_DATE_FORMAT } from '~/utils/utils'
import PrettyTime from '~/components/atoms/PrettyTime'

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
