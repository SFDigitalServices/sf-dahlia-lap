import React from 'react'
import classNames from 'classnames'
import { toLower, sortBy, isEmpty } from 'lodash'

import PrettyTime from '~/components/atoms/PrettyTime'

const getStatusClassName = (status) => {
  if (!status) {
    return 'default'
  } else if (status === 'Lease Signed') {
    return 'leased'
  } else {
    return toLower(status)
  }
}

const StatusListItem = ({status, substatus, comment, date}) => {
  const statusTagClassNames = classNames(
    'status-list_tag',
    `is-${getStatusClassName(status)}`
  )

  return (
    <li className='status-list_item'>
      <div className={statusTagClassNames}>{status}</div>
      <div className='status-list_comment'>
        {
          substatus ? (
            <React.Fragment>
              <p className='status-list_note t-base p-base c-steel'>{substatus}</p>
              <span className='status-list_date'>
                <PrettyTime time={date} displayType='short' />
              </span>
              <br />
              <p className='status-list_note'>{comment}</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className='status-list_note'>{comment}</p>
              <span className='status-list_date'>
                <PrettyTime time={date} displayType='short' />
              </span>
            </React.Fragment>
          )
        }
      </div>
    </li>
  )
}

const sortByTimestamp = (item) => {
  if (!item.timestamp) { return -1 }

  return item.timestamp
}

const StatusList = ({items, onAddComment, commentDisabled}) => {
  const orderedItems = sortBy(items, [sortByTimestamp])

  return (
    <div className='status-list'>
      <ul>
        { !isEmpty(items) && orderedItems.map(({status, substatus, comment, date}, idx) => (
          <StatusListItem key={idx} status={status} substatus={substatus} comment={comment} date={date} />
        ))
        }
      </ul>
      <div className='status-list_footer'>
        <button className='button tertiary tiny margin-bottom-none' type='button' data-event='' onClick={onAddComment} disabled={commentDisabled}>Add a comment</button>
      </div>
    </div>
  )
}

export default StatusList
