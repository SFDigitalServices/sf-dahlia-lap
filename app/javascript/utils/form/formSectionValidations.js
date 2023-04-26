import { isEmpty } from 'lodash'

export const isSingleRentalAssistanceValid = (form, rentalAssistanceIndex) => {
  const assistanceErrors = form.getState().errors.rental_assistances
  return isEmpty(assistanceErrors) || isEmpty(assistanceErrors[rentalAssistanceIndex])
}

export const isLeaseValid = (form) => {
  const leaseErrors = form.getState().errors.lease
  return isEmpty(leaseErrors)
}

export const areAllRentalAssistancesValid = (form) => {
  const assistanceErrors = form.getState().errors.rental_assistances
  return isEmpty(assistanceErrors) || assistanceErrors.every(isEmpty)
}

export const areLeaseAndRentalAssistancesValid = (form) => {
  return isLeaseValid(form) && areAllRentalAssistancesValid(form)
}
