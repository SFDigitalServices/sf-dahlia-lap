import React from 'react'
import ApplicationNewPage from 'components/applications/ApplicationNewPage'

import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

describe('ApplicationNewPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    const listing = modelsFactory.listing(1)

    const wrapper = mount(
      <ApplicationNewPage listing={listing} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
