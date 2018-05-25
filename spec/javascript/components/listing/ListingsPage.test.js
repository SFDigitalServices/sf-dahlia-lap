import React from 'react'
import ListingPage from 'components/listings/ListingPage'
import modelsFactory from '../../factories/models'

describe('ListingsPage', () => {
  test('should render succesfully', () => {
    const listing = modelsFactory.listing(1)

    const wrapper = mount(
      <ListingPage listing={listing}/>,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
