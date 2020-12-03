import {
  ACTION_SUPP_APPLICATION_LOADED,
  ACTION_SET_CURRENT_APPLICATION,
  ACTION_SET_CURRENT_LISTING
} from 'stores/LeaseUpReducer'

const formatListingStateData = (listing) => ({
  id: listing?.id,
  name: listing?.name,
  buildingAddress: listing?.building_street_address
})

const formatApplicationStateData = (id, number, applicantFirstName, applicantLastName) => ({
  id,
  number,
  applicantFirstName,
  applicantLastName
})

export const onSupplementalPageLoaded = (dispatch, application, listing) => {
  dispatch({
    type: ACTION_SUPP_APPLICATION_LOADED,
    data: {
      application: formatApplicationStateData(
        application?.id,
        application?.name,
        application?.applicant?.first_name,
        application?.applicant?.last_name
      ),
      listing: formatListingStateData(listing)
    }
  })
}

export const onApplicationPageLoaded = (dispatch, application, listing) => {
  dispatch({
    type: ACTION_SUPP_APPLICATION_LOADED,
    data: {
      application: formatApplicationStateData(
        application?.id,
        application?.name,
        application?.applicant?.first_name,
        application?.applicant?.last_name
      ),
      listing: formatListingStateData(listing)
    }
  })
}

export const onApplicationsPageLoaded = (dispatch, listing) =>
  dispatch({
    type: ACTION_SET_CURRENT_LISTING,
    data: formatListingStateData(listing)
  })

export const onListingRowClicked = (dispatch, listing) => {
  dispatch({
    type: ACTION_SET_CURRENT_LISTING,
    data: {
      listing: formatListingStateData(listing)
    }
  })
}

export const onApplicationRowClicked = (dispatch, application) =>
  dispatch({
    type: ACTION_SET_CURRENT_APPLICATION,
    data: formatApplicationStateData(
      application?.application_id,
      application?.application_number,
      application?.first_name,
      application?.last_name
    )
  })
