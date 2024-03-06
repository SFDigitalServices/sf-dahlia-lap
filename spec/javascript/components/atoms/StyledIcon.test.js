import React from 'react'

import { render } from '@testing-library/react'

import { COLORS } from 'components/atoms/colors'
import StyledIcon from 'components/atoms/StyledIcon'

describe('StyledIcon', () => {
  describe('with default props', () => {
    test('should render the correct icon and apply the default style', () => {
      const { asFragment } = render(<StyledIcon icon='list-unordered' />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('with size prop = small', () => {
    test('should apply the small style', () => {
      const { asFragment } = render(<StyledIcon size='small' icon='list-unordered' />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('with custom size', () => {
    test('should apply the custom size style', () => {
      const { asFragment } = render(<StyledIcon customSizeRem='3rem' icon='list-unordered' />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('with custom fill', () => {
    test('should apply the custom fill style', () => {
      const { asFragment } = render(
        <StyledIcon customFill={COLORS.success} icon='list-unordered' />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
