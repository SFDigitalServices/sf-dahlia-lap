import React from 'react'

import { render, screen } from '@testing-library/react'

import InfoAlert from 'components/molecules/InfoAlert'

describe('AlertNotice', () => {
  test('it properly renders an info alert', () => {
    const container = render(
      <InfoAlert icon='i-hour-glass' message='helpful message' classes={['foo']} />
    ).container
    expect(container.querySelector('.info-alert')).toHaveClass('foo')
    expect(screen.getByText('helpful message')).toBeInTheDocument()
    expect(container.querySelector('use').getAttribute('xlink:href')).toBe('#i-hour-glass')
  })

  test('i† renders an alert with text close type', () => {
    render(
      <InfoAlert icon='i-hour-glass' message='helpful message' classes={['foo']} closeType='text' />
    )
    expect(screen.getByText('Close')).toBeInTheDocument()
  })
})
