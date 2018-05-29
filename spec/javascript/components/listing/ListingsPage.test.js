import React from 'react'
import renderer from 'react-test-renderer';

import ListingPage from 'components/listings/ListingPage'
import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

describe('ListingsPage', () => {
  sharedHooks.useFakeTimers()
  test('should render succesfully', () => {
    const listing = modelsFactory.listing(1)

    const wrapper = renderer.create(
      <ListingPage listing={listing}/>,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
