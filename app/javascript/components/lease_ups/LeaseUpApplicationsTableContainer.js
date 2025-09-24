import React, { useEffect } from 'react'

import arrayMutators from 'final-form-arrays'
import { capitalize, compact, map, cloneDeep, isEmpty } from 'lodash'

import apiService from 'apiService'
import FormGrid from 'components/molecules/FormGrid'
import FormModal from 'components/organisms/FormModal'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { useStateObject } from 'utils/customHooks'
import { InputField, HelpText } from 'utils/form/final_form/Field'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import validate from 'utils/form/validations'
import { addLayeredValidation } from 'utils/layeredPreferenceUtil'

import { withContext } from './context'
import LeaseUpApplicationsFilterContainer from './LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
import { getApplicationsPagination } from './utils/leaseUpRequestUtils'

const getRank = (prefKey, prefLotteryRank) => {
  return prefLotteryRank ? `${prefKey} ${prefLotteryRank}` : 'Unranked'
}

const getPrefKey = (application) => {
  // Override the key we display for certain cases
  if (application.preference_name === 'General') {
    return 'General'
  } else if (application.preference_name?.includes('Right to Return')) {
    return 'RtR'
  } else if (application.preference_name?.includes('Tier')) {
    return application.custom_preference_type.replace('G', 'General')
  }

  return application.custom_preference_type
    ? application.custom_preference_type
    : application.preference_record_type
}

export const getAccessibilityKeys = (application) => {
  const accessibilityKeys = compact(Object.keys(application.has_ada_priorities_selected))

  return accessibilityKeys
    .map((key) => {
      if (key === 'hcbs_units') {
        return 'HCBS Units'
      } else {
        return capitalize(key.split('_')[0])
      }
    })
    .join(', ')
}

// Format applications for the Lease Up applications table
export const buildRowData = (application) => {
  const rowData = cloneDeep(application)

  // get keys and remove empty values
  if (application.has_ada_priorities_selected) {
    rowData.accessibility = getAccessibilityKeys(application)
  }

  const prefKey = getPrefKey(application)

  rowData.preference_rank = getRank(prefKey, application.preference_lottery_rank)
  const prefNum = parseFloat(application.preference_order)
  const rankNum = parseFloat(application.preference_lottery_rank)
  rowData.rankOrder = prefNum + rankNum * 0.0001
  return rowData
}

export const buildApplicationsWithLayeredValidations = (listingId, preferences, setPrefMap) => {
  // don't need layered validation for fcfs or listings that do not have preferences
  if (!preferences) return

  // don't need to make additional calls to the backend for listings w/out veterans
  if (preferences.some((pref) => pref.includes('Veteran'))) {
    getApplicationsPagination(listingId, 0, {})
  }
}

const LeaseUpTableContainer = ({
  store: {
    applications,
    atMaxPages,
    bulkCheckboxesState,
    listingId,
    listingType,
    loading,
    onBulkCheckboxClick,
    onCloseStatusModal,
    onFilter,
    onLeaseUpStatusChange,
    onSubmitStatusModal,
    onClearSelectedApplications,
    onSelectAllApplications,
    pages,
    preferences,
    rowsPerPage,
    statusModal
  }
}) => {
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

  useEffect(() => {
    if (!preferences) return

    if (!isEmpty(applications)) {
      addLayeredValidation(applications)
    }
  }, [applications, preferences])

  return (
    <>
      <LeaseUpApplicationsFilterContainer
        listingId={listingId}
        listingType={listingType}
        preferences={preferences}
        onSubmit={onFilter}
        loading={loading}
        bulkCheckboxesState={bulkCheckboxesState}
        onClearSelectedApplications={onClearSelectedApplications}
        onSelectAllApplications={onSelectAllApplications}
        onBulkLeaseUpStatusChange={(val) => onLeaseUpStatusChange(val, null, false)}
        onBulkLeaseUpCommentChange={(val) => onLeaseUpStatusChange(null, null, true)}
        onRsvpSendEmailChange={(val) => handleSetUpInvitationApply()}
      />
      {!loading && (
        <LeaseUpApplicationsTable
          dataSet={map(applications, buildRowData)}
          listingId={listingId}
          listingType={listingType}
          onLeaseUpStatusChange={onLeaseUpStatusChange}
          pages={pages}
          rowsPerPage={rowsPerPage}
          atMaxPages={atMaxPages}
          bulkCheckboxesState={bulkCheckboxesState}
          onBulkCheckboxClick={onBulkCheckboxClick}
        />
      )}
      <StatusModalWrapper
        alertMsg={statusModal.alertMsg}
        isBulkUpdate={statusModal.isBulkUpdate}
        isOpen={statusModal.isOpen}
        loading={statusModal.loading}
        numApplicationsToUpdate={
          statusModal.applicationsData ? Object.keys(statusModal.applicationsData).length : 1
        }
        onAlertCloseClick={statusModal.onAlertCloseClick}
        onClose={onCloseStatusModal}
        onSubmit={onSubmitStatusModal}
        showAlert={statusModal.showAlert}
        status={statusModal.status}
        submitButton={statusModal.isCommentModal ? 'Submit' : 'Update'}
        title={statusModal.isCommentModal ? 'Add Comment' : 'Update Status'}
        isCommentModal={statusModal.isCommentModal}
      />
      <FormModal
        isOpen={rsvpModalState.uploadUrl}
        title='Edit document upload URL'
        subtitle='Enter the link applicants will use to upload their documents.'
        onSubmit={(values) => {
          setRsvpModalValues(values)
          showRsvpModal('setDeadline')
        }}
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
                  label={'upload'}
                  blockNote={'Document upload URL (required)'}
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
        title='Set document upload deadline'
        subtitle='Enter date that will show as the deadline for applicants to upload their application documents.  You must provide 5 business days.'
        onSubmit={(values) => {
          setRsvpModalValues(values)

          const applicationIds = Object.entries(bulkCheckboxesState)
            .filter(([_, checked]) => checked)
            .map(([id, _]) => id)
          const deadline = values[INVITE_APPLY_DEADLINE_KEY]
          handleCloseRsvpModal()

          apiService.updateListing({
            id: listingId,
            file_upload_url: rsvpModalValues[INVITE_APPLY_UPLOAD_KEY]
          })

          applicationIds.forEach((appId) => {
            apiService.updateApplication({
              id: appId,
              invite_to_apply_deadline_date: `${deadline.year}-${deadline.month}-${deadline.day}`
            })
          })
        }}
        handleClose={handleCloseRsvpModal}
        primary='save'
        secondary='cancel'
        onSecondaryClick={handleCloseRsvpModal}
        mutators={{
          ...arrayMutators
        }}
        validateError={(values) => {
          const errs = {}
          const dateInput = values[INVITE_APPLY_DEADLINE_KEY]
          if (dateInput) {
            const validation = validate.isDate('Please enter a valid date')([
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
          }

          return errs
        }}
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
                  blockNote='Example: July 27, 2025 is 07-27-2025'
                />
              </FormGrid.Item>
            </FormGrid.Row>
          </div>
        )}
      </FormModal>
    </>
  )
}

export default withContext(LeaseUpTableContainer)
