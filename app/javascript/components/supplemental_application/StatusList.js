import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import PrettyTime from '../utils/PrettyTime'

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
	} else {
		return _.lowerCase(status)
	}
}

const StatusListItem = ({status, note, date}) => {
	const statusTagClassNames = classNames(
		'status-list_tag',
		`is-${getStatusClassName(status)}`
	)

	return (
		<li className="status-list_item">
			<div className={statusTagClassNames}>{status}</div>
			<div className="status-list_comment">
				<p className="status-list_note">{note}</p>
				<span className="status-list_date">
					<PrettyTime time={date} formatType='short' />
				</span>
			</div>
		</li>
	)
}

const StatusList = ({items, onAddCommnent}) => {
	// console.log(items)
	const orderedItems =  _.orderBy(items, ['timestamp'], ['desc'])

	return (
		<div className="status-list">
			<ul>
				{ items && orderedItems.map(({status, note, date}, idx) => (
						<StatusListItem key={idx} status={status} note={note} date={date} />
					))
				}
			</ul>
			<div className="status-list_footer">
				<button className="button tertiary tiny margin-bottom-none" type="button" data-event="" onClick={onAddCommnent}>Add a comment</button>
			</div>
		</div>
	)
}

export default StatusList
