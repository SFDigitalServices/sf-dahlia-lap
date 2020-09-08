import React from 'react'
import { shallow } from 'enzyme'
import LeaseUpSidebar, { ShowOrHideStatusesButton } from 'components/molecules/LeaseUpSidebar'
import LeaseUpSidebarButtons from 'components/molecules/LeaseUpSidebarButtons'
import StatusItems from 'components/molecules/StatusItems'
import { mockStatusItem, mockStatusItems, mockManyStatusItems } from '../../mocks/statusItemMock'

const getWrapper = (items, isLoading = false) => shallow(
  <LeaseUpSidebar
    statusItems={items}
    isLoading={isLoading}
  />
)

describe('LeaseUpSidebar', () => {
  describe('when not loading', () => {
    test('should render with empty status items correctly', () => {
      const wrapper = getWrapper([])
      // two sidebar buttons components, one for mobile, one for desktop
      expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual(null)
      expect(wrapper.find(StatusItems)).toHaveLength(0)
    })

    test('should render with a single status item correctly', () => {
      const wrapper = getWrapper([mockStatusItem()])
      expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Approved')
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('isLoading')).toBeFalsy()
      expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(1)
    })

    test('should render with multiple status items correctly', () => {
      const wrapper = getWrapper(mockStatusItems())
      expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Approved')
      expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(6)
    })

    test('should render with more than 4 status items correctly', () => {
      const wrapper = getWrapper(mockManyStatusItems(5))
      expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Approved')
      expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(5)
    })

    test('should render with lease signed status', () => {
      const wrapper = getWrapper([
        mockStatusItem({
          status: 'Lease Signed',
          substatus: null
        }),
        mockStatusItem()
      ])

      expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Lease Signed')
    })
  })

  describe('when loading', () => {
    test('should set the buttons to be loading', () => {
      const wrapper = getWrapper([mockStatusItem()], true)

      expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpSidebarButtons).first().prop('isLoading')).toBeTruthy()
    })
  })

  describe('show/hide full status list', () => {
    const numStatusItems = 10
    let wrapper

    beforeEach(() => {
      wrapper = getWrapper(mockManyStatusItems(numStatusItems))
    })

    test('should limit the statuses to 4 by default', () => {
      expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(numStatusItems)
      expect(wrapper.find(StatusItems).prop('limit')).toEqual(4)
    })

    test('should have no limit after show all statuses clicked', () => {
      wrapper.find(ShowOrHideStatusesButton).simulate('click')
      expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(numStatusItems)
      expect(wrapper.find(StatusItems).prop('limit')).toEqual(numStatusItems)
    })
  })

  describe('ShowOrHideStatusesButton', () => {
    test('renders properly when showingAllStatuses={false}', () => {
      const wrapper = shallow(<ShowOrHideStatusesButton showingAllStatuses={false} />)

      expect(wrapper.find('button').prop('type')).toEqual('button')
      expect(wrapper.find('button').text()).toEqual('Show all status updates')
    })

    test('renders properly when showingAllStatuses={true}', () => {
      const wrapper = shallow(<ShowOrHideStatusesButton showingAllStatuses />)

      expect(wrapper.find('button').prop('type')).toEqual('button')
      expect(wrapper.find('button').text()).toEqual('Show only recent status updates')
    })
  })

  describe('snapshot tests', () => {
    test('should match snapshot with 5 status items', () => {
      const wrapper = getWrapper(mockManyStatusItems(5))
      expect(wrapper).toMatchSnapshot()
    })
  })
})
