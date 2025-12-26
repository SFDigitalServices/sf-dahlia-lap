import React from 'react'

import { render, screen } from '@testing-library/react'

import RefreshIndicator from 'components/atoms/RefreshIndicator'

describe('RefreshIndicator', () => {
  describe('with default props', () => {
    test('should render spinner and default text', () => {
      render(<RefreshIndicator />)

      expect(screen.getByTestId('refresh-indicator')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-spinner')).toBeInTheDocument()
      expect(screen.getByText('Refreshing...')).toBeInTheDocument()
    })
  })

  describe('with custom text', () => {
    test('should render custom text', () => {
      render(<RefreshIndicator text='Loading data...' />)

      expect(screen.getByText('Loading data...')).toBeInTheDocument()
    })
  })

  describe('with showText=false', () => {
    test('should not render text', () => {
      render(<RefreshIndicator showText={false} />)

      expect(screen.getByTestId('refresh-spinner')).toBeInTheDocument()
      expect(screen.queryByText('Refreshing...')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    test('should have aria-live attribute for screen readers', () => {
      render(<RefreshIndicator />)

      const indicator = screen.getByTestId('refresh-indicator')
      expect(indicator).toHaveAttribute('aria-live', 'polite')
      expect(indicator).toHaveAttribute('aria-label', 'Refreshing...')
    })
  })
})
