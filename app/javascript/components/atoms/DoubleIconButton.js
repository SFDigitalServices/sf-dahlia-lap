import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Button from './Button'
import Icon from './Icon'

/**
 * button that has text and buttons on either side of it.
 */
const DoubleIconButton = ({
  type = 'button',
  text = null,
  tertiary,
  noBottomMargin,
  classes,
  leftIcon = '',
  rightIcon = '',
  ...rest
}) => {
  const btnClassNames = classNames(classes, 'has-icon--both-sides')
  return (
    <Button
      classes={btnClassNames}
      type={type}
      tertiary={tertiary}
      noBottomMargin={noBottomMargin}
      {...rest}
    >
      <div style={{ display: 'flex' }}>
        <Icon icon={leftIcon} uiIconClassName='ui-icon--left' />
        {text}
        <Icon icon={rightIcon} uiIconClassName='ui-icon--right' />
      </div>
    </Button>
  )
}

DoubleIconButton.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  noBottomMargin: PropTypes.bool
}

DoubleIconButton.defaultProps = {
  type: 'button',
  noBottomMargin: false
}

export default DoubleIconButton
