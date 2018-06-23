import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'
import Alerts from '~/components/Alerts'



export const updateApplicationAction = async (application) => {
  const applicationApi = domainToApi.buildApplicationShape(application)
  const response = await apiService.submitApplication(applicationApi)
  if (response === false) {
    Alerts.error()
  }
  return response

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
