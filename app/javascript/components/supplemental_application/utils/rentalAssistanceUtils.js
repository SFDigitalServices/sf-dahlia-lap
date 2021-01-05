import { findIndex } from 'lodash'

import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'

export const isCreateAssistanceFormOpen = (assistanceRowsOpened) =>
  assistanceRowsOpened.has(NEW_ASSISTANCE_PSEUDO_ID)

export const convertIdToIndex = (rentalAssistances, rentalAssistanceId) => {
  const index = findIndex(rentalAssistances, (r) => r.id === rentalAssistanceId)
  return index === -1 ? rentalAssistances.length : index
}

export const convertIdsToIndices = (rentalAssistances, assistanceIds) =>
  new Set([...assistanceIds].map((id) => convertIdToIndex(rentalAssistances, id)))
