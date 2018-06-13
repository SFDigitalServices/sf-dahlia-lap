import apiService from '~/apiService'

export const fetchApplicationsWithEagerPagination = ({ page }) {
  const actualPage = page

  return apiService.fetchApplications({ page:  })
}
