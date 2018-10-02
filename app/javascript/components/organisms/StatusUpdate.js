import React from 'react'
import classNames from 'classnames'

import PrettyTime from '../atoms/PrettyTime'
import StatusDropdown from '../molecules/StatusDropdown'

const StatusUpdate = ({ status, comment, date, onStatusDropdownChange, onAddCommentClick }) => {
  return (
    <div className='status-update'>
      <h3 className='status-update_title'>Update Status</h3>
      <div className='status-update_action'>
        <StatusDropdown
          status={status}
          onChange={onStatusDropdownChange}
          styles={{position: 'relative'}}
          buttonClasses={['small']} />
      </div>
      <div className='status-update_message'>
        <div className='status-update_comment'>
          <p className={classNames('status-update_note', {'c-steel': !comment})}>
            {comment || 'Update status or add a comment'}
          </p>
          {date &&
            <span className='status-update_date'>
              <PrettyTime time={date} displayType='short' />
            </span>
          }
        </div>
        <div className='status-update_footer'>
          <button className='button tiny tertiary' type='button' onClick={onAddCommentClick}>
            Add a comment
          </button>
          <a href='#' className='t-small right'>See Status History</a>
        </div>
      </div>
    </div>
  )
}

export default StatusUpdate
