import React from 'react'
import { Field } from 'react-final-form'

import StatusDropdown from '~/components/molecules/StatusDropdown'
import FormModal from './FormModal'
import { TextAreaField } from '~/utils/form/final_form/Field'
import validate from '~/utils/form/validations'
import { statusRequiresComments, LEASE_UP_SUBSTATUS_OPTIONS } from '~/utils/statusUtils'

const StatusModalWrapper = ({
  isOpen,
  onClose,
  onSubmit,
  showAlert,
  alertMsg,
  onAlertCloseClick,
  loading,
  status = '',
  subStatus = '',
  header,
  submitButton
}) => {
  const required = value => (value ? undefined : 'Required')
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
      loading={loading}
      initialValues={{
        status,
        subStatus,
        comment: ''
      }}
      validateError={values => {
        const errors = {}
        if ((values.status) && LEASE_UP_SUBSTATUS_OPTIONS[values.status] && (!values.subStatus)) {
          errors.subStatus = 'Please provide status details.'
        }
        return errors
      }} >
      {(values) => {
        const requiresComment = statusRequiresComments(values.status, values.subStatus)
        return (
          <div className={'form-group'}>
            <h2 className='form-label'>Status</h2>
            {/* Inline field due to the nested level throwing error in react-final-form */}
            <Field name='status' validate={required}>
              {({ input: { onChange }, meta }) => (
                <React.Fragment>
                  <StatusDropdown
                    status={values.status}
                    onChange={onChange}
                    buttonClasses={['margin-bottom--half', 'expand', 'small']}
                    menuClasses={['form-modal_dropdown-menu']}
                    wrapperClasses={['status']} />
                  {!values.status && meta.touched && meta.error && <small className='error'>{meta.error}</small>}
                </React.Fragment>
              )}
            </Field>
            {((values.status) && LEASE_UP_SUBSTATUS_OPTIONS[values.status]) && (
              <React.Fragment>
                <h2 className='form-label'>Status Detail</h2>
                {/*
                  Inline field due to the nested level throwing error in react-final-form
                  and record level validation so it can be conditional
                */}
                <Field name='subStatus'>
                  {({ input: { onChange }, meta }) => (
                    <React.Fragment>
                      <StatusDropdown
                        status={values.status}
                        subStatus={values.subStatus}
                        prompt={'Select One...'}
                        showSubStatus
                        onChange={onChange}
                        buttonClasses={['margin-bottom--half', 'expand', 'substatus']}
                        menuClasses={['form-modal_dropdown-menu']}
                        wrapperClasses={['subStatus']} />
                      {!values.subStatus && meta.touched && meta.error && <small className='error'>{meta.error}</small>}
                    </React.Fragment>
                  )}
                </Field>
              </React.Fragment>
            )}
            <TextAreaField
              label={requiresComment ? 'Comment (required)' : 'Comment'}
              labelId='status-comment-label'
              fieldName='comment'
              id='status-comment'
              cols='30'
              rows='10'
              placeholder='Add a comment'
              ariaDescribedby='status-comment-label'
              maxLength='255'
              validation={requiresComment && validate.isPresent('Please provide a comment.')} />
          </div>
        )
      }}
    </FormModal>
  )
}

export default StatusModalWrapper
