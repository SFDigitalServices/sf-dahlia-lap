import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import StatusHistoryContainer from 'components/molecules/lease_up_sidebar/StatusHistoryContainer'

import { mockManyStatusItems, mockStatusItem } from '../../../mocks/statusItemMock'

const getScreen = (items) => render(<StatusHistoryContainer statusItems={items} />)

describe('StatusHistoryContainer', () => {
  test('should render with empty status items correctly', () => {
    getScreen([])
    expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
  })

  test('should render with a single status item correctly', () => {
    getScreen([mockStatusItem()])
    expect(screen.getAllByTestId('status-item')).toHaveLength(1)
  })

  test('should render with more than 4 status items correctly', () => {
    getScreen(mockManyStatusItems(5))
    expect(screen.getAllByTestId('status-item')).toHaveLength(4)
    // Click the show all statuses button
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getAllByTestId('status-item')).toHaveLength(5)
  })

  describe('show/hide full status list', () => {
    describe('when over four items are present', () => {
      const numStatusItems = 10
      let showAllStatusesButton

      beforeEach(() => {
        getScreen(mockManyStatusItems(numStatusItems))
        showAllStatusesButton = screen.getByRole('button')
      })

      test('should limit the statuses to 4 by default', () => {
        expect(screen.getAllByTestId('status-item')).toHaveLength(4)
      })

      test('should have no limit after show all statuses clicked', () => {
        fireEvent.click(showAllStatusesButton)
        expect(screen.getAllByTestId('status-item')).toHaveLength(numStatusItems)
      })

      test('should have correct link text before click', () => {
        expect(screen.getByText('Show all status updates')).toBeInTheDocument()
      })

      test('should have correct link text after click', () => {
        fireEvent.click(showAllStatusesButton)
        expect(screen.getByText('Show only recent status updates')).toBeInTheDocument()
      })
    })

    describe('when four or under items are present', () => {
      test('should not show the show/hide statuses link with exactly 4 items', () => {
        getScreen(mockManyStatusItems(4))
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })

      test('should not show the show/hide statuses link with 1 item', () => {
        getScreen(mockManyStatusItems(1))
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })
    })
  })
})
