import React from 'react'
import { shallow } from 'enzyme'
import FormGrid from 'components/molecules/FormGrid'

describe('FormGrid.Item', () => {
  test('renders the FormGrid.Item properly with default props', () => {
    const wrapper = shallow(<FormGrid.Item>ABC</FormGrid.Item>)
    expect(wrapper.find('.form-grid_item')).toHaveLength(1)
    expect(wrapper.find('.small-6')).toHaveLength(1)
  })

  test('renders children properly', () => {
    const wrapper = shallow(<FormGrid.Item>ABC</FormGrid.Item>)
    expect(wrapper.text()).toEqual('ABC')
  })

  test('renders the FormGrid.Item properly with small = true', () => {
    const wrapper = shallow(<FormGrid.Item small>ABC</FormGrid.Item>)
    expect(wrapper.find('.form-grid_item')).toHaveLength(1)
    expect(wrapper.find('.small-3')).toHaveLength(1)
  })
})
