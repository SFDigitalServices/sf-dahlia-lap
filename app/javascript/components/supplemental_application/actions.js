import { merge } from 'lodash'
import apiService from '~/apiService'
import soqlToApi from '~/components/mappers/soqlToApi'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'

export const updateApplicationAction = async (application, values) => {
  const updateApplicationDomain = merge(application, values)
  const applicationApi = domainToApi.buildApplicationShape(updateApplicationDomain)
  let response = await apiService.submitApplication(applicationApi)
  if (response === false) {
    Alerts.error()
  }
  return response


  // const shortFormApplication = soqlToApi.buildApplicationShape(application)
  // const updatedApplication = merge(shortFormApplication, {
  //   primaryApplicant: {
  //     maritalStatus: values.maritalStatus
  //   },
  //   numberOfDependents: values.dependents
  // })
  //
  // let response = await apiService.submitApplication(updatedApplication)
  // if (response === false) {
  //   Alerts.error()
  // }
  //
  // return response
}
