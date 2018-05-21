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
      Id: 'listing1'
    }
  }

  const statusHistory = [
    { status: 'Approved', note: 'xxxx1', date:'11/11/18' }
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
