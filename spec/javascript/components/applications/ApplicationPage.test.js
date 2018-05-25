import React from 'react'

import ApplicationPage from 'components/applications/ApplicationPage'
import factory from '../../factory'
import sharedHooks from '../../support/sharedHooks'

describe('ApplicationPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    const application = factory.validApplicationWithListing(1)
    const fields = {}
    const fileBaseUrl = ''

    const wrapper = mount(
      <ApplicationPage application={application} fields={fields}  file_base_url={fileBaseUrl}/>,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
