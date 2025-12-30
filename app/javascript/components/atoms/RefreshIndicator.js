import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import { COLORS } from './colors'

/**
 * A subtle indicator for background data refetching.
 * Displays a small animated spinner with optional text.
 * Designed to be non-intrusive while informing users that data is being refreshed.
 */
const RefreshIndicator = ({
  text = 'Refreshing...',
  showText = true,
  position = 'inline',
  size = 'small',
  className
}) => {
  const containerStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.7,
    ...(position === 'top-right' && {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem'
    }),
    ...(position === 'top-left' && {
      position: 'absolute',
      top: '0.5rem',
      left: '0.5rem'
    })
  }

  const spinnerSize = size === 'small' ? '14px' : '18px'
  const fontSize = size === 'small' ? '0.75rem' : '0.875rem'

  const spinnerStyles = {
    width: spinnerSize,
    height: spinnerSize,
    border: `2px solid ${COLORS.smoke}`,
    borderTopColor: COLORS.primary,
    borderRadius: '50%',
    animation: 'refresh-spin 0.8s linear infinite'
  }

  const textStyles = {
    fontSize,
    color: COLORS.steel,
    fontWeight: 400
  }

  return (
    <>
      <style>
        {`
          @keyframes refresh-spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        className={classNames('refresh-indicator', className)}
        style={containerStyles}
        data-testid='refresh-indicator'
        aria-live='polite'
        aria-label={text}
      >
        <div style={spinnerStyles} data-testid='refresh-spinner' />
        {showText && <span style={textStyles}>{text}</span>}
      </div>
    </>
  )
}

RefreshIndicator.propTypes = {
  /** Text to display next to the spinner */
  text: PropTypes.string,
  /** Whether to show the text label */
  showText: PropTypes.bool,
  /** Position of the indicator */
  position: PropTypes.oneOf(['inline', 'top-right', 'top-left']),
  /** Size of the indicator */
  size: PropTypes.oneOf(['small', 'medium']),
  /** Additional CSS class names */
  className: PropTypes.string
}

export default RefreshIndicator
