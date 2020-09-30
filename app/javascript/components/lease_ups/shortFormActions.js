import apiService from '~/apiService'

export const getShortFormApplication = async (applicationId) =>
  apiService.getShortFormApplication(applicationId)
