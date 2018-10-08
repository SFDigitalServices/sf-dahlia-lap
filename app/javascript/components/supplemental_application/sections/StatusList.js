import React from 'react'
import classNames from 'classnames'
import { toLower, sortBy } from 'lodash'

import PrettyTime from '~/components/atoms/PrettyTime'

// Keeping note of possible status from salesforce
// [
//   "Processing",
//   "Withdrawn",
//   "Disqualified",
//   "Approved",
//   "Lease Signed",
//   "Appealed",
//   "Waitlisted"
// ]

const getStatusClassName = (status) => {
  if (!status) {
    return 'default'
  } else if (status === 'Lease Signed') {
    return 'leased'
  } else {
    return toLower(status)
  }
}

const StatusListItem = ({status, note, date}) => {
  const statusTagClassNames = classNames(
    'status-list_tag',
    `is-${getStatusClassName(status)}`
  )

  return (
    <li className='status-list_item'>
      <div className={statusTagClassNames}>{status}</div>
      <div className='status-list_comment'>
        <p className='status-list_note'>{note}</p>
        <span className='status-list_date'>
          <PrettyTime time={date} displayType='short' />
        </span>
      </div>
    </li>
  )
}

const sortByTimestamp = (item) => {
  if (!item.timestamp) { return -1 }

  return item.timestamp
}

const StatusList = ({items, onAddComment}) => {
  const orderedItems = sortBy(items, [sortByTimestamp])

  return (
    <div className='status-list'>
      <ul>
        { items && orderedItems.map(({status, note, date}, idx) => (
          <StatusListItem key={idx} status={status} note={note} date={date} />
        ))
        }
      </ul>
      <div className='status-list_footer'>
        <button className='button tertiary tiny margin-bottom-none' type='button' data-event='' onClick={onAddComment}>Add a comment</button>
      </div>
    </div>
  )
}

export default StatusList
