import React from 'react'

import { shallow } from 'enzyme'

import AlertBox from 'components/molecules/AlertBox'

describe('AlertBox', () => {
  const onCloseClick = jest.fn()
  const wrapper = shallow(<AlertBox message='This is an alert box' onCloseClick={onCloseClick} />)

  test('it renders an alert box with a message', () => {
    expect(wrapper.find('.alert-body').exists()).toBeTruthy()
    expect(wrapper.find('.alert-body').text()).toEqual('This is an alert box')
  })

  test('it calls onCloseClick when the close button is clicked', () => {
    wrapper.find('.close').simulate('click')
    expect(onCloseClick).toHaveBeenCalled()
  })
})
