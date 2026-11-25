import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { useReactToPrint } from 'react-to-print'

import LotteryManager from 'components/lease_ups/lottery_results_page/LotteryManager'

jest.mock('react-to-print', () => ({
  useReactToPrint: jest.fn()
}))

const listing = {
  name: 'Test Listing',
  building_street_address: '123 Main Street'
}

describe('LotteryManager', () => {
  const handlePrint = jest.fn()

  beforeEach(() => {
    useReactToPrint.mockReturnValue(handlePrint)
  })

  test('prints the lottery results using the content ref', () => {
    const { container } = render(<LotteryManager applications={[]} listing={listing} />)
    const options = useReactToPrint.mock.calls[0][0]

    expect(options).toEqual({
      contentRef: expect.objectContaining({
        current: container.querySelector('#lottery-results-pdf-generator-main')
      }),
      documentTitle: 'Lottery Results',
      preserveAfterPrint: false
    })
    expect(options.contentRef.current).toBeInstanceOf(HTMLElement)
    expect(options.contentRef.current).toHaveTextContent(listing.name)
    expect(options.contentRef.current).toHaveTextContent(listing.building_street_address)
    expect(options.contentRef.current).not.toContainElement(
      screen.getByRole('button', { name: 'Save Lottery Results' })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save Lottery Results' }))

    expect(handlePrint).toHaveBeenCalledTimes(1)
    expect(handlePrint).toHaveBeenCalledWith()
  })

  test('does not offer printing before applications have loaded', () => {
    render(<LotteryManager listing={listing} />)

    expect(screen.queryByRole('button', { name: 'Save Lottery Results' })).not.toBeInTheDocument()
    expect(handlePrint).not.toHaveBeenCalled()
    expect(useReactToPrint.mock.calls[0][0].contentRef.current).toBeNull()
  })
})
