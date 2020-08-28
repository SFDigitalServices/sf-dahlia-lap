import React from 'react'
import { shallow } from 'enzyme'
import { mockStatusItem } from '../../mocks/statusItemMock'
import StatusItem from 'components/molecules/StatusItem'

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
    const wrapper = getWrapper(mockStatusItem({ subStatus: null, comment: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with withdrawn status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Withdrawn', subStatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Processing status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Processing', subStatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Appealed status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Appealed', subStatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Disqualified status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Disqualified', subStatus: null }))
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Lease Signed status', () => {
    const wrapper = getWrapper(mockStatusItem({ status: 'Lease Signed', subStatus: null }))
    expect(wrapper).toMatchSnapshot()
  })
})
