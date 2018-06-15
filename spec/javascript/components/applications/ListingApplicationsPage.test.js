import React from 'react'
import renderer from 'react-test-renderer';

import modelsFactory from '../../factories/models'
import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'

describe('ListingApplicationsPage', () => {
  test('should render succesfully', () => {
    const results = [
      {"Id":"a0o0x000000OcOzAAK","Name":"APP-00191270","Listing.Name":"Test 5/30","Listing.Lottery_Date":null,"Applicant.First_Name":"karen","Applicant.Last_Name":"jones","Application_Submitted_Date":"05/30/18","Total_Household_Size":0,"Application_Submission_Type":"Electronic"},
      {"Id":"a0o0x000000OkHSAA0","Name":"APP-00192942","Listing.Name":"Test 5/30","Listing.Lottery_Date":null,"Applicant.First_Name":"Grace","Applicant.Last_Name":"Jones","Application_Submitted_Date":"06/12/18","Total_Household_Size":0,"Application_Submission_Type":"Electronic"}
    ]

    const fields = {"Id":null,"Name":{"label":"Application Number"},"Listing.Name":{"label":"Listing Name"},"Listing.Lottery_Date":{"label":"Lottery Date"},"Applicant.First_Name":null,"Applicant.Last_Name":null,"Application_Submitted_Date":{"type":"date"},"Total_Household_Size":null,"Application_Submission_Type":{"editable":true,"editable_options":["Electronic","Paper"]}}

    const listing = { Id: 1, Name: 'xxxxListing' }

    const wrapper = renderer.create(
      <ListingApplicationsPage
        listing={listing}
        results={results}
        fields={fields} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
