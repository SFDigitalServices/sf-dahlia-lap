import React from 'react'
import ApplicationPage from 'components/applications/ApplicationPage'
import ApplicationFactory from '../../factories/applications'

describe('ApplicationPage', () => {
  test('should render succesfully', () => {
    const application = ApplicationFactory.validApplicationWithListing(1)
    const fields = {}
    const fileBaseUrl = ''

    const wrapper = mount(
      <ApplicationPage application={application} fields={fields}  file_base_url={fileBaseUrl}/>,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
