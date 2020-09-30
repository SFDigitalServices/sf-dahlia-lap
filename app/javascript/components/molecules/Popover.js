import React, { useEffect, useState, useRef } from 'react'
import { usePopper } from 'react-popper'

// Source: https://www.30secondsofcode.org/react/s/use-click-outside
const useClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
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

const Popover = ({ buttonElement, children }) => {
  const [showPopper, setShowPopper] = useState(false)

  const buttonRef = useRef(null)
  const popperRef = useRef(null)

  useClickOutside(popperRef, () => setShowPopper(false))
  // the ref for the arrow must be a callback ref
  const [arrowRef, setArrowRef] = useState(null)

  const { styles, attributes } = usePopper(buttonRef.current, popperRef.current, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef
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
      {buttonElement({ ref: buttonRef, onClick: () => setShowPopper(!showPopper) })}
      {showPopper && (
        <div
          className='popper-container'
          ref={popperRef}
          style={styles.popper}
          {...attributes.popper}
        >
          <div ref={setArrowRef} id='arrow' />
          {children}
        </div>
      )}
    </>
  )
}

export default Popover
