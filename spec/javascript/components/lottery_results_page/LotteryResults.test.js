import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import { LotteryResults } from 'components/lease_ups/lottery_results_page/LotteryResults'

const renderResults = () =>
  render(<LotteryResults name='Test Listing' address='123 Main St' buckets={[]} />)

describe('LotteryResults', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 0, 15, 12))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('shows the listing name, address and lottery date as editable text', () => {
    renderResults()

    expect(
      screen.getByRole('button', { name: 'Edit listing name: Test Listing' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit listing address: 123 Main St' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit lottery date: Thu Jan 15 2026' })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /Lottery date:/ })).toHaveTextContent(
      'Lottery date: Thu Jan 15 2026'
    )
  })

  test('forwards the ref to the printable article', () => {
    const ref = React.createRef()
    const { container } = render(
      <LotteryResults ref={ref} name='Test Listing' address='123 Main St' buckets={[]} />
    )

    expect(ref.current).toBe(container.querySelector('#lottery-results-pdf-generator-main'))
  })

  test.each([
    ['listing name', 'Test Listing', 'Renamed Listing'],
    ['listing address', '123 Main St', '456 Market St'],
    ['lottery date', 'Thu Jan 15 2026', 'Fri Jan 16 2026']
  ])('the %s can be edited and saved', (label, original, updated) => {
    renderResults()

    fireEvent.click(screen.getByRole('button', { name: `Edit ${label}: ${original}` }))
    const input = screen.getByRole('textbox', { name: label })
    expect(input).toHaveValue(original)

    fireEvent.change(input, { target: { value: updated } })
    fireEvent.click(screen.getByRole('button', { name: `Save ${label}` }))

    expect(screen.getByRole('button', { name: `Edit ${label}: ${updated}` })).toBeInTheDocument()
  })

  test('cancelling an edit keeps the original value', () => {
    renderResults()

    fireEvent.click(screen.getByRole('button', { name: 'Edit listing name: Test Listing' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'listing name' }), {
      target: { value: 'Discarded' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel editing listing name' }))

    expect(
      screen.getByRole('button', { name: 'Edit listing name: Test Listing' })
    ).toBeInTheDocument()
  })
})
