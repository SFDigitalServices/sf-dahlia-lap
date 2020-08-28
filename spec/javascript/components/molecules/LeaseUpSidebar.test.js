import React from 'react'
import { shallow } from 'enzyme'
import LeaseUpSidebar from 'components/molecules/LeaseUpSidebar'
import { mockStatusItem, mockStatusItems, mockManyStatusItems } from '../../mocks/statusItemMock'

const getWrapper = (currentStatus, items) => shallow(
  <LeaseUpSidebar
    currentStatus={currentStatus}
    statusItems={items}
  />
)

describe('LeaseUpSidebar', () => {
  test('should render with empty status items correctly', () => {
    const wrapper = getWrapper('Approved', [])
    expect(wrapper).toMatchSnapshot()
  })

  test('should render with a single status item correctly', () => {
    const wrapper = getWrapper('Approved', [mockStatusItem()])
    expect(wrapper).toMatchSnapshot()
  })

  test('should render with multiple status items correctly', () => {
    const wrapper = getWrapper('Approved', mockStatusItems())
    expect(wrapper).toMatchSnapshot()
  })

  test('should render with more than 4 status items correctly', () => {
    const wrapper = getWrapper('Approved', mockManyStatusItems(5))
    expect(wrapper).toMatchSnapshot()
  })
})
