import { join, compact, filter, toPairs, map, forEach, isEmpty, merge, omit } from 'lodash'
import formOptions from '~/components/applications/application_form/formOptions'
import apiService from '~/apiService'
import domainToApi from '~/components/mappers/domainToApi'

const { adaPriorityValueToLabelMap } = formOptions

const assignDemographicData = (applicationData) => {
  merge(applicationData.primaryApplicant, applicationData.demographics)
  return applicationData
}

const formatPickList = (listData) => {
  const selectedPriorities = filter(toPairs(listData), ([a, b]) => b)
  return join(compact(map(selectedPriorities, ([a, b]) => adaPriorityValueToLabelMap[a])),';')
}

const formatAdaPriorities = (appData) => {
  let selected = appData.adaPrioritiesSelected
  appData.adaPrioritiesSelected = formatPickList(selected)
  return appData
}

const removeEmptyData = (applicationData) => {
  let fieldMap = ['alternateContact', 'adaPrioritiesSelected', 'demographics']
  forEach(fieldMap, (field) => {
    if (isEmpty(applicationData[field])) {
      applicationData = omit(applicationData, field)
    }
  })
  return applicationData
}

const prepareApplicationData = (submittedValues, application, listing) => {
  let applicationData = submittedValues
  applicationData.listingID = listing.id
  applicationData = assignDemographicData(applicationData)
  applicationData = removeEmptyData(applicationData)
  applicationData = formatAdaPriorities(applicationData)

  if (application) {
    applicationData["id"] = application.id
    applicationData["applicationSubmissionType"] = application.application_submission_type
  }

  return applicationData
}

export const saveApplication = async (submitType, submittedValues, application, listing) => {
  const applicationData = prepareApplicationData(submittedValues, application, listing)
  const response = await apiService.submitApplication(applicationData)

  if (response === false) {
    alert('There was an error on submit. Please check values and try again.')
  }
  try {
    if (submitType === 'Save') {
      window.location.href = '/applications/' + response.application.id
    } else {
      window.location.href = '/listings/' + listing.id + '/applications/new'
    }
  } catch(err) {
    console.log('Cannot use window.location.href')
  }

  return response
}
