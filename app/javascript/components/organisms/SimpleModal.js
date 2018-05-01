import React from 'react'
import Icon from '../atoms/Icon'
import ReactModal from 'react-modal';
import _ from 'lodash'
import classNames from 'classnames'

import Modal from './Modal'

const SimpleModalBody = ({
  type,
  header,
  isOpen,
  primary,
  secondary,
  alert,
  invert,
  onCloseClick,
  onPrimaryClick,
  onSecondaryClick,
  children
}) => {
  const primaryButtonClassName = classNames({
    button: true,
    primary: (!type || type=='status'),
    'alert-fill': (type == 'alert')
  })

  return (
    <Modal.Body onCloseClick={onCloseClick} hidden={isOpen}>
      <Modal.Header title={header} />
      { alert && <Modal.Alert {...alert} /> }
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <div className="modal-button_item modal-button_primary">
          <button className={primaryButtonClassName} onClick={onPrimaryClick}>{primary}</button>
        </div>
        <div className="modal-button_item modal-button_secondary">
          <button className="button no-border" onClick={onSecondaryClick}>{secondary}</button>
        </div>
      </Modal.Footer>
    </Modal.Body>
  )
}

const SimpleModal = ({ children, isOpen, ...SimpleModalBodyProps}) => {
  return (
    <Modal isOpen={isOpen} >
      <SimpleModalBody  {...SimpleModalBodyProps}>
        { children }
      </SimpleModalBody>
    </Modal>
  )
}

export default SimpleModal
