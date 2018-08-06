import React from 'react'
import renderer from 'react-test-renderer';

import ListingsPage from 'components/listings/ListingsPage'
import modelsFactory from '../../factories/models'
import listings from '../../fixtures/listings'

describe('ListingsPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.listingsList()
    const fields = modelsFactory.listingFields()

    const wrapper = renderer.create(
      <ListingsPage listings={results} fields={fields} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })


  test('should render succesfully long list', () => {
    const fields = modelsFactory.listingFields()
    const wrapper = renderer.create(
      <ListingsPage listings={listings} fields={fields} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
