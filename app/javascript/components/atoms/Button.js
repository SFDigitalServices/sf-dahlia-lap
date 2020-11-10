import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import { toPx } from 'utils/cssUtils'

const buttonSizeStyles = (clearVerticalPadding, minWidth) => {
  const widthStyle = minWidth
    ? {
        minWidth: toPx(minWidth)
      }
    : {}

  const heightStyle = clearVerticalPadding
    ? {
        paddingTop: 0,
        paddingBottom: 0
      }
    : {}

  return {
    ...heightStyle,
    ...widthStyle
  }
}

const buttonChildrenStyles = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
})

const textStyles = (hasLeftIcon, hasRightIcon) => ({
  marginTop: '1rem',
  marginBottom: '1rem',
  marginRight: hasRightIcon && '1rem',
  marginLeft: hasLeftIcon && '1rem',
  flexGrow: 1
})

const iconWrapperStyles = () => ({
  flexShrink: 0,

  // we need to override font-size because of a css button selector that sets
  // the font size for all children. This is a problem because it adds 3px
  // to any icon wrapper.
  fontSize: 0
})

const wrapWithStyle = (node, style) => node && <span style={style}>{node}</span>

const Button = ({
  classes = null,
  iconLeft = null,
  iconRight = null,
  noBottomMargin,
  paddingHorizontal = 'normal',
  small = false,
  tertiary = false,
  text = null,
  tiny = false,
  type = 'button',
  minWidthPx = null,
  style = {},
  ...rest
}) => {
  const btnClassNames = classNames(classes, {
    'tight-padding': paddingHorizontal === 'tight',
    'extra-padding': paddingHorizontal === 'extra',
    small: small,
    tertiary: tertiary,
    tiny: tiny,
    'margin-bottom-none': noBottomMargin
  })

  const hasText = !!text

  return (
    <button
      className={btnClassNames}
      type={type}
      style={{ ...buttonSizeStyles(hasText, minWidthPx), ...style }}
      {...rest}
    >
      <div style={buttonChildrenStyles()}>
        {wrapWithStyle(iconLeft, iconWrapperStyles())}
        {wrapWithStyle(text, textStyles(!!iconLeft, !!iconRight))}
        {wrapWithStyle(iconRight, iconWrapperStyles())}
      </div>
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  noBottomMargin: PropTypes.bool,
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  minWidthPx: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingHorizontal: PropTypes.oneOf(['normal', 'tight', 'extra']),
  small: PropTypes.bool,
  style: PropTypes.object,
  tertiary: PropTypes.bool,
  text: PropTypes.node,
  tiny: PropTypes.bool
}

export default Button
