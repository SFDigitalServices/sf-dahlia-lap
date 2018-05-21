import React from 'react'
import classNames from 'classnames'

import PrettyTime from '../utils/PrettyTime'

const mapStatusName = (type) => {
	switch(type) {
		case 'default':
			return 'No Status'
		case 'processing':
			return 'Processing'
		case 'approved':
			return 'Approved'
		default:
			return 'No Status'
	}
}

const StatusListItem = ({type, note, date}) => {
	const statusTagClassNames = classNames({
		'status-list_tag': true,
		'is-default': (type === 'default'),
		'is-processing': (type === 'processing'),
		'is-approved': (type === 'approved')
	})

	const statusName = mapStatusName(type)

	return (
		<li className="status-list_item">
			<div className={statusTagClassNames}>{statusName}</div>
			<div className="status-list_comment">
				<p className="status-list_note">{note}</p>
				<span className="status-list_date">
					<PrettyTime time={date} />
				</span>
			</div>
		</li>
	)
}

const StatusList = ({items, onAdd}) => {
	return (
		<div className="status-list">
			<ul>
				{ items && items.map(({type, note, date}, idx) => (
						<StatusListItem key={idx} type={type} note={note} date={date} />
					))
				}
			</ul>
			<div className="status-list_footer">
				<button className="button tertiary tiny margin-bottom-none" type="button" data-event="" onClick={onAdd}>Add a comment</button>
			</div>
		</div>
	)
}

export default StatusList
