import { get, defaultTo } from 'lodash'

import apiService from 'apiService'
import appPaths from 'utils/appPaths'

export const saveApplication = async (submitType, submittedValues, listing, editPage) => {
  const response = await apiService.submitApplication(submittedValues)

  if (!response) {
    window.alert(
      'An error has occurred. Please try to save again. Contact MOHCD if you still have problems.'
    )
    return response
  }

  if (submitType === 'Save') {
    window.location.href = appPaths.toApplication(response.id, !editPage)
  } else {
    window.location.href = appPaths.toApplicationNew(listing.id)
  }
  return response
}

export const fetchApplications = async (page, { filters }) => {
  const response = await apiService.fetchApplications({ page, filters })
  return {
    records: response.records,
    pages: response.pages
  }
}

export const fetchFlaggedApplications = async (type) => {
  const response = await apiService.fetchFlaggedApplications(type)
  const flaggedRecords = response.flagged_records.map((flaggedRecord) => ({
    ...flaggedRecord,
    listing_name: defaultTo(get(flaggedRecord, 'listing.name'), null)
  }))
  return {
    title: response.title,
    flaggedRecords
  }
}

export const fetchFlaggedApplicationsByRecordSet = async (recordSetId) => {
  const response = await apiService.fetchFlaggedApplicationsByRecordSet(recordSetId)
  const flaggedRecords = response.flagged_records.map((flaggedRecord) => ({
    ...flaggedRecord,
    application: flaggedRecord.application.id,
    application_name: flaggedRecord.application.name,
    flagged_record_set_rule_name: flaggedRecord.flagged_record.rule_name,
    flagged_record_set_listing_lottery_status:
      flaggedRecord.flagged_record.listing.lottery_status
  }))
  return { flaggedRecords }
}