import React from 'react'
import { shallow } from 'enzyme'
import AlertBox from '~/components/molecules/AlertBox'

describe('AlertBox', () => {
  test('it renders an alert box with a message', () => {
    const onCloseClick = jest.fn()
    const wrapper = shallow(<AlertBox message='This is an alert box' onCloseClick={onCloseClick} />)
    expect(wrapper.find('.alert-body').exists()).toBeTruthy()
    expect(wrapper.find('.alert-body').text()).toEqual('This is an alert box')
    wrapper.find('.close').simulate('click')
    expect(onCloseClick).toHaveBeenCalled()
  })
})
