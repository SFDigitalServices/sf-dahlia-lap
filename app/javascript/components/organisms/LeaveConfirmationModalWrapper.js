import React from 'react'

import Modal from './Modal'

class LeaveConfirmationModalWrapper extends React.Component {
  render () {
    const {
      isOpen,
      handleClose,
      onSecondaryClick
    } = this.props

    return (
      <Modal isOpen={isOpen} handleClose={handleClose}>
        <Modal.Body hidden={isOpen} handleClose={handleClose}>
          <Modal.Header title={'Are you sure you want to leave this page?'} />
          <Modal.Content>
            <p>You will lose your unsaved changes.</p>
          </Modal.Content>
          <Modal.Footer>
            <div className='modal-button_item modal-button_primary'>
              <button className='button'>Discard Changes</button>
            </div>
            <div className='modal-button_item modal-button_secondary'>
              <button className='button no-border' onClick={onSecondaryClick} type='button'>Keep Editing</button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    )
  }
}

export default LeaveConfirmationModalWrapper
