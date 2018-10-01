import React from 'react'

import StatusUpdate from '~/components/organisms/StatusUpdate'

const StatusUpdateWrapper = ({ status, comment, date }) => {
  const onStatusDropdownChange = () => {
    window.alert('Status update component status dropdown changed.')
  }

  const onAddCommentClick = () => {
    window.alert('Status update component add comment button clicked.')
  }

  return (
    <StatusUpdate
      status={status}
      comment={comment}
      date={date}
      onStatusDropdownChange={onStatusDropdownChange}
      onAddCommentClick={onAddCommentClick}
    />
  )
}

export default StatusUpdateWrapper
