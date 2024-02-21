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
    expect(getByText(content)).toBeInTheDocument()
  })

  it('displays the error message when there is an error', async () => {
    // The goal of this test is to ensure that the ErrorBoundary component works correctly
    // We want to capture the error and assert that it is the correct one
    // but we don't want to see the error output in the console
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})

    const { getByText } = render(
      <ErrorBoundary>
        <div>
          <ErrorTest />
        </div>
      </ErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalledTimes(3)
    expect(consoleSpy.mock.calls[0][0].toString()).toBe(
      'Error: Uncaught [Error: This is an error to test ErrorBoundary]'
    )
    expect(getByText('An error occurred. Check back later.')).toBeInTheDocument()
  })
})
