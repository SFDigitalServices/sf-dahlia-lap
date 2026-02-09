import React from 'react'

import classNames from 'classnames'
import { Form } from 'react-final-form'

import Modal from './Modal'
import Loading from '../molecules/Loading'

const FormModalBody = ({
  alertMsg,
  children,
  handleClose,
  initialValues,
  isOpen,
  loading,
  onAlertCloseClick,
  onSecondaryClick,
  onSubmit,
  primary,
  secondary,
  showAlert,
  subtitle,
  title,
  type,
  validateError
}) => {
  const primaryButtonClassName = classNames({
    button: true,
    primary: !type || type === 'status',
    'alert-fill': type === 'alert'
  })

  return (
    <Modal.Body hidden={isOpen} handleClose={handleClose}>
      <Modal.Header title={title} />
      {showAlert && alertMsg && (
        <Modal.Alert invert show={showAlert} title={alertMsg} onCloseClick={onAlertCloseClick} />
      )}
      {subtitle && <Modal.Content>{subtitle}</Modal.Content>}
      <div className='form-modal_form_wrapper' data-loading={loading}>
        <Loading isLoading={loading}>
          <Form
            onSubmit={onSubmit}
            validate={validateError}
            {...(initialValues ? { initialValues } : {})}
            render={({ handleSubmit, values, form: { change }, form }) => (
              <form onSubmit={handleSubmit} className='no-margin' noValidate>
                <Modal.Content>{children(values, change, form)}</Modal.Content>
                <Modal.Footer>
                  <div className='modal-button_item modal-button_primary'>
                    <button className={primaryButtonClassName} type='submit'>
                      {primary}
                    </button>
                  </div>
                  <div className='modal-button_item modal-button_secondary'>
                    <button className='button no-border' onClick={onSecondaryClick} type='button'>
                      {secondary}
                    </button>
                  </div>
                </Modal.Footer>
              </form>
            )}
          />
        </Loading>
      </div>
    </Modal.Body>
  )
}

const FormModal = ({ children, isOpen, handleClose, styleType, ...FormModalBodyProps }) => (
  <Modal isOpen={isOpen} handleClose={handleClose} styleType={styleType}>
    <FormModalBody handleClose={handleClose} {...FormModalBodyProps}>
      {children}
    </FormModalBody>
  </Modal>
)

export default FormModal
