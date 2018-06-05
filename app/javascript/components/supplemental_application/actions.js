import { merge } from 'lodash'
import apiService from '~/apiService'
import SOQLToApi from '~/components/soqlToApiMappers'
import Alerts from '~/components/Alerts'

export const updateApplicationAction = async (application, values) => {
  const shortFormApplication = SOQLToApi.buildApplicationShape(application)
  const applicationUpdated = merge(shortFormApplication, {
    primaryApplicant: {
      maritalStatus: values.maritalStatus
    }
  })

  let response = await apiService.submitApplication(applicationUpdated)
  if (response == false) {
    Alerts.info('Ups. Could not save form.')
  }
}
