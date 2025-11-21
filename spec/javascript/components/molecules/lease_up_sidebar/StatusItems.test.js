import React from 'react'

import { render, within, screen } from '@testing-library/react'
import moment from 'moment-timezone'

import StatusItems from 'components/molecules/lease_up_sidebar/StatusItems'

import { mockManyStatusItems, mockStatusItem, mockStatusItems } from '../../../mocks/statusItemMock'

const getScreen = (items, limit = undefined, height = null) =>
  render(<StatusItems statusItems={items} limit={limit} height={height} />)

const TIMESTAMP_AUGUST_25_2020 = 1756130400
const TIMESTAMP_AUGUST_26_2020 = 1756191600

describe('StatusItems', () => {
  describe('snapshot tests', () => {
    test('should render empty status items correctly', () => {
      const { asFragment } = getScreen([])
      expect(asFragment()).toMatchSnapshot()
    })

    test('should render a single status item correctly', () => {
      const { asFragment } = getScreen([mockStatusItem()])
      expect(asFragment()).toMatchSnapshot()
    })

    test('should render multiple status items correctly', () => {
      const { asFragment } = getScreen(mockStatusItems())
      expect(asFragment()).toMatchSnapshot()
    })

    test('should render multiple status items with limit 0 correctly', () => {
      const { asFragment } = getScreen(mockStatusItems(), 0)
      expect(asFragment()).toMatchSnapshot()
    })

    test('should render multiple status items with limit 1 correctly', () => {
      const { asFragment } = getScreen(mockStatusItems(), 1)
      expect(asFragment()).toMatchSnapshot()
    })

    test('should render multiple status items with limit 100 correctly', () => {
      const { asFragment } = getScreen(mockStatusItems(), 100)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('should not set a height if height is not provided', () => {
    const { asFragment } = getScreen(mockStatusItems(), 4)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should limit the height of the list if provided', () => {
    const { asFragment } = getScreen(mockStatusItems(), 4, '20rem')
    expect(asFragment()).toMatchSnapshot()
  })

  describe('with an empty status items list', () => {
    const statusItems = []

    test('should render no status items when no limit is specified', () => {
      getScreen(statusItems)
      expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
    })

    test('should render no status items when limit is 0', () => {
      getScreen(statusItems)
      expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
    })

    test('should render no status items when limit is 1', () => {
      getScreen(statusItems, 1)
      expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
    })

    test('should render no status items when limit is 4', () => {
      getScreen(statusItems, 4)
      expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
    })
  })

  describe('with a single item in the status items list', () => {
    const statusItems = [mockStatusItem()]

    test('should render one status item when no limit is specified', () => {
      getScreen(statusItems)
      expect(screen.getByTestId('status-item')).toBeInTheDocument()
    })

    test('should render no status items when limit is 0', () => {
      getScreen(statusItems, 0)
      expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
    })

    test('should render one status item when limit is 1', () => {
      getScreen(statusItems, 1)
      expect(screen.getByTestId('status-item')).toBeInTheDocument()
    })

    test('should render one status item when limit is 4', () => {
      getScreen(statusItems, 4)
      expect(screen.getByTestId('status-item')).toBeInTheDocument()
    })
  })

  describe('with five items in the status items list', () => {
    const statusItems = mockManyStatusItems(5)

    test('should render five status items when no limit is specified', () => {
      getScreen(statusItems)
      expect(screen.getAllByTestId('status-item')).toHaveLength(5)
    })

    test('should render no status items when limit is 0', () => {
      getScreen(statusItems, 0)
      expect(screen.queryByTestId('status-item')).not.toBeInTheDocument()
    })

    test('should render one status items when limit is 1', () => {
      getScreen(statusItems, 1)
      expect(screen.getByTestId('status-item')).toBeInTheDocument()
    })

    test('should render four status items when limit is 4', () => {
      getScreen(statusItems, 4)
      expect(screen.getAllByTestId('status-item')).toHaveLength(4)
    })
  })

  describe('with two status items in chronological order', () => {
    const mockStatusItems = [
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_25_2020 }),
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_26_2020 })
    ]
    test('should render status items in the order specified', () => {
      getScreen(mockStatusItems)
      const statusItems = screen.getAllByTestId('status-item')
      const firstStatusItem = statusItems[0]
      const secondStatusItem = statusItems[1]
      expect(
        within(firstStatusItem).getByText(
          moment
            .unix(TIMESTAMP_AUGUST_25_2020)
            .tz('America/Los_Angeles')
            .format('MMM D, YYYY h:mm A z')
        )
      ).toBeInTheDocument()
      expect(
        within(secondStatusItem).getByText(
          moment
            .unix(TIMESTAMP_AUGUST_26_2020)
            .tz('America/Los_Angeles')
            .format('MMM D, YYYY h:mm A z')
        )
      ).toBeInTheDocument()
    })
  })

  describe('with two status items not in chronological order', () => {
    const mockStatusItems = [
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_26_2020 }),
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_25_2020 })
    ]

    test('should render status items in the order specified', () => {
      getScreen(mockStatusItems)
      const statusItems = screen.getAllByTestId('status-item')
      const firstStatusItem = statusItems[0]
      const secondStatusItem = statusItems[1]
      expect(
        within(firstStatusItem).getByText(
          moment
            .unix(TIMESTAMP_AUGUST_26_2020)
            .tz('America/Los_Angeles')
            .format('MMM D, YYYY h:mm A z')
        )
      ).toBeInTheDocument()
      expect(
        within(secondStatusItem).getByText(
          moment
            .unix(TIMESTAMP_AUGUST_25_2020)
            .tz('America/Los_Angeles')
            .format('MMM D, YYYY h:mm A z')
        )
      ).toBeInTheDocument()
    })
  })
})
