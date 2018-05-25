import React from 'react'
import ApplicationEditPage from 'components/applications/ApplicationEditPage'

import factory from '../../factory'

describe('ApplicationNewPage', () => {
  test('should render succesfully', () => {
    const listing = factory.listing(1)
    const application = factory.applicationWithApplicant(1)

    const wrapper = mount(
      <ApplicationEditPage listing={listing} application={application} editPage={true} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
