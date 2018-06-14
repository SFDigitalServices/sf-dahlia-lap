import { merge } from 'lodash'
import apiService from '~/apiService'
import SOQLToApi from '~/components/soqlToApiMappers'
import Alerts from '~/components/Alerts'

export const updateApplicationAction = async (application, values) => {
  const shortFormApplication = SOQLToApi.buildApplicationShape(application)
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
