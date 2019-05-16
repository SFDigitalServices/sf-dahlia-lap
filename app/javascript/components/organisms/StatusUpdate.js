import React from 'react'
import classNames from 'classnames'

import PrettyTime from '../atoms/PrettyTime'
import { getLeaseUpStatusClass } from '~/utils/statusUtils'
import StatusDropdown from '../molecules/StatusDropdown'

const StatusUpdate = ({ status, comment, date, onStatusDropdownChange, onAddCommentClick, statusHistoryAnchor, loading }) => {
  return (
    <div className={`status-update expand-wide ${getLeaseUpStatusClass(status)}`}>
      <h3 className='status-update_title'>Update Status</h3>
      <div className='status-update_action'>
        <StatusDropdown
          status={status}
          onChange={onStatusDropdownChange}
          styles={{position: 'relative'}}
          buttonClasses={['small']}
          disabled={loading}
        />
      </div>
      <div className='status-update_message'>
        <div className='status-update_comment'>
          <p className={classNames('status-update_note', {'c-steel': !comment})}>
            {comment || 'Update status or add a comment'}
          </p>
          {
            ((status || comment) && date) &&
            <span className='status-update_date'>
              <PrettyTime time={date} displayType='short' />
            </span>
          }
        </div>
        <div className='status-update_footer'>
          <button className='button tiny tertiary' type='button' onClick={onAddCommentClick} disabled={loading}>
            Add a comment
          </button>
          {
            (status || comment) &&
            <a href={statusHistoryAnchor} data-turbolinks='false' className='t-small right'>See Status History</a>
          }
        </div>
      </div>
    </div>
  )
}

export default StatusUpdate
