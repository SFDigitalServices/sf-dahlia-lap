import React from 'react'

import { shallow } from 'enzyme'

import StyledIcon from 'components/atoms/StyledIcon'

describe('StyledIcon', () => {
  describe('with default props', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<StyledIcon icon='list-unordered' />)
    })

    test('should render the correct icon', () => {
      expect(wrapper.find('use').props().xlinkHref).toEqual('#i-list-unordered')
    })

    test('should apply the default style', () => {
      expect(wrapper.find('svg').props().style.width).toEqual('1.5rem')
    })
  })

  describe('with size prop = small', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<StyledIcon size='small' icon='list-unordered' />)
    })

    test('should apply the small style', () => {
      expect(wrapper.find('svg').props().style.width).toEqual('.75rem')
    })
  })

  describe('with custom size', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<StyledIcon customSizeRem='3rem' icon='list-unordered' />)
    })

    test('should apply the custom size style', () => {
      expect(wrapper.find('svg').props().style.width).toEqual('3rem')
    })
  })
})
