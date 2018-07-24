import React from 'react'
import renderer from 'react-test-renderer'

import ApplicationNewPage from 'components/applications/ApplicationNewPage'
import sharedHooks from '../../support/sharedHooks'

import listing from '../../fixtures/listing'

describe('ApplicationNewPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <ApplicationNewPage listing={listing} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
