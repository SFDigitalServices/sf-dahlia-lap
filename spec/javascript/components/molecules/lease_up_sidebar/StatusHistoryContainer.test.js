import React from 'react'

import { shallow } from 'enzyme'

import StatusHistoryContainer from 'components/molecules/lease_up_sidebar/StatusHistoryContainer'
import StatusItems from 'components/molecules/lease_up_sidebar/StatusItems'

import { mockManyStatusItems, mockStatusItem } from '../../../mocks/statusItemMock'

const getWrapper = (items) => shallow(<StatusHistoryContainer statusItems={items} />)

describe('StatusHistoryContainer', () => {
  test('should render with empty status items correctly', () => {
    const wrapper = getWrapper([])
    expect(wrapper.find(StatusItems)).toHaveLength(1)
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(0)
  })

  test('should render with a single status item correctly', () => {
    const wrapper = getWrapper([mockStatusItem()])
    expect(wrapper.find(StatusItems)).toHaveLength(1)
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(1)
  })

  test('should render with more than 4 status items correctly', () => {
    const wrapper = getWrapper(mockManyStatusItems(5))
    expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(5)
  })

  describe('show/hide full status list', () => {
    describe('when over four items are present', () => {
      const numStatusItems = 10
      let wrapper
      let linkWrapper

      beforeEach(() => {
        wrapper = getWrapper(mockManyStatusItems(numStatusItems))
        linkWrapper = wrapper.find('button').first()
      })

      test('should limit the statuses to 4 by default', () => {
        expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(numStatusItems)
        expect(wrapper.find(StatusItems).prop('limit')).toEqual(4)
      })

      test('should have no limit after show all statuses clicked', () => {
        linkWrapper.simulate('click')
        expect(wrapper.find(StatusItems).prop('statusItems')).toHaveLength(numStatusItems)
        expect(wrapper.find(StatusItems).prop('limit')).toEqual(numStatusItems)
      })

      test('should have correct link text before click', () => {
        expect(linkWrapper.text()).toEqual('Show all status updates')
      })

      test('should have correct link text after click', () => {
        linkWrapper.simulate('click')
        expect(linkWrapper.text()).toEqual('Show all status updates')
      })
    })

    describe('when four or under items are present', () => {
      test('should not show the show/hide statuses link with exactly 4 items', () => {
        const wrapper = getWrapper(mockManyStatusItems(4))
        expect(wrapper.find('button')).toHaveLength(0)
      })

      test('should not show the show/hide statuses link with 1 item', () => {
        const wrapper = getWrapper(mockManyStatusItems(1))
        expect(wrapper.find('button')).toHaveLength(0)
      })
    })
  })
})
