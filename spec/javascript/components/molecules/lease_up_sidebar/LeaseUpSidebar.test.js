import React from 'react'
import { shallow } from 'enzyme'
import LeaseUpSidebar from 'components/molecules/lease_up_sidebar/LeaseUpSidebar'
import LeaseUpStatusButtons from 'components/molecules/lease_up_sidebar/LeaseUpStatusButtons'
import StatusHistoryContainer from 'components/molecules/lease_up_sidebar/StatusHistoryContainer'
import { mockStatusItem, mockStatusItems, mockManyStatusItems } from '../../../mocks/statusItemMock'

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
      expect(wrapper.find(LeaseUpStatusButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpStatusButtons).first().prop('status')).toBeNull()
      expect(wrapper.find(StatusHistoryContainer)).toHaveLength(0)
    })

    test('should render with a single status item correctly', () => {
      const wrapper = getWrapper([mockStatusItem()])
      expect(wrapper.find(LeaseUpStatusButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpStatusButtons).first().prop('status')).toEqual('Approved')
      expect(wrapper.find(LeaseUpStatusButtons).first().prop('isLoading')).toBeFalsy()
      expect(wrapper.find(StatusHistoryContainer).prop('statusItems')).toHaveLength(1)
    })

    test('should render with multiple status items correctly', () => {
      const wrapper = getWrapper(mockStatusItems())
      expect(wrapper.find(LeaseUpStatusButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpStatusButtons).first().prop('status')).toEqual('Approved')
      expect(wrapper.find(StatusHistoryContainer).prop('statusItems')).toHaveLength(6)
    })

    test('should render with more than 4 status items correctly', () => {
      const wrapper = getWrapper(mockManyStatusItems(5))
      expect(wrapper.find(LeaseUpStatusButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpStatusButtons).first().prop('status')).toEqual('Approved')
      expect(wrapper.find(StatusHistoryContainer).prop('statusItems')).toHaveLength(5)
    })

    test('should render with lease signed status', () => {
      const wrapper = getWrapper([
        mockStatusItem({
          status: 'Lease Signed',
          substatus: null
        }),
        mockStatusItem()
      ])

      expect(wrapper.find(LeaseUpStatusButtons)).toHaveLength(2)
      expect(wrapper.find(LeaseUpStatusButtons).first().prop('status')).toEqual('Lease Signed')
    })
  })

  describe('when loading', () => {
    test('should set the buttons to be loading/disabled', () => {
      const wrapper = getWrapper([mockStatusItem()], true)

      const statusButtonsWrapper = wrapper.find(LeaseUpStatusButtons).first()
      const saveButtonWrapper = wrapper.find('button#save-supplemental-application').first()

      expect(statusButtonsWrapper.prop('isLoading')).toBeTruthy()
      expect(saveButtonWrapper.prop('disabled')).toBeTruthy()
    })
  })

  describe('snapshot tests', () => {
    test('should match snapshot with 5 status items', () => {
      const wrapper = getWrapper(mockManyStatusItems(5))
      expect(wrapper).toMatchSnapshot()
    })
  })
})
