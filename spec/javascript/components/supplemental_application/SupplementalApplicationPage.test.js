import React from 'react'
import renderer from 'react-test-renderer'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'

describe('SupplementalApplicationPage', () => {
  const application = {
    Id: 'xxx1',
    Name: 'name',
    Applicant: {
      Name: 'applicant name'
    },
    Listing: {
      Id: 'listing1',
      Name: 'listingName'
    }
  }

  const statusHistory = [
    { Processing_Status: 'Approved', Processing_Comment: 'xxxx1', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' },
    { Processing_Status: 'Pending', Processing_Comment: 'xxxx2', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' }
  ]

  test('it should render correctly without status history', () => {
    const component = renderer.create(
      <SupplementalApplicationPage
        application={application}/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  test('it should render correctly with status history', () => {
    const component = renderer.create(
      <SupplementalApplicationPage
        application={application}
        statusHistory={statusHistory}/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
