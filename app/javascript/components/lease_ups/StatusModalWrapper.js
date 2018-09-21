import React from 'react'

import Dropdown from '../molecules/Dropdown'
import FormModal from 'components/organisms/FormModal'
import { TextArea } from 'react-form'
import formUtils from '~/utils/formUtils'
import { LEASE_UP_STATUS_OPTIONS, getLeaseUpStatusStyle } from './leaseUpsHelpers'

class StatusModalWrapper extends React.Component {
  formValidator = (values) => {
    return {
      comment: !values.comment || values.comment.trim() === '' ? 'Please provide a comment.' : null
    }
  };

  render () {
    const {
      isOpen,
      closeHandler,
      submitHandler,
      showAlert,
      onAlertCloseClick,
      loading,
      status,
      changeHandler,
      header,
      primaryButton
    } = this.props

    return (
      <FormModal
        header={header}
        primary={primaryButton}
        secondary='cancel'
        isOpen={isOpen}
        handleClose={closeHandler}
        onSubmit={submitHandler}
        onSecondaryClick={closeHandler}
        type='status'
        validateError={this.formValidator}
        showAlert={showAlert}
        alertMsg='Something went wrong, please try again.'
        onAlertCloseClick={onAlertCloseClick}
        loading={loading}>
        {formApi => (
          <div className={'form-group ' + (formUtils.submitErrors(formApi).comment ? 'error' : '')}>
            <h2 className='form-label'>Status/Comment</h2>
            <Dropdown
              items={LEASE_UP_STATUS_OPTIONS}
              value={status}
              prompt='Status'
              onChange={changeHandler}
              buttonClasses={[getLeaseUpStatusStyle(status), 'margin-bottom--half', 'expand', 'small']}
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
              className={formUtils.submitErrors(formApi).comment ? 'error' : ''} />
            {formUtils.submitErrors(formApi).comment && <small className='error'>{formApi.errors.comment}</small>}
          </div>
        )}
      </FormModal>
    )
  }
}

export default StatusModalWrapper
