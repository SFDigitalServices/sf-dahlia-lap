import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const InlineModal = ({ whiteBackground = false, children, marginBottom = false, id }) => {
  let classes = [
    'inline-modal',
    'padding-left--2x',
    'padding-right--2x',
    { 'white-background': whiteBackground },
    { 'margin-bottom--3halves': marginBottom }
  ]

  return (
    <div className={classNames(classes)} id={id}>
      {children}
    </div>
  )
}

InlineModal.propTypes = {
  whiteBackground: PropTypes.bool,
  marginBottom: PropTypes.bool,
  id: PropTypes.string
}

export default InlineModal
