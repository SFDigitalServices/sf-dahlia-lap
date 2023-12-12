import React from 'react'

import { fireEvent, render, screen, waitFor, act, within } from '@testing-library/react'

import StatusHistoryPopover from 'components/organisms/StatusHistoryPopover'

import { mockManyStatusItems } from '../../mocks/statusItemMock'

const mockGetFieldUpdateComments = jest.fn()
const APP_ID = 'app_id'
const APP_ID_MANY_ITEMS = 'app_id_many_items'

jest.mock('apiService', () => {
  return {
    getFieldUpdateComments: async (applicationId) => {
      mockGetFieldUpdateComments(applicationId)
      // Can't use const for id here because mock cannot use out of scope variables.
      return applicationId === 'app_id_many_items' ? mockManyStatusItems(5) : mockManyStatusItems(2)
    }
  }
})

const getScreen = (appId) => render(<StatusHistoryPopover applicationId={appId} />)

describe('StatusHistoryPopover', () => {
  describe('when there are fewer than 4 status items', () => {
    let rtlWrapper
    beforeEach(async () => {
      rtlWrapper = getScreen(APP_ID)
      act(() => {
        fireEvent.click(screen.getByRole('button'))
      })
      // This ensures that the state update has completed before moving on
      // eslint-disable-next-line jest/no-standalone-expect
      await waitFor(() => expect(mockGetFieldUpdateComments).toHaveBeenCalled())
    })

    test('it matches snapshot when open', async () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })

    test("it loads status history data when data isn't present", async () => {
      expect(mockGetFieldUpdateComments).toHaveBeenCalledTimes(1)
    })

    test('it only fetches status history on first click', async () => {
      // Click again and make sure history items aren't fetched again

      act(() => {
        fireEvent.click(screen.getByRole('button'))
      })
      // This ensures that the state update has completed before moving on
      // eslint-disable-next-line jest/no-standalone-expect
      await waitFor(() => expect(mockGetFieldUpdateComments).toHaveBeenCalledTimes(1))
    })

    test('does not render the show/hide status toggler', async () => {
      expect(within(screen.getByTestId('loading')).queryByRole('button')).not.toBeInTheDocument()
    })

    test('does not set a fixed height for status items', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })
  describe('when there are more than 4 status items', () => {
    let rtlWrapper
    beforeEach(async () => {
      rtlWrapper = getScreen(APP_ID_MANY_ITEMS)
      act(() => {
        fireEvent.click(screen.getByRole('button'))
      })
      // This ensures that the state update has completed before moving on
      // eslint-disable-next-line jest/no-standalone-expect
      await waitFor(() => expect(mockGetFieldUpdateComments).toHaveBeenCalled())
    })

    test('renders a show/hide link that shows and hides status items', async () => {
      expect(screen.getByText('Show all status updates')).toBeInTheDocument()
      expect(screen.getAllByTestId('status-item')).toHaveLength(4)
      fireEvent.click(
        screen.getByRole('button', {
          name: /show all status updates/i
        })
      )
      expect(screen.getAllByTestId('status-item')).toHaveLength(5)
      expect(
        screen.getByRole('button', {
          name: /show only recent status updates/i
        })
      ).toBeInTheDocument()
    })

    test('sets a fixed height for the status items component', async () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })
})
