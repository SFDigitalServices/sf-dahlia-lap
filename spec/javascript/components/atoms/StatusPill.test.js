import React from 'react'
import { shallow } from 'enzyme'
import StatusPill from 'components/atoms/StatusPill'

const getWrapper = (status) => shallow(<StatusPill status={status} />)

describe('StatusPill', () => {
  test('should render properly with approved status', () => {
    const wrapper = getWrapper('Approved')
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with withdrawn status', () => {
    const wrapper = getWrapper('Withdrawn')
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Processing status', () => {
    const wrapper = getWrapper('Processing')
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Appealed status', () => {
    const wrapper = getWrapper('Appealed')
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Disqualified status', () => {
    const wrapper = getWrapper('Disqualified')
    expect(wrapper).toMatchSnapshot()
  })

  test('should render properly with Lease Signed status', () => {
    const wrapper = getWrapper('Lease Signed')
    expect(wrapper).toMatchSnapshot()
  })
})
