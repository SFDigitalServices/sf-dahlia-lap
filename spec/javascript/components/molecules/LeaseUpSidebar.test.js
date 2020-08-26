import React from 'react'
import renderer from 'react-test-renderer'
import LeaseUpSidebar from 'components/molecules/LeaseUpSidebar'
import { mockStatusItem, mockStatusItems } from '../../mocks/statusItemMock'

const getWrapper = (currentStatus, items) => renderer.create(
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
})
