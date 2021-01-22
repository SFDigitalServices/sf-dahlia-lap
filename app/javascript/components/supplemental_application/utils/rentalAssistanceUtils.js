import { findIndex } from 'lodash'

import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'

export const isCreateAssistanceFormOpen = (assistanceRowsOpened) =>
  assistanceRowsOpened.has(NEW_ASSISTANCE_PSEUDO_ID)

/**
 * Given a rental assistance salesforce id, convert it to the index
 * of that assistance on the rental assistances array.
 */
export const convertIdToIndex = (rentalAssistances, rentalAssistanceId) => {
  const index = findIndex(rentalAssistances, (r) => r.id === rentalAssistanceId)
  return index === -1 ? rentalAssistances.length : index
}

/**
 * Convert rental assistance salesforce IDs to the indexes
 * of those ids in the rentalAssistances array.
 * @param {[RentalAssistanceObject]} rentalAssistances list of rental assistance objects
 * @param {[String]} assistanceIds list of Salesforce IDs
 */
export const convertIdsToIndices = (rentalAssistances, assistanceIds) =>
  new Set([...assistanceIds].map((id) => convertIdToIndex(rentalAssistances, id)))
