import { merge } from 'lodash'
import apiService from '~/apiService'
import soqlToApi from '~/components/mappers/soqlToApi'
import Alerts from '~/components/Alerts'

export const updateApplicationAction = async (application, values) => {
  const shortFormApplication = soqlToApi.buildApplicationShape(application)
  const updatedApplication = merge(shortFormApplication, {
    primaryApplicant: {
      maritalStatus: values.maritalStatus
    },
    numberOfDependents: values.dependents
  })

  let response = await apiService.submitApplication(updatedApplication)
  if (response === false) {
    Alerts.error()
  }

  return response
}
