import React from 'react'
import { shallow } from 'enzyme'
import Button from '~/components/atoms/Button'

describe('Button', () => {
  test('it renders a button with the correct default properties', () => {
    const wrapper = shallow(<Button text='This is a button' />)
    const selector = 'button'
    expect(wrapper.find(selector).exists()).toBeTruthy()
    expect(wrapper.find({ type: 'button' })).toHaveLength(1)
    expect(wrapper.find(selector).hasClass('margin-bottom-none')).toBeFalsy()
  })

  test('it renders a button with the correct properties', () => {
    const selector = 'button[type="submit"]'
    const wrapper = shallow(
      <Button
        type='submit'
        text='This is a button'
        small
        tiny
        tertiary
        noBottomMargin
        classes={['additional-class-one', 'additional-class-two']}
        data-other-prop='abc'
      />
    )
    const buttonProps = wrapper.find(selector).props()
    expect(wrapper.find(selector).exists()).toBeTruthy()
    expect(wrapper.find(selector).text()).toEqual('This is a button')
    expect(wrapper.find(selector).hasClass('small')).toBeTruthy()
    expect(wrapper.find(selector).hasClass('tiny')).toBeTruthy()
    expect(wrapper.find(selector).hasClass('tertiary')).toBeTruthy()
    expect(wrapper.find(selector).hasClass('margin-bottom-none')).toBeTruthy()
    expect(wrapper.find(selector).hasClass('additional-class-one')).toBeTruthy()
    expect(wrapper.find(selector).hasClass('additional-class-two')).toBeTruthy()
    expect(buttonProps['data-other-prop']).toMatch('abc')
  })
})
