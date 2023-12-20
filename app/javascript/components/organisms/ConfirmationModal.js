import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Modal from './Modal'

const ConfirmationModal = ({
  isOpen = false,
  onCloseClick = () => {},
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  primaryText,
  primaryButtonDestination = null,
  routedPrimaryButtonDestination = false,
  primaryButtonIsAlert = false,
  secondaryText,
  subtitle,
  title,
  titleId = 'confirmation-modal-header'
}) => {
  const buttonClasses = classNames('button', primaryButtonIsAlert ? 'alert' : 'primary')

  const getPrimaryButton = () => {
    if (primaryButtonDestination) {
      if (routedPrimaryButtonDestination) {
        return (
          <Link
            to={primaryButtonDestination}
            className={buttonClasses}
            type='button'
            onClick={onPrimaryClick}
          >
            {primaryText}
          </Link>
        )
      } else {
        return (
          <a
            className={buttonClasses}
            href={primaryButtonDestination}
            type='button'
            onClick={onPrimaryClick}
          >
            {primaryText}
          </a>
        )
      }
    } else {
      return (
        <button className={buttonClasses} type='button' onClick={onPrimaryClick}>
          {primaryText}
        </button>
      )
    }
  }

  return (
    <Modal isOpen={isOpen} handleClose={onCloseClick} data-testid='modal'>
      <Modal.Body hidden={isOpen} handleClose={onCloseClick}>
        <Modal.Header id={titleId} title={title} />
        <Modal.Content>
          <p>{subtitle}</p>
        </Modal.Content>
        <Modal.Footer>
          <div className='modal-button_item modal-button_secondary'>{getPrimaryButton()}</div>
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
  routedPrimaryButtonDestination: PropTypes.bool,
  primaryButtonIsAlert: PropTypes.bool,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  titleId: PropTypes.string
}

export default ConfirmationModal
