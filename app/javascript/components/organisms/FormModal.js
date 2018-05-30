import React from 'react'
import classNames from 'classnames'
import { Form } from 'react-form'

import Modal from './Modal'
import FormModalLoading from '../molecules/FormModalLoading'

const FormModalBody = ({
  type,
  header,
  isOpen,
  primary,
  secondary,
  showAlert,
  alertMsg,
  onAlertCloseClick,
  handleClose,
  onSubmit,
  onSecondaryClick,
  children,
  validateError,
  loading,
}) => {
  const primaryButtonClassName = classNames({
    button: true,
    primary: (!type || type === 'status'),
    'alert-fill': (type === 'alert')
  })

  return (
    <Modal.Body hidden={isOpen} handleClose={handleClose}>
      <Modal.Header title={header} />
      {
        showAlert && alertMsg &&
        <Modal.Alert
          invert={true}
          show={showAlert}
          title={alertMsg}
          onCloseClick={onAlertCloseClick} />
      }

      <div className="form-modal_form_wrapper">
        <Form onSubmit={onSubmit} validateError={validateError}>
          {formApi => (
            <form onSubmit={formApi.submitForm} className="no-margin">
              <Modal.Content>
                {children(formApi)}
              </Modal.Content>
              <Modal.Footer>
                <div className="modal-button_item modal-button_primary">
                  <button className={primaryButtonClassName} type="submit">{primary}</button>
                </div>
                <div className="modal-button_item modal-button_secondary">
                  <button className="button no-border" onClick={onSecondaryClick} type="button">{secondary}</button>
                </div>
              </Modal.Footer>
            </form>
          )}
        </Form>
        {loading && <FormModalLoading />}
      </div>
    </Modal.Body>
  )
}

const FormModal = ({ children, isOpen, handleClose, ...FormModalBodyProps}) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <FormModalBody handleClose={handleClose} {...FormModalBodyProps}>
        { children }
      </FormModalBody>
    </Modal>
  )
}

export default FormModal
