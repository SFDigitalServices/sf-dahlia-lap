import React from 'react'

import { render } from '@testing-library/react'

import IndexTable from 'components/IndexTable'

// A bit verbose, but just to illustrate how it works
describe('IndexTable', () => {
  const results = [
    { first_name: 'xxx1', last_name: 'zzz1' },
    { first_name: 'xxx2', last_name: 'zzz2' }
  ]

  const emptyResults = [{ first_name: undefined, last_name: undefined, lottery_date: undefined }]

  const fields = { first_name: null, last_name: null }

  const fieldsForEmptyResults = { first_name: null, last_name: null, lottery_date: null }

  // Jest Snapshot
  test('should render IndexTable', () => {
    const { asFragment } = render(<IndexTable results={results} fields={fields} />)

    expect(asFragment()).toMatchSnapshot()
  })

  test('should render empty string if values are undefined', () => {
    const { container } = render(
      <IndexTable results={emptyResults} fields={fieldsForEmptyResults} />
    )

    const firstRow = container.querySelector('div.rt-tbody div.rt-tr-group').firstChild
    // Filter out the arrow that expands the row.
    const cells = Array(firstRow.querySelector('div.rt-td'))

    cells
      .filter((cell) => !cell.classList.contains('rt-expandable'))
      .forEach((node) => {
        // Expect all other cells to be empty
        expect(node.text()).toEqual('')
      })
  })

  // Enzyme-Jest Snapshot
  test('rows should be expandable', () => {
    // Mount renders the whole component tree. Mount is good for testing interactions.
    const { asFragment } = render(
      <IndexTable results={results} fields={fields} links={['View Listing']} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
