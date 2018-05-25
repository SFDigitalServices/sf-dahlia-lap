import React from 'react'
import ListingsPage from 'components/listings/ListingsPage'
import factory from '../../factory'

describe('ListingsPage', () => {
  test('should render succesfully', () => {
    const results = factory.listingsList()
    const fields = factory.listingFields()

    const wrapper = mount(
      <ListingsPage results={results} fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
