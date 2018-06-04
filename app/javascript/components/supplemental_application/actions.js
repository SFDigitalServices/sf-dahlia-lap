import { merge } from 'lodash'
import apiService from '~/apiService'
import SOQLToApi from '~/components/soqlToApiMappers'

export const updateApplicationAction = (application, values) => {
  const shortFormApplication = SOQLToApi.buildApplicationShape(application)
  const applicationUpdated = merge(shortFormApplication, {
    primaryApplicant: {
      maritalStatus: values.maritalStatus
    }
  })
  console.log(applicationUpdated)
  apiService.submitApplication(applicationUpdated)

  // apiService.submitApplication({
  //   id: application.id,
  //   primaryApplicant: {
  //     maritalStatus: values.maritalStatus
  //   }
  // })
}
