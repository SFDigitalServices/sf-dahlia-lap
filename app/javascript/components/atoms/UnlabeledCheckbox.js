import React, { useEffect, useRef } from 'react'

import { PropTypes } from 'prop-types'

const UnlabeledCheckbox = ({ id, checked = false, indeterminate = false, onClick = () => {} }) => {
  const checkRef = useRef()
  useEffect(() => {
    checkRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <>
      <input
        id={id}
        ref={checkRef}
        type='checkbox'
        checked={indeterminate || checked}
        onClick={onClick}
        onChange={() => {}}
        className={'no-margin'}
      />
      <label style={{ margin: '0px' }} className='form-label' htmlFor={id} />
    </>
  )
}

UnlabeledCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onClick: PropTypes.func
}
export default UnlabeledCheckbox
