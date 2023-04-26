import React from 'react'

import { shallow } from 'enzyme'

import Button from 'components/atoms/Button'
import StyledIcon from 'components/atoms/StyledIcon'

import { findWithText } from '../../testUtils/wrapperUtil'

describe('Button', () => {
  test('it renders a button with the correct default properties', () => {
    const wrapper = shallow(<Button text='This is a button' />)
    const selector = 'button'
    expect(wrapper.find(selector)).toHaveLength(1)
    expect(wrapper.find(selector).props().type).toEqual('button')
    expect(wrapper.find(selector).hasClass('margin-bottom-none')).toBeFalsy()
    expect(wrapper.find(StyledIcon)).toHaveLength(0)
  })

  test('it renders a button with the correct properties', () => {
    const selector = 'button'
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
    const buttonWrapper = wrapper.find(selector)
    const buttonProps = buttonWrapper.props()
    expect(buttonWrapper).toHaveLength(1)
    expect(buttonProps.type).toEqual('submit')
    expect(buttonWrapper.text()).toEqual('This is a button')
    expect(buttonWrapper.hasClass('small')).toBeTruthy()
    expect(buttonWrapper.hasClass('tiny')).toBeTruthy()
    expect(buttonWrapper.hasClass('tertiary')).toBeTruthy()
    expect(buttonWrapper.hasClass('margin-bottom-none')).toBeTruthy()
    expect(buttonWrapper.hasClass('additional-class-one')).toBeTruthy()
    expect(buttonWrapper.hasClass('additional-class-two')).toBeTruthy()
    expect(buttonProps['data-other-prop']).toEqual('abc')
    expect(wrapper.find(StyledIcon)).toHaveLength(0)
  })

  describe('with an icon to the left', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <Button text='This is a button' iconLeft={<StyledIcon icon='list-unordered' />} />
      )
    })

    test('should render a StyledIcon', () => {
      expect(wrapper.find(StyledIcon)).toHaveLength(1)
    })

    test('should render the StyledIcon before the text', () => {
      const firstChild = wrapper.childAt(0).childAt(0)
      const secondChild = wrapper.childAt(0).childAt(1)
      expect(firstChild.find(StyledIcon)).toHaveLength(1)
      expect(secondChild.find(StyledIcon)).toHaveLength(0)
      expect(firstChild.text()).not.toContain('This is a button')
      expect(secondChild.text()).toEqual('This is a button')
    })

    test('should add left margin to the text', () => {
      const textChild = wrapper.childAt(0).childAt(1)

      expect(textChild.props().style.marginLeft).toEqual('1rem')
      expect(textChild.props().style.marginRight).toBeFalsy()
    })
  })

  describe('with an icon to the right', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <Button text='This is a button' iconRight={<StyledIcon icon='list-unordered' />} />
      )
    })

    test('should render a StyledIcon', () => {
      expect(wrapper.find(StyledIcon)).toHaveLength(1)
    })

    test('should render the StyledIcon after the text', () => {
      const firstChild = wrapper.childAt(0).childAt(0)
      const secondChild = wrapper.childAt(0).childAt(1)
      expect(firstChild.find(StyledIcon)).toHaveLength(0)
      expect(secondChild.find(StyledIcon)).toHaveLength(1)
      expect(firstChild.text()).toEqual('This is a button')
      expect(secondChild.text()).not.toContain('This is a button')
    })

    test('should add right margin to the text', () => {
      const textChild = wrapper.childAt(0).childAt(0)

      expect(textChild.props().style.marginRight).toEqual('1rem')
      expect(textChild.props().style.marginLeft).toBeFalsy()
    })
  })

  describe('with two icons', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <Button
          text='This is a button'
          iconLeft={<StyledIcon icon='list-unordered' />}
          iconRight={<StyledIcon icon='list-unordered' />}
        />
      )
    })

    test('should render two StyledIcons', () => {
      expect(wrapper.find(StyledIcon)).toHaveLength(2)
    })

    test('should render the StyledIcon on either side of the text', () => {
      const firstChild = wrapper.childAt(0).childAt(0)
      const secondChild = wrapper.childAt(0).childAt(1)
      const thirdChild = wrapper.childAt(0).childAt(2)

      expect(firstChild.find(StyledIcon)).toHaveLength(1)
      expect(secondChild.find(StyledIcon)).toHaveLength(0)
      expect(thirdChild.find(StyledIcon)).toHaveLength(1)

      expect(firstChild.text()).not.toContain('This is a button')
      expect(secondChild.text()).toEqual('This is a button')
      expect(thirdChild.text()).not.toContain('This is a button')
    })

    test('should add right and left margin to the text', () => {
      const textChild = wrapper.childAt(0).childAt(1)

      expect(textChild.props().style.marginRight).toEqual('1rem')
      expect(textChild.props().style.marginLeft).toEqual('1rem')
    })
  })

  describe('when text is added', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Button text='This is a button' />)
    })

    test('should clear vertical padding at the button level', () => {
      const buttonStyle = wrapper.find('button').props().style
      expect(buttonStyle.paddingTop).toEqual(0)
      expect(buttonStyle.paddingBottom).toEqual(0)
    })

    test('should add vertical padding to the text element', () => {
      const textChildWrapper = wrapper.childAt(0).childAt(0)
      const textStyle = textChildWrapper.props().style

      expect(textStyle.marginTop).toEqual('1rem')
      expect(textStyle.marginBottom).toEqual('1rem')
    })
  })

  describe('when text is empty', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <Button
          iconLeft={<StyledIcon icon='list-unordered' />}
          iconRight={<StyledIcon icon='list-unordered' />}
        />
      )
    })

    test('should not clear vertical padding at the button level', () => {
      const buttonStyle = wrapper.find('button').props().style
      expect(buttonStyle.paddingTop).toBeUndefined()
      expect(buttonStyle.paddingBottom).toBeUndefined()
    })
  })

  describe('textAlign', () => {
    const BUTTON_TEXT = 'test_button_text'

    test('renders left aligned text properly', () => {
      const wrapper = shallow(<Button text={BUTTON_TEXT} textAlign='left' />)

      expect(findWithText(wrapper, 'span', BUTTON_TEXT).props().style.textAlign).toEqual('left')
    })

    test('renders right aligned text properly', () => {
      const wrapper = shallow(<Button text={BUTTON_TEXT} textAlign='right' />)

      expect(findWithText(wrapper, 'span', BUTTON_TEXT).props().style.textAlign).toEqual('right')
    })

    test('renders center aligned text properly', () => {
      const wrapper = shallow(<Button text={BUTTON_TEXT} textAlign='center' />)

      expect(findWithText(wrapper, 'span', BUTTON_TEXT).props().style.textAlign).toEqual('center')
    })

    test('renders center aligned text by default', () => {
      const wrapper = shallow(<Button text={BUTTON_TEXT} />)

      expect(findWithText(wrapper, 'span', BUTTON_TEXT).props().style.textAlign).toEqual('center')
    })
  })
})
