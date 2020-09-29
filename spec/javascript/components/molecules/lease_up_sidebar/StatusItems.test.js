import React from 'react'
import { shallow } from 'enzyme'
import { mockManyStatusItems, mockStatusItem, mockStatusItems } from '../../../mocks/statusItemMock'
import StatusItems from 'components/molecules/lease_up_sidebar/StatusItems'
import StatusItem from 'components/molecules/lease_up_sidebar/StatusItem'

const getWrapper = (items, limit = undefined, height = null) => shallow(
  <StatusItems
    statusItems={items}
    limit={limit}
    height={height}
  />
)

const TIMESTAMP_AUGUST_25_2020 = 1598338800
const TIMESTAMP_AUGUST_26_2020 = 1598400000

describe('StatusItems', () => {
  describe('snapshot tests', () => {
    test('should render empty status items correctly', () => {
      const wrapper = getWrapper([])
      expect(wrapper).toMatchSnapshot()
    })

    test('should render a single status item correctly', () => {
      const wrapper = getWrapper([mockStatusItem()])
      expect(wrapper).toMatchSnapshot()
    })

    test('should render multiple status items correctly', () => {
      const wrapper = getWrapper(mockStatusItems())
      expect(wrapper).toMatchSnapshot()
    })

    test('should render multiple status items with limit 0 correctly', () => {
      const wrapper = getWrapper(mockStatusItems(), 0)
      expect(wrapper).toMatchSnapshot()
    })

    test('should render multiple status items with limit 1 correctly', () => {
      const wrapper = getWrapper(mockStatusItems(), 1)
      expect(wrapper).toMatchSnapshot()
    })

    test('should render multiple status items with limit 100 correctly', () => {
      const wrapper = getWrapper(mockStatusItems(), 100)
      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should not set a height if height is not provided', () => {
    const wrapper = getWrapper(mockStatusItems(), 4)
    const styles = wrapper.find('.status-items').props().style
    expect(styles).toEqual({})
  })

  it('should limit the height of the list if provided', () => {
    const wrapper = getWrapper(mockStatusItems(), 4, '20rem')
    const styles = wrapper.find('.status-items').props().style
    expect(styles).toEqual({ height: '20rem', overflow: 'scroll' })
  })

  describe('with an empty status items list', () => {
    const statusItems = []

    test('should render no status items when no limit is specified', () => {
      expect(getWrapper(statusItems).find(StatusItem)).toHaveLength(0)
    })

    test('should render no status items when limit is 0', () => {
      expect(getWrapper(statusItems, 0).find(StatusItem)).toHaveLength(0)
    })

    test('should render no status items when limit is 1', () => {
      expect(getWrapper(statusItems, 1).find(StatusItem)).toHaveLength(0)
    })

    test('should render no status items when limit is 4', () => {
      expect(getWrapper(statusItems, 4).find(StatusItem)).toHaveLength(0)
    })
  })

  describe('with a single item in the status items list', () => {
    const statusItems = [mockStatusItem()]

    test('should render one status item when no limit is specified', () => {
      expect(getWrapper(statusItems).find(StatusItem)).toHaveLength(1)
    })

    test('should render no status items when limit is 0', () => {
      expect(getWrapper(statusItems, 0).find(StatusItem)).toHaveLength(0)
    })

    test('should render one status item when limit is 1', () => {
      expect(getWrapper(statusItems, 1).find(StatusItem)).toHaveLength(1)
    })

    test('should render one status item when limit is 4', () => {
      expect(getWrapper(statusItems, 4).find(StatusItem)).toHaveLength(1)
    })
  })

  describe('with five items in the status items list', () => {
    const statusItems = mockManyStatusItems(5)

    test('should render five status items when no limit is specified', () => {
      expect(getWrapper(statusItems).find(StatusItem)).toHaveLength(5)
    })

    test('should render no status items when limit is 0', () => {
      expect(getWrapper(statusItems, 0).find(StatusItem)).toHaveLength(0)
    })

    test('should render one status items when limit is 1', () => {
      expect(getWrapper(statusItems, 1).find(StatusItem)).toHaveLength(1)
    })

    test('should render four status items when limit is 4', () => {
      expect(getWrapper(statusItems, 4).find(StatusItem)).toHaveLength(4)
    })
  })

  describe('with two status items in chronological order', () => {
    const statusItems = [
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_25_2020 }),
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_26_2020 })
    ]

    test('should render status items in the order specified', () => {
      const statusItemsWrapper = getWrapper(statusItems).find(StatusItem)
      const firstStatusItem = statusItemsWrapper.first()
      const secondStatusItem = statusItemsWrapper.at(1)
      expect(firstStatusItem.prop('statusItem').timestamp).toEqual(TIMESTAMP_AUGUST_25_2020)
      expect(secondStatusItem.prop('statusItem').timestamp).toEqual(TIMESTAMP_AUGUST_26_2020)
    })
  })

  describe('with two status items not in chronological order', () => {
    const statusItems = [
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_26_2020 }),
      mockStatusItem({ timestamp: TIMESTAMP_AUGUST_25_2020 })
    ]

    test('should render status items in the order specified', () => {
      const statusItemsWrapper = getWrapper(statusItems).find(StatusItem)
      const firstStatusItem = statusItemsWrapper.first()
      const secondStatusItem = statusItemsWrapper.at(1)
      expect(firstStatusItem.prop('statusItem').timestamp).toEqual(TIMESTAMP_AUGUST_26_2020)
      expect(secondStatusItem.prop('statusItem').timestamp).toEqual(TIMESTAMP_AUGUST_25_2020)
    })
  })
})
