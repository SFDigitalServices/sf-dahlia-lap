import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import { usePopper } from 'react-popper'

// Source: https://www.30secondsofcode.org/react/s/use-click-outside
const useClickOutside = (buttonRef, popperRef, callback) => {
  const handleClick = (e) => {
    if (buttonRef && !buttonRef.contains(e.target) && popperRef && !popperRef.contains(e.target)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

const Popover = ({ buttonElement, children = null, onButtonClick = null }) => {
  const [showPopper, setShowPopper] = useState(false)
  const [buttonElementRef, setButtonElementRef] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  useClickOutside(buttonElementRef, popperElement, () => setShowPopper(false))

  const { styles, attributes } = usePopper(buttonElementRef, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement
        }
      },
      {
        name: 'offset',
        options: {
          offset: [0, 32]
        }
      }
    ]
  })

  return (
    <>
      {buttonElement({
        ref: setButtonElementRef,
        onClick: () => {
          setShowPopper(!showPopper)
          onButtonClick && onButtonClick()
        }
      })}
      {showPopper && (
        <div
          className='popper-container'
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div ref={setArrowElement} style={styles.arrow} id='arrow' />
          {children}
        </div>
      )}
    </>
  )
}

Popover.propTypes = {
  buttonElement: PropTypes.func.isRequired,
  children: PropTypes.node,
  onButtonClick: PropTypes.func
}

export default Popover
