import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import FormGrid from 'components/molecules/FormGrid'
import StatusDropdown from 'components/molecules/StatusDropdown'
import SubstatusDropdown from 'components/molecules/SubstatusDropdown'
import { TextAreaField, Label, FieldError } from 'utils/form/final_form/Field'
import validate from 'utils/form/validations'
import { IsInviteToApplyEnabledForListing } from 'utils/inviteApplyEmail'
import {
  statusRequiresComments,
  LEASE_UP_STATUS_VALUES,
  LEASE_UP_SUBSTATUS_OPTIONS,
  LEASE_UP_SUBSTATUS_VALUES,
  validateStatusForm
} from 'utils/statusUtils'

import FormModal from './FormModal'

const bulkUpdateSubtitle = (isCommentModal, count) => {
  const prefix = isCommentModal ? 'Add a comment to' : 'Update the status for'
  return `${prefix} ${count} selected item${count === 1 ? '' : 's'}`
}

const StatusModalWrapper = ({
  alertMsg = null,
  isCommentModal = false,
  isBulkUpdate = false,
  isOpen = false,
  loading = false,
  numApplicationsToUpdate = 1,
  onAlertCloseClick = () => {},
  onClose = () => {},
  onSubmit = () => {},
  showAlert = false,
  status = null,
  submitButton,
  subStatus = null,
  title = null,
  listingId = null
}) => {
  const isInviteApplyEnabled = IsInviteToApplyEnabledForListing(listingId)
  const substatusOptions = JSON.parse(JSON.stringify(LEASE_UP_SUBSTATUS_OPTIONS))
  if (!isInviteApplyEnabled && substatusOptions.Processing) {
    delete substatusOptions.Processing
  }

  return (
    <FormModal
      title={title}
      subtitle={isBulkUpdate ? bulkUpdateSubtitle(isCommentModal, numApplicationsToUpdate) : null}
      primary={submitButton}
      secondary='cancel'
      isOpen={isOpen}
      handleClose={onClose}
      onSubmit={(values) =>
        isCommentModal || validateStatusForm(values) ? onSubmit(values) : null
      }
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
      validateError={(values) => {
        const errors = {}
        if (values.status && substatusOptions[values.status] && !values.subStatus) {
          errors.subStatus = 'Please provide status details.'
        }
        if (
          !values.comment &&
          (isCommentModal || statusRequiresComments(values.status, values.subStatus))
        ) {
          errors.comment = 'Please provide a comment.'
        }
        return errors
      }}
    >
      {(values, changeFieldValue) => (
        <div className={'form-group'}>
          {!isCommentModal && (
            <>
              <FormGrid.Row paddingBottom>
                <FormGrid.Item width='100%'>
                  <Field
                    name='status'
                    validate={validate.isPresent('Status is required')}
                    component={({ input: { onChange }, meta, ...rest }) => {
                      const hasError = !values.status && meta.touched && meta.error
                      return (
                        <div className={classNames('form-group', hasError && 'error')}>
                          <Label label='Status' />
                          <StatusDropdown
                            status={values.status}
                            onChange={(val) => {
                              onChange(val)
                              changeFieldValue('subStatus', null)
                            }}
                            expand
                            size='small'
                          />
                          <FieldError meta={meta} />
                        </div>
                      )
                    }}
                  />
                </FormGrid.Item>
              </FormGrid.Row>
              {values.status && substatusOptions[values.status] && (
                <FormGrid.Row paddingBottom>
                  <FormGrid.Item width='100%'>
                    <Field
                      name='subStatus'
                      component={({ input: { onChange }, meta }) => {
                        const hasError = !values.subStatus && meta.error && meta.touched
                        return (
                          <div className={classNames('form-group', hasError && 'error')}>
                            <Label label='Status Detail' blockNote='(required)' />
                            <SubstatusDropdown
                              status={values.status}
                              subStatus={values.subStatus}
                              onChange={onChange}
                              hasError={hasError}
                              expand
                            />
                            <FieldError meta={meta} />
                          </div>
                        )
                      }}
                    />
                  </FormGrid.Item>
                </FormGrid.Row>
              )}
            </>
          )}
          <FormGrid.Row>
            <FormGrid.Item width='100%'>
              <TextAreaField
                label={'Comment'}
                blockNote={statusRequiresComments(values.status, values.subStatus) && '(required)'}
                labelId='status-comment-label'
                fieldName='comment'
                id='status-comment'
                cols='30'
                rows='10'
                placeholder='Add a comment'
                ariaDescribedby='status-comment-label'
                maxLength='255'
              />
            </FormGrid.Item>
          </FormGrid.Row>
        </div>
      )}
    </FormModal>
  )
}

export default StatusModalWrapper

StatusModalWrapper.propTypes = {
  alertMsg: PropTypes.string,
  isBulkUpdate: PropTypes.bool,
  isCommentModal: PropTypes.bool,
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  numApplicationsToUpdate: PropTypes.number,
  onAlertCloseClick: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  showAlert: PropTypes.bool,
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES),
  submitButton: PropTypes.node,
  subStatus: PropTypes.oneOf(LEASE_UP_SUBSTATUS_VALUES),
  title: PropTypes.string
}
