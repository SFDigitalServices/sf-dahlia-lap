import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const buttonChildrenStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

const textStyles = (hasLeftIcon, hasRightIcon) => ({
  marginRight: hasRightIcon && '1rem',
  marginLeft: hasLeftIcon && '1rem'
})

const Button = ({
  classes = null,
  iconLeft = null,
  iconRight = null,
  noBottomMargin,
  small = false,
  tertiary = false,
  text = null,
  tightPadding,
  tightPaddingVertical,
  tiny = false,
  type = 'button',
  ...rest
}) => {
  const btnClassNames = classNames(classes, {
    'tight-padding': tightPadding,
    'tight-padding-vertical': tightPaddingVertical,
    small: small,
    tertiary: tertiary,
    tiny: tiny,
    'margin-bottom-none': noBottomMargin
  })

  return (
    <button className={btnClassNames} type={type} {...rest}>
      <div style={buttonChildrenStyles}>
        {iconLeft}
        {text && <span style={textStyles(!!iconLeft, !!iconRight)}>{text}</span>}
        {iconRight}
      </div>
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  noBottomMargin: PropTypes.bool,
  classes: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  small: PropTypes.bool,
  tertiary: PropTypes.bool,
  text: PropTypes.node,
  tightPadding: PropTypes.bool,
  tightPaddingVertical: PropTypes.bool,
  tiny: PropTypes.bool
}

export default Button
