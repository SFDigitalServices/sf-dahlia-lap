import React from 'react'
import { shallow } from 'enzyme'
import FormGrid from 'components/molecules/FormGrid'

describe('FormGrid.Item', () => {
  test('should render FormGrid.Item', () => {
    const wrapper = shallow(<FormGrid.Item>ABC</FormGrid.Item>)
    expect(wrapper).toMatchSnapshot()
  })

  test('should render small FormGrid.Item', () => {
    const wrapper = shallow(<FormGrid.Item small>ABC</FormGrid.Item>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('div').at(0).hasClass('small-3')).toEqual(true)
  })
})
