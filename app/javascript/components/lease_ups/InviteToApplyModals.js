import React, { forwardRef, useEffect, useImperativeHandle } from 'react'

import arrayMutators from 'final-form-arrays'
import { map } from 'lodash'
import moment from 'moment'
import { RE2JS } from 're2js'

import apiService from 'apiService'
import Alerts from 'components/Alerts'
import FormGrid from 'components/molecules/FormGrid'
import InfoAlert from 'components/molecules/InfoAlert'
import FormModal from 'components/organisms/FormModal'
import { useStateObject } from 'utils/customHooks'
import { InputField, HelpText } from 'utils/form/final_form/Field'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import validate from 'utils/form/validations'
import { INVITE_EMAILS_CONTEXT } from 'utils/inviteEmail'

import InviteToApplyUploadUrlTable, { UPLOAD_URL_INPUT_PREFIX } from './InviteToApplyUploadUrlTable'
import { buildRowData } from './LeaseUpApplicationsTableContainer'

export const InviteToApplyModals = forwardRef((props, ref) => {
  const INVITE_APPLY_UPLOAD_KEY = 'invite-to-apply-file-upload-url'
  const INVITE_APPLY_PER_APP_UPLOAD_KEY = 'invite-to-apply-per-app-upload-url'
  const INVITE_APPLY_DEADLINE_KEY = 'invite-to-apply-deadline'
  const INVITE_APPLY_EXAMPLE_EMAIL = 'invite-to-apply-example-email'

  const [inviteModalState, setInviteModalState] = useStateObject({
    // modal hide/show states
    uploadUrl: false,
    urlPerApp: false,
    setDeadline: false,
    review: false,
    example: false,
    current: ''
  })

  const [inviteContext, setInviteContext] = useStateObject(INVITE_EMAILS_CONTEXT.i2a)

  const [exampleSuccessAlertState, setExampleSuccessAlertState] = useStateObject({
    show: false,
    email: ''
  })

  const [inviteModalValues, setInviteModalValues] = useStateObject({
    [INVITE_APPLY_UPLOAD_KEY]: '',
    [INVITE_APPLY_DEADLINE_KEY]: {
      month: '',
      day: '',
      year: ''
    },
    [INVITE_APPLY_PER_APP_UPLOAD_KEY]: {}
  })

  const handleSetUpInvitationApply = (inviteType) => {
    const context = INVITE_EMAILS_CONTEXT[inviteType]
    setInviteContext(context)
    setExampleSuccessAlertState({ show: false, email: '' })
    const defaultUploadUrls = getDefaultUploadUrls()
    setInviteModalValues({ [INVITE_APPLY_PER_APP_UPLOAD_KEY]: defaultUploadUrls })
    showNextModal(
      {
        ...inviteModalValues,
        [INVITE_APPLY_PER_APP_UPLOAD_KEY]: defaultUploadUrls
      },
      inviteModalState
    )
  }
  // expose handleSetupInvitationApply to parent
  useImperativeHandle(ref, () => ({
    setUpInvitationToApply: handleSetUpInvitationApply
  }))

  const handleCloseInviteModal = () => {
    const stateObj = {}
    for (const key of Object.keys(inviteModalState)) {
      stateObj[key] = false
    }
    setInviteModalState(stateObj)
  }

  const closeExampleModal = () => {
    showInviteModal('review')
    setExampleSuccessAlertState({ show: false, email: '' })
  }

  const showInviteModal = (key, callback) => {
    handleCloseInviteModal()
    const stateObj = {}
    stateObj[key] = true
    stateObj.current = key
    setInviteModalState(stateObj, callback)
  }

  const isUrlPerAppMode = () => {
    return localStorage.getItem('urlPerAppMode') === 'true'
  }

  const uploadUrlModalSubmit = (submittedValues) => {
    setInviteModalValues(submittedValues)
    showNextModal(
      {
        ...inviteModalValues,
        ...submittedValues
      },
      inviteModalState
    )
  }

  const oneUploadPerAppSubmit = (submittedValues) => {
    // update state object
    setInviteModalValues({ [INVITE_APPLY_PER_APP_UPLOAD_KEY]: submittedValues })

    // show the next modal
    showNextModal(
      {
        ...inviteModalValues,
        ...submittedValues
      },
      inviteModalState
    )
  }

  const showNextModal = (latestModalValues, latestModalState) => {
    // determine which modals to show based on whether
    // certain variables have been set
    if (!latestModalValues[INVITE_APPLY_UPLOAD_KEY] && !isUrlPerAppMode()) {
      showInviteModal('uploadUrl')
    } else if (isUrlPerAppMode() && latestModalState.current !== 'urlPerApp') {
      showInviteModal('urlPerApp')
    } else if (Object.keys(validateDeadline(latestModalValues)).length !== 0) {
      showInviteModal('setDeadline')
    } else {
      showInviteModal('review')
    }
  }

  const setUrlPerApplcation = (isPerAppMode) => {
    localStorage.setItem('urlPerAppMode', isPerAppMode)
    if (isPerAppMode) {
      showInviteModal('urlPerApp')
    } else {
      showInviteModal('uploadUrl')
    }
  }

  const getSelectedApplicationIds = () => {
    return Object.entries(props.bulkCheckboxesState)
      .filter(([_, checked]) => checked)
      .map(([id, _]) => id)
  }

  const getSelectedApplicationData = () => {
    const selectedIds = getSelectedApplicationIds()
    const selectedData = props.applications.filter((app) =>
      selectedIds.includes(app.application_id)
    )
    return map(selectedData, buildRowData)
  }

  const selectedAppData = getSelectedApplicationData()

  const getDefaultUploadUrls = () => {
    // build 1 url per app defaults from initial salesforce application data
    const defaultUploadUrls = {}
    for (const app of selectedAppData) {
      const fieldInputKey = UPLOAD_URL_INPUT_PREFIX + app.application_id
      // give priority to any changed values stored in memory
      if (inviteModalValues[INVITE_APPLY_PER_APP_UPLOAD_KEY][fieldInputKey]) {
        defaultUploadUrls[fieldInputKey] =
          inviteModalValues[INVITE_APPLY_PER_APP_UPLOAD_KEY][fieldInputKey]
      } else if (app.upload_url) {
        // fall back to url from salesforce on initial page load
        defaultUploadUrls[fieldInputKey] = app.upload_url
      }
    }
    return defaultUploadUrls
  }

  const setdeadlineModalSubmit = (submittedValues) => {
    setInviteModalValues(submittedValues)
    showInviteModal('review')
  }

  const validateDeadline = (submittedValues) => {
    const errs = {}
    const dateInput = submittedValues[INVITE_APPLY_DEADLINE_KEY]
    const errMsg = 'Enter a date like: MM DD YYYY.  It must be after today.'
    if (dateInput) {
      const validation = validate.isFutureDate(errMsg)([
        dateInput.year,
        dateInput.month,
        dateInput.day
      ])
      if (validation) {
        errs[INVITE_APPLY_DEADLINE_KEY] = {
          all: validation,
          year: validation,
          month: validation,
          day: validation
        }
      }
    } else {
      errs[INVITE_APPLY_DEADLINE_KEY] = {
        all: errMsg,
        year: errMsg,
        month: errMsg,
        day: errMsg
      }
    }

    return errs
  }

  const validateUniqueUrls = (submittedValues) => {
    const errs = {}
    const dupes = new Set()
    const uniques = new Set()
    const values = Object.values(submittedValues)

    values.forEach((val) => {
      if (uniques.has(val)) {
        dupes.add(val)
      } else {
        uniques.add(val)
      }
    })

    if (dupes.size > 0) {
      for (const key in submittedValues) {
        if (dupes.has(submittedValues[key])) {
          errs[key] =
            'Duplicate URL found.  Make sure you have the correct link for this applicant.'
        }
      }
    }

    return errs
  }

  const checkedAppsWithoutEmail = () => {
    const selectedIds = getSelectedApplicationIds()
    return props.applications.filter(
      (app) => !app.email && selectedIds.includes(app.application_id)
    ).length
  }

  useEffect(() => {
    // uncheck any selected checkboxes when loading is finished to reset the page state after sending invites
    if (props.pageState.loading === false) {
      props.onClearSelectedApplications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pageState.loading])

  const sendInvite = async (submittedValues) => {
    const appIds = getSelectedApplicationIds()
    const deadline = inviteModalValues[INVITE_APPLY_DEADLINE_KEY]
    const dateObj = moment(
      `${deadline.year}-${deadline.month}-${deadline.day}`,
      'YYYY-MM-DD'
    ).endOf('day')
    const exampleEmail = submittedValues[INVITE_APPLY_EXAMPLE_EMAIL]

    // show spinner
    if (!exampleEmail) {
      handleCloseInviteModal()
      props.setPageState({ loading: true })
    }

    // save upload url and deadline to salesforce
    // depending if 1 url per app, iterate over array of app ids or object with appIdEmbed:url name/value pairs
    let counter = 0
    let appIterator, size
    if (isUrlPerAppMode()) {
      appIterator = inviteModalValues[INVITE_APPLY_PER_APP_UPLOAD_KEY]
      size = Object.keys(appIterator).length
    } else {
      appIterator = appIds
      size = appIds.length
    }
    for (const key in appIterator) {
      let appId, url
      if (isUrlPerAppMode()) {
        appId = RE2JS.compile('^' + UPLOAD_URL_INPUT_PREFIX)
          .matcher(key)
          .replace('')
        url = appIterator[key]
      } else {
        appId = appIterator[key]
        url = inviteModalValues[INVITE_APPLY_UPLOAD_KEY]
      }

      try {
        await inviteContext
          .save({
            appId,
            url,
            dateObj
          })
          .then(async () => {
            counter++
            // make backend api call to send i2a after last application saved to salesforce
            if (counter === size) {
              await apiService
                .sendInvite(
                  props.listing,
                  appIds,
                  `${deadline.year}-${deadline.month}-${deadline.day}`,
                  exampleEmail || null
                )
                .then((res) => {
                  if (exampleEmail) {
                    // show example email sent feedback
                    setExampleSuccessAlertState({
                      show: true,
                      email: exampleEmail
                    })
                  } else {
                    // hide spinner, show sending email feedback
                    props.setPageState({
                      loading: false,
                      showPageInfo: true
                    })
                  }
                })
            }
          })
      } catch (error) {
        console.log(error)
        props.setPageState({ loading: false })
        Alerts.error()
        break
      }
    }
  }

  const formatDeadline = () => {
    const deadline = inviteModalValues[INVITE_APPLY_DEADLINE_KEY]
    const dateObj = moment(
      `${deadline.year}-${deadline.month}-${deadline.day}`,
      'YYYY-MM-DD'
    ).endOf('day')
    return dateObj.format('MMMM D, YYYY') + ', 11:59 PM Pacific Time'
  }

  return (
    <>
      <FormModal
        isOpen={inviteModalState.uploadUrl}
        title={inviteContext?.url?.title || ''}
        subtitle={inviteContext?.url?.subtitle || ''}
        onSubmit={uploadUrlModalSubmit}
        handleClose={handleCloseInviteModal}
        primary='next'
        secondary='cancel'
        onSecondaryClick={handleCloseInviteModal}
        initialValues={inviteModalValues}
      >
        {() => (
          <div className={'form-group'}>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <InputField
                  label={inviteContext?.url?.label || ''}
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
                  note={inviteContext?.url?.helpText || ''}
                />
              </FormGrid.Item>
            </FormGrid.Row>
            {inviteContext?.url?.urlPerApp && (
              <p>
                <a
                  href='#'
                  onClick={(evt) => {
                    setUrlPerApplcation(true)
                    evt.preventDefault()
                  }}
                >
                  {inviteContext.url.urlPerApp}
                </a>
              </p>
            )}
          </div>
        )}
      </FormModal>
      <FormModal
        isOpen={inviteModalState.urlPerApp}
        title='Add a document upload URL for each applicant'
        subtitle='Enter the unique link each applicant will use to upload their documents.'
        onSubmit={oneUploadPerAppSubmit}
        handleClose={handleCloseInviteModal}
        primary='next'
        secondary='cancel'
        onSecondaryClick={handleCloseInviteModal}
        validateError={validateUniqueUrls}
        initialValues={inviteModalValues[INVITE_APPLY_PER_APP_UPLOAD_KEY]}
        styleType='large'
      >
        {(_values, _changeFieldValue, form) => (
          <>
            <p>
              <a
                href='#'
                onClick={(evt) => {
                  setUrlPerApplcation(false)
                  evt.preventDefault()
                }}
              >
                Or, use a single URL for all applicants
              </a>
            </p>
            <InviteToApplyUploadUrlTable selectedData={selectedAppData} />
          </>
        )}
      </FormModal>
      <FormModal
        isOpen={inviteModalState.setDeadline}
        title='Set document submission deadline'
        subtitle={
          'Enter date that will show as the deadline for applicants to upload their application documents.  If this is your first time contacting the applicant, you must give them at least 5 business days.'
        }
        onSubmit={setdeadlineModalSubmit}
        handleClose={handleCloseInviteModal}
        primary='save'
        secondary='cancel'
        onSecondaryClick={handleCloseInviteModal}
        mutators={{
          ...arrayMutators
        }}
        validateError={validateDeadline}
        initialValues={inviteModalValues}
      >
        {(_values, _changeFieldValue, form) => (
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
      <FormModal
        isOpen={inviteModalState.review}
        title='Review and send'
        primary='send now'
        secondary='cancel'
        onSubmit={sendInvite}
        handleClose={handleCloseInviteModal}
        onSecondaryClick={handleCloseInviteModal}
      >
        {(_values, _changeFieldValue, _form) => (
          <div className={'form-group'}>
            <p>
              When you’re ready, send an email to the applicants you selected. If you want,&nbsp;
              <a onClick={() => showInviteModal('example')}>send yourself an example email</a> to
              preview what applicants will see.
            </p>
            <p>
              <label className='form-label'>You are sending</label>
              Invitation to Apply
            </p>
            <p>
              <label className='form-label'>
                Document upload URL&nbsp;
                <a
                  onClick={() => {
                    isUrlPerAppMode() ? showInviteModal('urlPerApp') : showInviteModal('uploadUrl')
                  }}
                >
                  Edit
                </a>
              </label>
              {isUrlPerAppMode() ? 'Multiple URLs' : inviteModalValues[INVITE_APPLY_UPLOAD_KEY]}
            </p>
            <p>
              <label className='form-label'>
                Deadline&nbsp;
                <a
                  data-testid='edit-deadline-link'
                  onClick={() => {
                    showInviteModal('setDeadline')
                  }}
                >
                  Edit
                </a>
              </label>
              {formatDeadline()}
            </p>
            <p>
              <label className='form-label'>Send to</label>
              {getSelectedApplicationIds().length} applicants and alternate contacts, if provided
            </p>
            {checkedAppsWithoutEmail() > 0 && (
              <InfoAlert
                message={
                  <span>
                    <strong className='semi-bold'>
                      {checkedAppsWithoutEmail() === 1
                        ? `1 applicant you selected does not have an email address. `
                        : `${checkedAppsWithoutEmail()} applicants you selected do not have an email address. `}
                    </strong>
                    After sending, we will show who you still need to contact on the applicant list.
                  </span>
                }
                icon='i-info'
                closeType='none'
                classes={['primary-alert', 'i2a-review']}
              />
            )}
          </div>
        )}
      </FormModal>
      <FormModal
        isOpen={inviteModalState.example}
        onSubmit={exampleSuccessAlertState.show ? closeExampleModal : sendInvite}
        handleClose={closeExampleModal}
        primary={exampleSuccessAlertState.show ? 'done' : 'send example email'}
      >
        {() => (
          <div className={'form-group'}>
            {exampleSuccessAlertState.show && (
              <InfoAlert
                icon='i-check'
                message={'Example email sent to ' + exampleSuccessAlertState.email}
                show={exampleSuccessAlertState.show}
                onCloseClick={() => setExampleSuccessAlertState({ show: false })}
                classes={['success-alert']}
              />
            )}
            <header className='modal-inner margin-top'>
              <h1 className='modal-title t-gamma no-margin'>See an example</h1>
            </header>
            <section className='modal-inner'>
              Send yourself an example email to see what applicants will see when they get an
              Invitation to Apply.
            </section>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <InputField
                  label={'Email address'}
                  labelId='example-email-label'
                  fieldName={INVITE_APPLY_EXAMPLE_EMAIL}
                  id={INVITE_APPLY_EXAMPLE_EMAIL}
                  cols='30'
                  rows='10'
                  ariaDescribedby='invite-to-apply-example-label'
                  maxLength='255'
                  validation={validate.isValidEmailStrict(
                    'Enter email address like: example@web.com'
                  )}
                />
              </FormGrid.Item>
            </FormGrid.Row>
            <FormGrid.Row>
              <FormGrid.Item width='100%'>
                <HelpText
                  id='invite-to-apply-file-example-help'
                  note='Enter your own email address, or send it to a colleague'
                />
              </FormGrid.Item>
            </FormGrid.Row>
          </div>
        )}
      </FormModal>
    </>
  )
})
