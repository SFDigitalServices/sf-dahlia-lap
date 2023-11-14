import React from 'react'

import { render, screen } from '@testing-library/react'

import Button from 'components/atoms/Button'
import StyledIcon from 'components/atoms/StyledIcon'

describe('Button', () => {
  test('it renders a button with the correct default properties', () => {
    render(<Button text='This is a button' />)
    expect(
      screen.getByRole('button', {
        name: /this is a button/i
      })
    ).toBeInTheDocument()
    // Ensure there are no SVGs rendered
    expect(screen.queryByRole('graphics-document')).not.toBeInTheDocument()
  })

  test('it renders a button with the correct properties', () => {
    render(
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
    const button = screen.getByRole('button', {
      name: /this is a button/i
    })
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveClass('small')
    expect(button).toHaveClass('tiny')
    expect(button).toHaveClass('tertiary')
    expect(button).toHaveClass('margin-bottom-none')
    expect(button).toHaveClass('additional-class-one')
    expect(button).toHaveClass('additional-class-two')
    expect(button).toHaveAttribute('data-other-prop', 'abc')
    expect(screen.queryByRole('graphics-document')).not.toBeInTheDocument()
  })

  describe('with an icon to the left', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <Button
          text='This is a button'
          iconLeft={<StyledIcon icon='list-unordered' dataTestId={'list-unordered'} />}
        />
      )
    })

    test('should render a StyledIcon', () => {
      expect(screen.getByTestId('list-unordered')).toBeInTheDocument()
    })

    test('should render the StyledIcon before the text', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('with an icon to the right', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <Button
          text='This is a button'
          iconRight={<StyledIcon icon='list-unordered' dataTestId={'list-unordered'} />}
        />
      )
    })

    test('should render a StyledIcon', () => {
      expect(screen.getByTestId('list-unordered')).toBeInTheDocument()
    })

    test('should render the StyledIcon after the text', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('with two icons', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <Button
          text='This is a button'
          iconLeft={<StyledIcon icon='list-unordered' dataTestId={'list-unordered'} />}
          iconRight={<StyledIcon icon='list-unordered' dataTestId={'list-unordered'} />}
        />
      )
    })

    test('should render two StyledIcons', () => {
      expect(screen.getAllByTestId('list-unordered')).toHaveLength(2)
    })

    test('should render the StyledIcon on either side of the text', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('when text is added', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(<Button text='This is a button' />)
    })

    test('should clear vertical padding at the text and button', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('when text is empty', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <Button
          iconLeft={<StyledIcon icon='list-unordered' />}
          iconRight={<StyledIcon icon='list-unordered' />}
        />
      )
    })

    test('should not clear vertical padding at the button level', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('textAlign', () => {
    const BUTTON_TEXT = 'test_button_text'

    test('renders left aligned text properly', () => {
      const { asFragment } = render(<Button text={BUTTON_TEXT} textAlign='left' />)
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders right aligned text properly', () => {
      const { asFragment } = render(<Button text={BUTTON_TEXT} textAlign='right' />)
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders center aligned text properly', () => {
      const { asFragment } = render(<Button text={BUTTON_TEXT} textAlign='center' />)
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders center aligned text by default', () => {
      const { asFragment } = render(<Button text={BUTTON_TEXT} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
