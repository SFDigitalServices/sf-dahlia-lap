import React from 'react'
import renderer from 'react-test-renderer';

import ApplicationPage from 'components/applications/ApplicationPage'
import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

describe('ApplicationPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    const application = modelsFactory.applicationWithListing(1)
    const fields = {}
    const fileBaseUrl = ''

    const wrapper = renderer.create(
      <ApplicationPage application={application} fields={fields}  file_base_url={fileBaseUrl}/>,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
