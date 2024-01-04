import React from 'react'

import { render, screen } from '@testing-library/react'

import AlertNotice from 'components/molecules/AlertNotice'

describe('AlertNotice', () => {
  test('it renders an alert notice with title and content', () => {
    render(<AlertNotice title='Alert notice title' content='Alert notice content' />)
    expect(screen.getByText('Alert notice title')).toBeInTheDocument()
    expect(screen.getByText('Alert notice content')).toBeInTheDocument()
  })

  test('it returns null if dismiss has a value', () => {
    render(<AlertNotice dismiss />)
    expect(screen.queryByText('Alert notice title')).not.toBeInTheDocument()
    expect(screen.queryByText('Alert notice content')).not.toBeInTheDocument()
  })
})
