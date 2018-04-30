import React from 'react'
import Icon from '../atoms/Icon'
import ReactModal from 'react-modal';
import _ from 'lodash'

import Modal from './Modal'
import AlertBox from '../molecules/AlertBox'
import AlertNotice from '../molecules/AlertNotice'

const primaryButtonClass = (type) => {
  if (type == 'status')
    return 'primary'
  else if (type == 'alert')
    return 'alert-fill'
  else
    return 'primary'
}

const SimpleModalBody = ({
  type,
  header,
  isOpen,
  content,
  primary,
  secondary,
  onCloseClick,
  onPrimaryClick,
  onSecondaryClick,
  children,
  alertBox,
  alertNotice
}) => {
  const primaryButtonClassNames = `button ${primaryButtonClass(type)}`

  return (
    <Modal.Body onCloseClick={onCloseClick} hidden={isOpen}>
      <Modal.Header title={header} />
      { alertBox && <AlertBox message={alertBox} /> }
      { alertNotice && <AlertNotice {...alertNotice} /> }
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <div className="modal-button_item">
          <button className={primaryButtonClassNames} onClick={onPrimaryClick}>{primary}</button>
        </div>
        <div className="modal-button_item">
          <button className="button no-border" onClick={onSecondaryClick}>{secondary}</button>
        </div>
      </Modal.Footer>
    </Modal.Body>
  )
}

const SimpleModal = ({
  header,
  content,
  primary,
  secondary,
  isOpen,
  onCloseClick,
  onPrimaryClick,
  onSecondaryClick,
  type,
  children,
  alertBox,
  alertNotice
}) => {
  return (
    <Modal isOpen={isOpen} >
      <SimpleModalBody  {...{
          type,
          header,
          alertBox,
          alertNotice,
          isOpen,
          content,
          primary,
          secondary,
          onCloseClick,
          onPrimaryClick,
          onSecondaryClick }}>
        { children }
      </SimpleModalBody>
    </Modal>
  )
}

export default SimpleModal
