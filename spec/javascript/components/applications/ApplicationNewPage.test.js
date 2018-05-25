import React from 'react'
import ApplicationNewPage from 'components/applications/ApplicationNewPage'

import factory from '../../factory'
import sharedHooks from '../../support/sharedHooks'

describe('ApplicationNewPage', () => {
  sharedHooks.useFakeTimers()
  
  test('should render succesfully', () => {
    const listing = factory.validListing(1)

    const wrapper = mount(
      <ApplicationNewPage listing={listing} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
