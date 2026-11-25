import React from 'react'

import { render, screen } from '@testing-library/react'

import HomePage from 'components/pages/HomePage'

describe('HomePage', () => {
  test('renders the welcome header without an error boundary fallback', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: 'Welcome to DAHLIA Partners.' })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toHaveClass('bg-vapor')
    expect(screen.getByText('We hope you enjoy your stay here.')).toBeInTheDocument()
    expect(screen.queryByText('An error occurred. Check back later.')).not.toBeInTheDocument()
  })
})
