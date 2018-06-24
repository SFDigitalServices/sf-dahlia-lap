import React from 'react'
import renderer from 'react-test-renderer';

import ApplicationNewPage from 'components/applications/ApplicationNewPage'
// import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

import listing from '../../fixtures/listing'

describe('ApplicationNewPage', () => {
  sharedHooks.useFakeTimers()

  test('should render succesfully', () => {
    // const listing = modelsFactory.listing(1)
    console.log(listing.Listing_Lottery_Preferences)  
    listing.Listing_Lottery_Preferences = []

    const wrapper = renderer.create(
      <ApplicationNewPage listing={listing} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
