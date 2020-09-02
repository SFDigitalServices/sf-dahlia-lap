import React from 'react'
import classNames from 'classnames'

const InlineModal = ({ level, children }) => {
  let classes = [
    'inline-modal',
    'padding-left--2x',
    'padding-right--2x'
  ]
  if (level === '2') {
    classes.push('level-two')
  }
  return (
    <div className={classNames(classes)}>
      {children}
    </div>
  )
}

export default InlineModal
