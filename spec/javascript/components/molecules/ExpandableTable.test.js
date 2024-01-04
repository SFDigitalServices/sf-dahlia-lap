import React from 'react'

import { render, screen, within } from '@testing-library/react'

import ExpandableTable from 'components/molecules/ExpandableTable'

const mockColumns = [{ content: 'id' }, { content: 'name' }]

const mockRows = [
  [{ content: 'id1' }, { content: 'name1' }],
  [{ content: 'id2' }, { content: 'name2' }],
  [{ content: 'id3' }, { content: 'name3' }]
]

const getScreen = (expandedIndices) =>
  render(
    <ExpandableTable
      columns={mockColumns}
      rows={mockRows}
      expandedRowIndices={expandedIndices}
      renderRow={(_, row) => <div className='testRow'>{row[0].content}</div>}
      renderExpanderButton={(_, row) => (
        <div data-testid='test-expander-button'>{row[0].content}</div>
      )}
    />
  )

describe('ExpandableTable', () => {
  describe('when no rows are expanded', () => {
    test('it renders properly', () => {
      getScreen(new Set())
      screen.getAllByTestId('expandable-table-row').forEach((row) => {
        expect(row).toHaveAttribute('aria-expanded', 'false')
      })
      expect(screen.getAllByTestId('expandable-table-row-button')).toHaveLength(3)
    })
  })

  describe('when one row is expanded', () => {
    test('it renders properly', () => {
      getScreen(new Set([0]))
      const expandableTableRows = screen.getAllByTestId('expandable-table-row')
      expect(expandableTableRows).toHaveLength(3)
      expect(expandableTableRows[0]).toHaveAttribute('aria-expanded', 'true')
      expect(expandableTableRows[1]).toHaveAttribute('aria-expanded', 'false')
      expect(expandableTableRows[2]).toHaveAttribute('aria-expanded', 'false')
      expect(
        within(screen.getAllByTestId('expandable-table-row-button')[0]).getByText('id1')
      ).toBeInTheDocument()
    })
  })

  describe('when all rows expanded', () => {
    test('it renders properly', () => {
      getScreen(new Set([0, 1, 2]))

      screen.getAllByTestId('expandable-table-row').forEach((row) => {
        expect(row).toHaveAttribute('aria-expanded', 'true')
      })
      expect(screen.getAllByTestId('expandable-table-row-button')).toHaveLength(3)
    })
  })
})
