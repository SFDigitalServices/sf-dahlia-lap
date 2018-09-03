import React from 'react'
import renderer from 'react-test-renderer'

import ApplicationPage from 'components/applications/ApplicationPage'
import sharedHooks from '../../support/sharedHooks'
import application from '../../fixtures/application'

describe('ApplicationPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    const fileBaseUrl = 'http:/www.someurl.com'

    const wrapper = renderer.create(
      <ApplicationPage
        application={application}
        file_base_url={fileBaseUrl} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
