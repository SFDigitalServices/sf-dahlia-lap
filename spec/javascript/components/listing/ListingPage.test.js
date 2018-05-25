import React from 'react'
import ListingsPage from 'components/listings/ListingsPage'
import modelsFactory from '../../factories/models'

describe('ListingsPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.listingsList()
    const fields = modelsFactory.listingFields()

    const wrapper = mount(
      <ListingsPage results={results} fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
