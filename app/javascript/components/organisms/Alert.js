import React from 'react'

import AlertBox from '../molecules/AlertBox'
import AlertNotice from '../molecules/AlertNotice'

const Alert = ({ title, subtitle, message, show, invert, onCloseClick }) => (
  <div className='alert-box-and-notice'>
    <AlertBox message={title} invert={invert} closeType='text' noMargin show={show} onCloseClick={onCloseClick} />
    {subtitle && <AlertNotice title={subtitle} content={message} invert={invert} show={show} />}
  </div>
)

export default Alert
