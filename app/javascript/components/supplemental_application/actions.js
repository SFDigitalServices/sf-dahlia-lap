import { merge } from 'lodash'
import apiService from '~/apiService'
// import soqlToApi from '~/components/mappers/soqlToApi'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'

export const updateApplicationAction = async (application) => {
  // const updateApplicationDomain = merge(application, values)
  const applicationApi = domainToApi.buildApplicationShape(application)

  // console.log(application)
  // console.log(applicationApi)
  console.log(applicationApi)

  const response = await apiService.submitApplication(applicationApi)
  if (response === false) {
    Alerts.error()
  }
  return response

  // console.log(values)

  // const shortFormApplication = soqlToApi.buildApplicationShape(application)
  // const updatedApplication = merge(shortFormApplication, {
  //   primaryApplicant: {
  //     maritalStatus: values.applicant.marital_status
  //   },
  //   numberOfDependents: values.number_of_dependents
  // })
  //
  // let response = await apiService.submitApplication(updatedApplication)
  // if (response === false) {
  //   Alerts.error()
  // }
  //
  // return response
}
