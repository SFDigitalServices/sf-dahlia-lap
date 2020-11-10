import React from 'react'

import { mount, shallow } from 'enzyme'

import StatusItem from 'components/molecules/lease_up_sidebar/StatusItem'

import { mockStatusItem } from '../../../mocks/statusItemMock'

const getWrapper = (item) => shallow(<StatusItem statusItem={item} />)

describe('StatusItem', () => {
  test('should render an approved status with substatus and comments correctly', () => {
    const wrapper = getWrapper(mockStatusItem())
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly when no substatus provided', () => {
    const wrapper = getWrapper(mockStatusItem({ substatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly when no comment provided', () => {
    const wrapper = getWrapper(mockStatusItem({ comment: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly when no comment or substatus provided', () => {
    const wrapper = getWrapper(mockStatusItem({ substatus: null, comment: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with withdrawn status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Withdrawn', substatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Processing status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Processing', substatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Appealed status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Appealed', substatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Disqualified status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Disqualified', substatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Lease Signed status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Lease Signed', substatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should format timestamps as expected', () => {
    const wrapper = mount(
      <StatusItem statusItem={mockStatusItem({ status: 'Lease Signed', substatus: null })} />
    )
    const timestamp = wrapper.find('StatusDate').text()
    expect(timestamp).toEqual('Aug 25, 2020')
  })
})
