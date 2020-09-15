import { isEmpty } from 'lodash'

export const isSingleRentalAssistanceValid = (form, rentalAssistanceIndex) => {
  const assistanceErrors = form.getState().errors.rental_assistances
  return isEmpty(assistanceErrors) || isEmpty(assistanceErrors[rentalAssistanceIndex])
}

export const areAllRentalAssistancesValid = (form) => {
  const assistanceErrors = form.getState().errors.rental_assistances
  return assistanceErrors.every(isEmpty)
}

export const areLeaseAndRentalAssistancesValid = (form) => {
  const leaseErrors = form.getState().errors.lease
  return isEmpty(leaseErrors) && areAllRentalAssistancesValid(form)
}
