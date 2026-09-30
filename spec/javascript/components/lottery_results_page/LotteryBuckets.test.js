import React from 'react'

import { fireEvent, render, screen, within } from '@testing-library/react'

import LotteryBuckets from 'components/lease_ups/lottery_results_page/LotteryBuckets'

const buckets = [
  {
    shortCode: 'COP',
    preferenceResults: [
      { lottery_number: '00000001', isVeteran: true },
      { lottery_number: '00000002', isVeteran: false }
    ]
  },
  {
    shortCode: 'DTHP',
    preferenceResults: [{ lottery_number: '00000003', isVeteran: false }]
  }
]

describe('LotteryBuckets', () => {
  test('renders a column per bucket with its title, editable subtitle and results', () => {
    render(<LotteryBuckets buckets={buckets} />)

    expect(screen.getByRole('columnheader', { name: 'COP' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'DTHP' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit COP subtitle: Up to 100% of units' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit DTHP subtitle: Up to 20% of units' })
    ).toBeInTheDocument()

    const lists = screen.getAllByRole('list')
    expect(
      within(lists[0])
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    ).toEqual(['00000001*', '00000002'])
    expect(
      within(lists[1])
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    ).toEqual(['00000003'])
  })

  test('a subtitle can be edited and saved', () => {
    render(<LotteryBuckets buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit COP subtitle: Up to 100% of units' }))
    const input = screen.getByRole('textbox', { name: 'COP subtitle' })
    expect(input).toHaveValue('Up to 100% of units')

    fireEvent.change(input, { target: { value: 'Up to 10 units' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Up to 10 units')).toBeInTheDocument()
    // other columns are unaffected
    expect(screen.getByText('Up to 20% of units')).toBeInTheDocument()
  })

  test('cancelling a subtitle edit keeps the original subtitle', () => {
    render(<LotteryBuckets buckets={buckets} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit DTHP subtitle: Up to 20% of units' }))
    const input = screen.getByRole('textbox', { name: 'DTHP subtitle' })
    fireEvent.change(input, { target: { value: 'Discarded' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.queryByText('Discarded')).not.toBeInTheDocument()
    expect(screen.getByText('Up to 20% of units')).toBeInTheDocument()
  })

  test('skips buckets with an unknown preference and warns', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(<LotteryBuckets buckets={[...buckets, { shortCode: 'NOPE', preferenceResults: [] }]} />)

    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(warn).toHaveBeenCalledWith('Unknown preference: NOPE')
    warn.mockRestore()
  })
})
