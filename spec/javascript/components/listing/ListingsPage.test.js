import React from 'react'
import ListingPage from 'components/listings/ListingPage'
import factory from '../../factory'

describe('ListingsPage', () => {
  test('should render succesfully', () => {
    const listing = factory.listing(1)

    const wrapper = mount(
      <ListingPage listing={listing}/>,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
