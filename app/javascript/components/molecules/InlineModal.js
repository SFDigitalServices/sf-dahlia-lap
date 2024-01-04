import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

const InlineModal = ({
  whiteBackground = false,
  children,
  marginBottom = false,
  id,
  dataTestId
}) => {
  const classes = [
    'inline-modal',
    'padding-left--2x',
    'padding-right--2x',
    { 'white-background': whiteBackground },
    { 'margin-bottom--3halves': marginBottom }
  ]

  return (
    <div className={classNames(classes)} id={id} data-testid={dataTestId}>
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
