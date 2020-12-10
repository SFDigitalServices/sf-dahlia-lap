import React from 'react'

import renderer from 'react-test-renderer'

import LeaseUpListingsTable from 'components/lease_ups/LeaseUpListingsTable'

import modelsFactory from '../../factories/models'

describe('LeaseUpListingsTable', () => {
  const listing = modelsFactory.listingDetail()

  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <LeaseUpListingsTable listings={[listing]} onCellClick={jest.fn()} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
