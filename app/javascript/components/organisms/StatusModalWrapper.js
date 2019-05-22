import React from 'react'

import StatusDropdown from '~/components/molecules/StatusDropdown'
import FormModal from './FormModal'
import { TextAreaField } from '~/utils/form/final_form/Field'
import validate from '~/utils/form/validations'
import { statusRequiresComments } from '~/utils/statusUtils'

class StatusModalWrapper extends React.Component {
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
        onSubmit={onSubmit}
        onSecondaryClick={onClose}
        type='status'
        showAlert={showAlert}
        alertMsg={alertMsg !== null ? alertMsg : 'Something went wrong, please try again.'}
        onAlertCloseClick={onAlertCloseClick}
        loading={loading}>
        {form => (
          <div className={'form-group'}>
            <h2 className='form-label'>Status</h2>
            <StatusDropdown
              status={status}
              onChange={onStatusChange}
              buttonClasses={['margin-bottom--half', 'expand', 'small']}
              menuClasses={['form-modal_dropdown-menu']}
              wrapperClasses={['status']} />
            {!status && <small className='error'>Please provide a status.</small>}
            {status && (
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
            <TextAreaField
              label={'Comment' + statusRequiresComments(status, subStatus) ? ' (required)' : ''}
              fieldName='comment'
              labelClass={`form-label ${form.getState().errors.comment ? 'error' : ''}`}
              id='status-comment'
              cols='30'
              rows='10'
              placeholder='Add a comment'
              ariaDescribedby='status-comment-label'
              maxLength='255'
              validation={validate.isPresent('Please provide a comment.')} />
          </div>
        )}
      </FormModal>
    )
  }
}

export default StatusModalWrapper
