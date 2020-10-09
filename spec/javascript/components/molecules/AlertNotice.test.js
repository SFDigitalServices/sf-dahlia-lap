import React from 'react'
import { shallow } from 'enzyme'
import AlertNotice from '~/components/molecules/AlertNotice'

describe('AlertNotice', () => {
  test('it renders an alert notice with title and content', () => {
    const wrapper = shallow(
      <AlertNotice title='Alert notice title' content='Alert notice content' />
    )
    expect(wrapper.find('div > p:first-child').text()).toEqual('Alert notice title')
    expect(wrapper.find('div > p:last-child').text()).toEqual('Alert notice content')
  })

  test('it returns null if dismiss has a value', () => {
    const wrapper = shallow(<AlertNotice dismiss />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
