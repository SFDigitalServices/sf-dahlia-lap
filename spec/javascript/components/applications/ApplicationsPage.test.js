import React from 'react'

import { render, screen, act } from '@testing-library/react'
import moment from 'moment'

import ApplicationsPage from 'components/applications/ApplicationsPage'

import mockApplicationsPage from '../../fixtures/applications_page'
import listings from '../../fixtures/listings'

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return { records: mockApplicationsPage, pages: 1 }
    }
  }
})

describe('ApplicationsPage', () => {
  test('should render successfully', async () => {
    const { asFragment } = await act(async () => {
      return new Promise((resolve) => {
        resolve(render(<ApplicationsPage />))
      })
    })

    expect(asFragment()).toMatchSnapshot()
  })
  test('should display data correctly', async () => {
    await act(() => render(<ApplicationsPage listings={listings} />))

    expect(screen.queryAllByText(/200 buchanan \(alchemy by alta\)/i)).toBeTruthy()
    expect(
      screen.getAllByText(
        moment(mockApplicationsPage[0].listing.lottery_date, '').format('MM/DD/YYYY')
      )
    ).toBeTruthy()
  })
})
