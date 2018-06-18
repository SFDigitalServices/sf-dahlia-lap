import React from 'react'
import renderer from 'react-test-renderer';

import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

import ListingPage from 'components/listings/ListingPage'
import ListingDetailsContentCard from 'components/listings/ListingDetailsContentCard'
import { detailsFields } from 'components/listings/fields'
import { mapListingDetails } from '~/components/propMappers'

describe('ListingPage', () => {
  sharedHooks.useFakeTimers()
  test('should render succesfully', () => {
    const listing = modelsFactory.listingDetail()

    const wrapper = renderer.create(
      <ListingPage listing={listing}/>,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })

  test.only('Details fields', () => {
    const listing = modelsFactory.listingDetail()
    const wrapper = renderer.create(
      <ListingDetailsContentCard
        listing={mapListingDetails(listing)}
        title='Details'
        fields={detailsFields} />
    )
    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
