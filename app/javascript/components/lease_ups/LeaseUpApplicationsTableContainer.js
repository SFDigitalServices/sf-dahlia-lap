import React, { useEffect, useState } from 'react'

import { capitalize, compact, map, cloneDeep, isEmpty } from 'lodash'

import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { LISTING_TYPE_FIRST_COME_FIRST_SERVED } from 'utils/consts'
import { addLayeredValidation } from 'utils/layeredPreferenceUtil'

import { withContext } from './context'
import LeaseUpApplicationsFilterContainer from './LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsTable from './LeaseUpApplicationsTable'
import { getApplications } from './utils/leaseUpRequestUtils'

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
    getApplications(listingId, 0, {}, true, false).then(({ records }) => {
      const prefMap = {}
      records.forEach((preference) => {
        prefMap[`${preference.application_id}-${preference.preference_name}`] =
          preference.layered_validation
      })
      setPrefMap(prefMap)
    })
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
    statusModal,
    hasFilters
  }
}) => {
  const [prefMap, setPrefMap] = useState({})

  useEffect(() => {
    if (!preferences) return

    if (!isEmpty(applications)) {
      const buildPrefMap = {}
      addLayeredValidation(applications).forEach((preference) => {
        buildPrefMap[`${preference.application_id}-${preference.preference_name}`] =
          preference.layered_validation
      })
      setPrefMap(buildPrefMap)
    }
  }, [applications, preferences])

  const prefMapLoading =
    listingType !== LISTING_TYPE_FIRST_COME_FIRST_SERVED &&
    !isEmpty(applications) &&
    prefMap &&
    isEmpty(prefMap)

  return (
    <>
      <LeaseUpApplicationsFilterContainer
        listingType={listingType}
        preferences={preferences}
        onSubmit={onFilter}
        loading={loading || prefMapLoading}
        bulkCheckboxesState={bulkCheckboxesState}
        onClearSelectedApplications={onClearSelectedApplications}
        onSelectAllApplications={onSelectAllApplications}
        onBulkLeaseUpStatusChange={(val) => onLeaseUpStatusChange(val, null, false)}
        onBulkLeaseUpCommentChange={(val) => onLeaseUpStatusChange(null, null, true)}
      />
      {!loading && !prefMapLoading && (
        <LeaseUpApplicationsTable
          dataSet={map(applications, buildRowData)}
          prefMap={prefMap}
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
    </>
  )
}

export default withContext(LeaseUpTableContainer)
