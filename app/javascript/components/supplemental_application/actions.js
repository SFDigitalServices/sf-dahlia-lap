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

  // console.log('updateApplicationAction')
  // return true
}

// export const updateApplicationPreferenceAction = async (preference) => {
//   console.log('updateApplicationPreferenceAction')
//   return true
// }


// applicationForApplicationPreference > save >
// update general application with new saved preference

// application global > save
// update applicationForApplicationPreference with new application
// ! it replaced current preferences array in applicationForApplicationPreference
//


// we save prefrences
