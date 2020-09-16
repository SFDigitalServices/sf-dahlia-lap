import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Modal from './Modal'

const ConfirmationModal = ({
  isOpen = false,
  onCloseClick = () => {},
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  primaryText,
  primaryButtonDestination = null,
  primaryButtonIsAlert = false,
  secondaryText,
  subtitle,
  title,
  titleId = 'confirmation-modal-header'
}) => {
  const buttonClasses = classNames(
    'button',
    primaryButtonIsAlert ? 'alert' : 'primary'
  )

  return (
    <Modal isOpen={isOpen} handleClose={onCloseClick}>
      <Modal.Body hidden={isOpen} handleClose={onCloseClick}>
        <Modal.Header id={titleId} title={title} />
        <Modal.Content>
          <p>{subtitle}</p>
        </Modal.Content>
        <Modal.Footer>
          <div className='modal-button_item modal-button_secondary'>
            <a
              className={buttonClasses}
              href={primaryButtonDestination || '#'}
              type='button'
              onClick={onPrimaryClick}
            >
              {primaryText}
            </a>
          </div>
          <div className='modal-button_item modal-button_secondary'>
            <button className='button no-border' onClick={onSecondaryClick} type='button'>
              {secondaryText}
            </button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  onCloseClick: PropTypes.func,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  primaryButtonDestination: PropTypes.string,
  primaryButtonIsAlert: PropTypes.bool,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  titleId: PropTypes.string
}

export default ConfirmationModal
