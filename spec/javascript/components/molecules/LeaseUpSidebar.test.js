import React from 'react'
import { shallow } from 'enzyme'
import LeaseUpSidebar from 'components/molecules/LeaseUpSidebar'
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
  // This is a state that should never really occur.
  test('should render with empty status items correctly', () => {
    const wrapper = getWrapper([])
    // two sidebar buttons components, one for mobile, one for desktop
    expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
    expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual(null)
    expect(wrapper.find(StatusItems)).toHaveLength(1)
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()
  })

  test('should render with a single status item correctly', () => {
    const wrapper = getWrapper([mockStatusItem()])
    expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
    expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Approved')
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(1)
    expect(wrapper).toMatchSnapshot()
  })

  test('should render with multiple status items correctly', () => {
    const wrapper = getWrapper(mockStatusItems())
    expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
    expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Approved')
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(6)
    expect(wrapper).toMatchSnapshot()
  })

  test('should render with more than 4 status items correctly', () => {
    const wrapper = getWrapper(mockManyStatusItems(5))
    expect(wrapper.find(LeaseUpSidebarButtons)).toHaveLength(2)
    expect(wrapper.find(LeaseUpSidebarButtons).first().prop('status')).toEqual('Approved')
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(5)
    expect(wrapper).toMatchSnapshot()
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
    expect(wrapper).toMatchSnapshot()
  })

  describe('snapshot tests', () => {
    test('should match snapshot with 5 status items', () => {
      const wrapper = getWrapper(mockManyStatusItems(5))
      expect(wrapper).toMatchSnapshot()
    })
  })
})
