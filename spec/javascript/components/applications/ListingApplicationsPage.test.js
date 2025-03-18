import React from 'react'

import { render, act, waitFor, screen } from '@testing-library/react'

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

  test('should render successfully', async () => {
    let renderResponse
    await act(async () => {
      renderResponse = render(<ListingApplicationsPage listing={listing} user_is_admin />)
    })

    waitFor(() => screen.getByText('Listing Details'))
    expect(renderResponse.asFragment()).toMatchSnapshot()
  })

  test('hides lottery results tab for non-admin users', () => {
    render(<ListingApplicationsPage listing={listing} user_is_admin={false} />)

    expect(screen.queryByText('Lottery Results')).not.toBeInTheDocument()
  })
})
