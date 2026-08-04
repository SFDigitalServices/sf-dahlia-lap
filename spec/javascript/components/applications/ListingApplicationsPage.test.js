import React from 'react'

import { render, act, waitFor, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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
      renderResponse = render(
        <MemoryRouter>
          <ListingApplicationsPage listing={listing} user_is_admin />
        </MemoryRouter>
      )
    })

    waitFor(() => screen.getByText('Listing Details'))
    expect(renderResponse.asFragment()).toMatchSnapshot()
  })

  test('hides lottery results tab for non-admin users', () => {
    render(
      <MemoryRouter>
        <ListingApplicationsPage listing={listing} user_is_admin={false} />
      </MemoryRouter>
    )

    expect(screen.queryByText('Lottery Results')).not.toBeInTheDocument()
  })
})
