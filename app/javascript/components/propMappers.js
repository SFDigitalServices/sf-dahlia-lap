
export const mapListing = (listing) => {
  if (!listing)
    return null
  else {
    return {
      id: listing.Id,
      name: listing.Name,
      lottery_date: listing.Lottery_Date
    }
  }
}

export const mapApplication = (application) => {
  return {
    id: application.Id,
    number: application.Name,
    name: application.Applicant ? application.Applicant.Name: '',
    isLotterComplete: application.Is_Lottery_Complete,
    submissionType: application.Application_Submission_Type,
    listing: mapListing(application.Listing),
  }
}
