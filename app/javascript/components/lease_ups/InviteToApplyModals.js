import React, { forwardRef, useImperativeHandle } from 'react'

import arrayMutators from 'final-form-arrays'
import moment from 'moment'

import apiService from 'apiService'
import FormGrid from 'components/molecules/FormGrid'
import FormModal from 'components/organisms/FormModal'
import { useStateObject } from 'utils/customHooks'
import { InputField, HelpText } from 'utils/form/final_form/Field'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import validate from 'utils/form/validations'

export const InviteToApplyModals = forwardRef((props, ref) => {
  const INVITE_APPLY_UPLOAD_KEY = 'invite-to-apply-file-upload-url'
  const INVITE_APPLY_DEADLINE_KEY = 'invite-to-apply-deadline'

  const [rsvpModalState, setRsvpModalState] = useStateObject({
    // modal hide/show states
    uploadUrl: false,
    setDeadline: false
  })

  const [rsvpModalValues, setRsvpModalValues] = useStateObject({
    [INVITE_APPLY_UPLOAD_KEY]: '',
    [INVITE_APPLY_DEADLINE_KEY]: {
      month: '',
      day: '',
      year: ''
    }
  })

  const handleSetUpInvitationApply = () => {
    // show setup invitation to apply modal
    showRsvpModal('uploadUrl')
  }
  // expose handleSetupInvitationApply to parent
  useImperativeHandle(ref, () => ({
    setUpInvitationToApply: handleSetUpInvitationApply
  }))

  const handleCloseRsvpModal = () => {
    const stateObj = {}
    for (const key of Object.keys(rsvpModalState)) {
      stateObj[key] = false
    }
    setRsvpModalState(stateObj)
  }

  const showRsvpModal = (key) => {
    handleCloseRsvpModal()
    const stateObj = {}
    stateObj[key] = true
    setRsvpModalState(stateObj)
  }

  const uploadUrlSubmit = (values) => {
    setRsvpModalValues(values)
    showRsvpModal('setDeadline')
  }

  const deadlineSubmit = (values) => {
    setRsvpModalValues(values)

    const applicationIds = Object.entries(props.bulkCheckboxesState)
      .filter(([_, checked]) => checked)
      .map(([id, _]) => id)
    const deadline = values[INVITE_APPLY_DEADLINE_KEY]
    handleCloseRsvpModal()

    apiService.updateListing({
      id: props.listingId,
      file_upload_url: rsvpModalValues[INVITE_APPLY_UPLOAD_KEY]
    })

    applicationIds.forEach((appId) => {
      const dateObj = moment(`${deadline.year}-${deadline.month}-${deadline.day}`).endOf('day')
      apiService.updateApplication({
        id: appId,
        invite_to_apply_deadline_date: dateObj.utc().format()
      })
    })
  }

  const validateDeadline = (values) => {
    const errs = {}
    const dateInput = values[INVITE_APPLY_DEADLINE_KEY]
    if (dateInput) {
      const validation = validate.isFutureDate(
        'Enter a date like: MM DD YYYY.  It must be after today.'
      )([dateInput.year, dateInput.month, dateInput.day])
      if (validation) {
        errs[INVITE_APPLY_DEADLINE_KEY] = {
          all: validation,
          year: validation,
          month: validation,
          day: validation
        }
      }
    }

    return errs
  }

  return (
    <>
      <FormModal
        isOpen={rsvpModalState.uploadUrl}
        title='Add document upload URL'
        subtitle='Enter the link applicants will use to upload their documents.'
        onSubmit={uploadUrlSubmit}
        handleClose={handleCloseRsvpModal}
        primary='next'
        secondary='cancel'
        onSecondaryClick={handleCloseRsvpModal}
      >
        {(values, changeFieldValue) => (
          <div className={'form-group'}>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <InputField
                  label={'Document upload URL'}
                  labelId='doc-upload-url-label'
                  fieldName={INVITE_APPLY_UPLOAD_KEY}
                  id={INVITE_APPLY_UPLOAD_KEY}
                  cols='30'
                  rows='10'
                  ariaDescribedby='invite-to-apply-upload-url-label'
                  maxLength='255'
                  validation={validate.isValidUrl('Please enter a valid URL')}
                />
              </FormGrid.Item>
            </FormGrid.Row>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <HelpText
                  id='invite-to-apply-file-upload-url-help'
                  note='Example: https://www.dropbox.com/scl/fo/oi0q'
                />
              </FormGrid.Item>
            </FormGrid.Row>
          </div>
        )}
      </FormModal>
      <FormModal
        isOpen={rsvpModalState.setDeadline}
        title='Set document submission deadline'
        subtitle={
          'Enter date that will show as the deadline for applicants to upload their application documents.  If this is your first time contacting the applicant, you must give them at least 5 business days.'
        }
        onSubmit={deadlineSubmit}
        handleClose={handleCloseRsvpModal}
        primary='save'
        secondary='cancel'
        onSecondaryClick={handleCloseRsvpModal}
        mutators={{
          ...arrayMutators
        }}
        validateError={validateDeadline}
      >
        {(values, changeFieldValue, form) => (
          <div className={'form-group'}>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <MultiDateField
                  form={form}
                  formName={INVITE_APPLY_DEADLINE_KEY}
                  fieldName={INVITE_APPLY_DEADLINE_KEY}
                  id={INVITE_APPLY_DEADLINE_KEY}
                  label='Document submission deadline'
                />
              </FormGrid.Item>
            </FormGrid.Row>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <HelpText
                  id='invite-to-apply-deadline-help'
                  note='Example: July 27, 2025 is 07 27 2025'
                />
              </FormGrid.Item>
            </FormGrid.Row>
          </div>
        )}
      </FormModal>
    </>
  )
})
