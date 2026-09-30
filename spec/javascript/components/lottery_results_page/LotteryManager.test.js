import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { useReactToPrint } from 'react-to-print'

import LotteryManager from 'components/lease_ups/lottery_results_page/LotteryManager'

import { testBuckets } from './testBuckets'

jest.mock('react-to-print', () => ({
  useReactToPrint: jest.fn()
}))

const listing = { name: 'Test Listing', building_street_address: '123 Main St' }

describe('LotteryManager', () => {
  let mockHandlePrint

  beforeEach(() => {
    mockHandlePrint = jest.fn()
    useReactToPrint.mockReturnValue(mockHandlePrint)
  })

  test('shows a loading state until applications are available', () => {
    render(<LotteryManager applications={null} listing={listing} />)

    expect(screen.queryByText('Save Lottery Results')).not.toBeInTheDocument()
    expect(useReactToPrint).toHaveBeenCalled()
  })

  test('configures useReactToPrint with a contentRef pointing at the lottery results', () => {
    const { container } = render(<LotteryManager applications={testBuckets} listing={listing} />)

    const options = useReactToPrint.mock.calls[useReactToPrint.mock.calls.length - 1][0]
    expect(options.documentTitle).toBe('Lottery Results')
    expect(options).not.toHaveProperty('removeAfterPrint')
    expect(options.contentRef.current).toBe(
      container.querySelector('#lottery-results-pdf-generator-main')
    )
  })

  test('prints when Save Lottery Results is clicked', () => {
    render(<LotteryManager applications={testBuckets} listing={listing} />)

    fireEvent.click(screen.getByText('Save Lottery Results'))

    expect(mockHandlePrint).toHaveBeenCalledTimes(1)
    expect(mockHandlePrint).toHaveBeenCalledWith()
  })
})
