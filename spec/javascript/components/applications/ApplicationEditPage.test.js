import React from 'react'
import renderer from 'react-test-renderer';

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
// import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

import listing from '../../fixtures/listing'
import application from '../../fixtures/application'

describe('ApplicationNewPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    // const listing = modelsFactory.listing(1)
    // const application = modelsFactory.applicationWithApplicant(1)

    const wrapper = renderer.create(
      <ApplicationEditPage listing={listing} application={application} editPage={true} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
