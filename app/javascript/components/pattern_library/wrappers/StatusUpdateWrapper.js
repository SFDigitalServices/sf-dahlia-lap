import React from 'react'

import StatusUpdate from '~/components/organisms/StatusUpdate'

const StatusUpdateWrapper = ({ status, comment, date, statusHistoryAnchor }) => {
  const onStatusDropdownChange = () => {
    window.alert('Status update component status dropdown changed.')
  }

  const onAddCommentClick = () => {
    window.alert('Status update component add comment button clicked.')
  }

  return (
    <React.Fragment>
      <div>
        <h3>Example with status, comment, and date</h3>
        <StatusUpdate
          status={status}
          comment={comment}
          date={date}
          onStatusDropdownChange={onStatusDropdownChange}
          onAddCommentClick={onAddCommentClick}
          statusHistoryAnchor={statusHistoryAnchor}
        />
      </div>
      <br />
      <div>
        <h3>Example without status, comment, and date</h3>
        <StatusUpdate
          status={null}
          comment={null}
          date={null}
          onStatusDropdownChange={onStatusDropdownChange}
          onAddCommentClick={onAddCommentClick}
          statusHistoryAnchor={statusHistoryAnchor}
        />
      </div>
    </React.Fragment>
  )
}

export default StatusUpdateWrapper
