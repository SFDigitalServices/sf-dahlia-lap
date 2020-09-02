import React from 'react'
import classNames from 'classnames'

const InlineModal = ({ whiteBackground = false, children }) => {
  let classes = [
    'inline-modal',
    'padding-left--2x',
    'padding-right--2x'
  ]
  if (whiteBackground) {
    classes.push('white-background')
  }
  return (
    <div className={classNames(classes)}>
      {children}
    </div>
  )
}

export default InlineModal
