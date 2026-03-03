export const formatListingStateData = (listing) => ({
  id: listing?.id,
  name: listing?.name,
  buildingAddress: listing?.building_street_address,
  program_type: listing?.program_type
})

export const formatApplicationStateData = (id, number, applicantFullName) => ({
  id,
  number,
  applicantFullName
})

const getFullName = (first, middle, last) => [first, middle, last].filter((x) => !!x).join(' ')

const getFullNameFromApplicant = (applicant) => {
  if (!applicant) return undefined

  const { name, first_name, middle_name, last_name } = applicant

  if (name) return name

  return getFullName(first_name, middle_name, last_name)
}

const getFullNameFromApplication = (application) => {
  if (!application) return undefined

  const { first_name, middle_name, last_name } = application

  return getFullName(first_name, middle_name, last_name)
}

export const getSupplementalBreadcrumbData = (application, listing) => ({
  application: formatApplicationStateData(
    application?.id,
    application?.name,
    getFullNameFromApplicant(application?.applicant)
  ),
  listing: formatListingStateData(listing)
})

export const getApplicationRowClickedBreadcrumbData = (application) =>
  formatApplicationStateData(
    application?.application_id,
    application?.application_number,
    getFullNameFromApplication(application)
  )
