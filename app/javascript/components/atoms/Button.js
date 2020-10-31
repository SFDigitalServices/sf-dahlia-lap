import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { toPx } from '~/utils/cssUtils'

const buttonSizeStyles = (height, minWidth) => {
  const widthStyle = minWidth
    ? {
        minWidth: toPx(minWidth)
      }
    : {}

  const heightStyle = height
    ? {
        paddingTop: 0,
        paddingBottom: 0,
        height: toPx(height)
      }
    : {}

  return {
    ...heightStyle,
    ...widthStyle
  }
}

const buttonChildrenStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
}

const textStyles = (hasLeftIcon, hasRightIcon) => ({
  marginRight: hasRightIcon && '1rem',
  marginLeft: hasLeftIcon && '1rem',
  flexGrow: 1
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
  tiny = false,
  type = 'button',
  heightPx = null,
  minWidthPx = null,
  style = {},
  ...rest
}) => {
  const btnClassNames = classNames(classes, {
    'tight-padding': tightPadding,
    small: small,
    tertiary: tertiary,
    tiny: tiny,
    'margin-bottom-none': noBottomMargin
  })

  return (
    <button
      className={btnClassNames}
      type={type}
      style={{ ...buttonSizeStyles(heightPx, minWidthPx), ...style }}
      {...rest}
    >
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
  heightPx: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  minWidthPx: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  small: PropTypes.bool,
  style: PropTypes.object,
  tertiary: PropTypes.bool,
  text: PropTypes.node,
  tightPadding: PropTypes.bool,
  tiny: PropTypes.bool
}

export default Button
