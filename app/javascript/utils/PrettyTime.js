import React from 'react'
import moment from 'moment'

const PrettyTime = ({ time }) => ( <div>{moment(time).format("D MMM YY")}</div> )

export default PrettyTime
