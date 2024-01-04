import React from 'react'

import { render } from '@testing-library/react'

import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'

import mockApplicationsPage from '../../fixtures/applications_page'

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return mockApplicationsPage
    }
  }
})

describe('ListingApplicationsPage', () => {
  const listing = {
    id: 'listingId',
    name: 'listing name',
    lottery_date: '2017-03-22T18:00:00.000+0000'
  }

  test('should render successfully', () => {
    const { asFragment } = render(<ListingApplicationsPage listing={listing} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
