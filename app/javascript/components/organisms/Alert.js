import React from 'react'

import AlertBox from '../molecules/AlertBox'
import AlertNotice from '../molecules/AlertNotice'

class Alert extends React.Component {
  state = { dismiss: false }

  onCloseClick = () => {
    this.setState({ dismiss: true })
  }

  render() {
    const { title, subTitle, message, invert } = this.props
    return (
      <div className='alert-box-and-notice'>
        <AlertBox message={title} invert={invert} closeType='text' noMargin={true} dismiss={this.state.dismiss} onCloseClick={this.onCloseClick} />
        <AlertNotice title={subTitle} content={message} invert={invert} dismiss={this.state.dismiss} />
      </div>
    )
  }
}

export default Alert
