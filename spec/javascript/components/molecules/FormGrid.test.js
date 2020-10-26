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

  test('renders the FormGrid.Item properly with width=25%', () => {
    const wrapper = shallow(<FormGrid.Item width='25%'>ABC</FormGrid.Item>)
    expect(wrapper.find('.form-grid_item')).toHaveLength(1)
    expect(wrapper.find('.small-3')).toHaveLength(1)
  })

  test('renders the FormGrid.Item properly with width=33%', () => {
    const wrapper = shallow(<FormGrid.Item width='33%'>ABC</FormGrid.Item>)
    expect(wrapper.find('.form-grid_item')).toHaveLength(1)
    expect(wrapper.find('.small-4')).toHaveLength(1)
  })
})
