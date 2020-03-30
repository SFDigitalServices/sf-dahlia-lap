import React from 'react'
import renderer from 'react-test-renderer'
import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'

const applications = [
  {
    'Id': 'a0o0x000000OcOzAAK',
    'Name': 'APP-00191270',
    'Application_Submitted_Date': '05/30/18',
    'Total_Household_Size': 0,
    'Application_Submission_Type': 'Electronic',
    'ListingId': 'listingId',
    'Applicant': {
      'First_Name': 'karen',
      'Last_Name': 'jones'
    }
  },
  {
    'Id': 'a0o0x000000OkHSAA0',
    'Name': 'APP-00192942',
    'Application_Submitted_Date': '06/12/18',
    'Total_Household_Size': 0,
    'Application_Submission_Type': 'Electronic',
    'ListingId': 'listingId',
    'Applicant': {
      'First_Name': 'Grace',
      'Last_Name': 'Jones'
    }
  }
]

describe('ListingApplicationsPage', () => {
  test('should render succesfully', () => {
    const listing = { id: 'listingId', name: 'listing name', lottery_date: '2017-03-22T18:00:00.000+0000' }

    const wrapper = renderer.create(
      <ListingApplicationsPage
        listing={listing}
        applications={applications} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
