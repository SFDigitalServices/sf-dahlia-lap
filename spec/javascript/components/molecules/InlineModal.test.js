import React from 'react'

import { render } from '@testing-library/react'

import InlineModal from 'components/molecules/InlineModal'

describe('InlineModal', () => {
  test('should use the inline-modal class for background if background is not specified', () => {
    const { asFragment } = render(<InlineModal />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('should pass the white background prop if specified', () => {
    const { asFragment } = render(<InlineModal whiteBackground />)
    expect(asFragment()).toMatchSnapshot()
  })
})
