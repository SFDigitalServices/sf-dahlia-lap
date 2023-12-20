import React from 'react'

import { render } from '@testing-library/react'

import LeaseUpListingsTable from 'components/lease_ups/LeaseUpListingsTable'

import modelsFactory from '../../factories/models'

describe('LeaseUpListingsTable', () => {
  const listing = modelsFactory.listingDetail()

  test('should render succesfully', () => {
    const { asFragment } = render(
      <LeaseUpListingsTable listings={[listing]} onCellClick={jest.fn()} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
