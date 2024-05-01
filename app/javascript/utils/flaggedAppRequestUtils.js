import { get, defaultTo } from 'lodash'

import apiService from 'apiService'

export const fetchAndMapFlaggedApplications = async (flagType) => {
  const response = await apiService.fetchFlaggedApplications(flagType)
  const flaggedRecords = response.flagged_records.map((flaggedRecord) => ({
    ...flaggedRecord,
    listing_name: defaultTo(get(flaggedRecord, 'listing.name'), null)
  }))
  return {
    title: response.title,
    flaggedRecords
  }
}

export const fetchAndMapFlaggedApplicationsByRecordSet = async (recordSetId) => {
  const response = await apiService.fetchFlaggedApplicationsByRecordSet(recordSetId)
  const flaggedRecords = response.flagged_records.map((flaggedRecord) => ({
    ...flaggedRecord,
    application: flaggedRecord.application.id,
    application_name: flaggedRecord.application.name,
    flagged_record_set_rule_name: flaggedRecord.flagged_record.rule_name,
    flagged_record_set_listing_lottery_status: flaggedRecord.flagged_record.listing.lottery_status
  }))
  return { flaggedRecords }
}
