import React from 'react'

import StatusDropdown from '~/components/molecules/StatusDropdown'
import FormModal from './FormModal'
import { TextArea } from 'react-form'
import formUtils from '~/utils/formUtils'
import { statusRequiresComments, LEASE_UP_SUBSTATUS_OPTIONS } from '~/utils/statusUtils'

class StatusModalWrapper extends React.Component {
  formValidator = (values, commentRequired) => {
    return {
      comment: commentRequired && (!values.comment || values.comment.trim() === '') ? 'Please provide a comment.' : null
    }
  };

  render () {
    const {
      isOpen,
      onClose,
      onSubmit,
      showAlert,
      alertMsg,
      onAlertCloseClick,
      loading,
      status,
      subStatus,
      onStatusChange,
      header,
      submitButton
    } = this.props

    return (
      <FormModal
        header={header}
        primary={submitButton}
        secondary='cancel'
        isOpen={isOpen}
        handleClose={onClose}
        onSubmit={(values) => onSubmit(values, statusRequiresComments(status, subStatus))}
        onSecondaryClick={onClose}
        type='status'
        validateError={(values) => this.formValidator(values, statusRequiresComments(status, subStatus))}
        showAlert={showAlert}
        alertMsg={alertMsg !== null ? alertMsg : 'Something went wrong, please try again.'}
        onAlertCloseClick={onAlertCloseClick}
        loading={loading}>
        {formApi => (
          <div className='form-group'>
            <h2 className='form-label'>Status</h2>
            <StatusDropdown
              status={status}
              onChange={onStatusChange}
              buttonClasses={['margin-bottom--half', 'expand', 'small']}
              menuClasses={['form-modal_dropdown-menu']}
              wrapperClasses={['status']} />
            {!status && <small className='error'>Please provide a status.</small>}
            {status && LEASE_UP_SUBSTATUS_OPTIONS[status] && (
              <React.Fragment>
                <h2 className='form-label'>Status Detail</h2>
                <StatusDropdown
                  status={status}
                  subStatus={subStatus}
                  prompt={'Select One...'}
                  showSubStatus
                  onChange={onStatusChange}
                  buttonClasses={['margin-bottom--half', 'expand', 'substatus']}
                  menuClasses={['form-modal_dropdown-menu']}
                  wrapperClasses={['subStatus']} />
              </React.Fragment>
            )}
            <label className={`form-label ${statusRequiresComments(status, subStatus) && formUtils.submitErrors(formApi).comment ? 'error' : ''}`} id='status-comment-label'>Comment{statusRequiresComments(status, subStatus) ? ' (required)' : ''}</label>
            <TextArea
              field='comment'
              name='comment'
              id='status-comment'
              cols='30'
              rows='10'
              placeholder='Add a comment'
              aria-describedby='status-comment-label'
              maxLength='255'
              className={formUtils.submitErrors(formApi).comment ? 'error' : ''} />
            {statusRequiresComments(status, subStatus) && formUtils.submitErrors(formApi).comment && <small className='error'>{formApi.errors.comment}</small>}
          </div>
        )}
      </FormModal>
    )
  }
}

export default StatusModalWrapper
