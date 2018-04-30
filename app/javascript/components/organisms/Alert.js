import React from 'react'

import AlertBox from '../molecules/AlertBox'
import AlertNotice from '../molecules/AlertNotice'

const Alert = ({ title, subTitle, message, invert }) => {
  return (
    <div className='alert-box-and-notice'>
      <AlertBox message={title} invert={invert} noMarging={true}/>
      <AlertNotice title={subTitle} content={message} invert={invert} />
    </div>
  )
}

export default Alert
