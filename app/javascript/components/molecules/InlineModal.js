import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const InlineModal = ({ whiteBackground = false, children }) => {
  let classes = [
    'inline-modal',
    'padding-left--2x',
    'padding-right--2x',
    { 'white-background': whiteBackground }
  ]

  return (
    <div className={classNames(classes)}>
      {children}
    </div>
  )
}

InlineModal.propTypes = {
  whiteBackground: PropTypes.bool
}

export default InlineModal
