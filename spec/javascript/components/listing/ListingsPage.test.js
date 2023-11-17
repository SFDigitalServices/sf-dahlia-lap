import React from 'react'

import { render } from '@testing-library/react'

import ListingsPage from 'components/listings/ListingsPage'

import modelsFactory from '../../factories/models'
import listings from '../../fixtures/listings'

describe('ListingsPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.listingsList()
    const fields = modelsFactory.listingFields()

    const { asFragment } = render(<ListingsPage listings={results} fields={fields} />)

    expect(asFragment()).toMatchSnapshot()
  })

  test('should render succesfully long list', () => {
    const fields = modelsFactory.listingFields()
    const { asFragment } = render(<ListingsPage listings={listings} fields={fields} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
