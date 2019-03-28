import React from 'react'

import StatusDropdown from '~/components/molecules/StatusDropdown'
import FormModal from './FormModal'
import { TextArea } from 'react-form'
import formUtils from '~/utils/formUtils'

class StatusModalWrapper extends React.Component {
  formValidator = (values) => {
    return {
      comment: !values.comment || values.comment.trim() === '' ? 'Please provide a comment.' : null
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
        validateError={this.formValidator}
        showAlert={showAlert}
        alertMsg={alertMsg !== null ? alertMsg : 'Something went wrong, please try again.'}
        onAlertCloseClick={onAlertCloseClick}
        loading={loading}>
        {formApi => (
          <div className={'form-group ' + (formUtils.submitErrors(formApi).comment ? 'error' : '')}>
            <h2 className='form-label'>Status/Comment</h2>
            <StatusDropdown
              status={status}
              onChange={onStatusChange}
              buttonClasses={['margin-bottom--half', 'expand', 'small']}
              menuClasses={['form-modal_dropdown-menu']} />
            {!status && <small className='error'>Please provide a status.</small>}
            <label className='sr-only' htmlFor='status-comment' id='status-comment-label'>Comment</label>
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
            {formUtils.submitErrors(formApi).comment && <small className='error'>{formApi.errors.comment}</small>}
          </div>
        )}
      </FormModal>
    )
  }
}

export default StatusModalWrapper
