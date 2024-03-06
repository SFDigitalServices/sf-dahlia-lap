import React from 'react'

import { render, screen } from '@testing-library/react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'

const errorMsg = 'This is an error to test ErrorBoundary'
const ErrorTest = () => {
  throw new Error(errorMsg)
}

describe('ErrorBoundary', () => {
  test('it should render an error boundary with the correct children', () => {
    render(
      <ErrorBoundary>
        <div data-testid='error-boundary-child' />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('error-boundary-child')).toBeInTheDocument()
  })

  it('displays content when there is no error', async () => {
    const content = 'test content 123'
    const { getByText } = render(
      <ErrorBoundary>
        <div>{content}</div>
      </ErrorBoundary>
    )
    getByText(content)
  })

  it('displays the error message when there is an error', async () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>
          <ErrorTest />
        </div>
      </ErrorBoundary>
    )
    getByText('An error occurred. Check back later.')
  })
})
