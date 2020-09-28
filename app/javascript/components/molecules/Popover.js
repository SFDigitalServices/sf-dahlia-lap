import React, { useState, useRef } from 'react'
import { usePopper } from 'react-popper'

const Popover = ({ buttonElement, children, statusItems }) => {
  const [showPopper, setShowPopper] = useState(false)

  const buttonRef = useRef(null)
  const popperRef = useRef(null)
  // the ref for the arrow must be a callback ref
  const [arrowRef, setArrowRef] = useState(null)

  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
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
    }
  )

  return (
    <>
      {buttonElement({ ref: buttonRef, onClick: () => setShowPopper(!showPopper) })}
      { showPopper ? (
        <div
          className='popper-container'
          ref={popperRef}
          style={styles.popper}
          {...attributes.popper}
        >
          <div ref={setArrowRef} id="arrow" />
          {children}
        </div>
      ) : null }
    </>
  )
}

export default Popover
