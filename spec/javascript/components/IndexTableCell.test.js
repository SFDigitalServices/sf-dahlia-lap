import React from 'react'

import { render } from '@testing-library/react'

import IndexTableCell from 'components/IndexTableCell'

// TODO: Add tests for editable cell functionality.
describe('IndexTableCell', () => {
  test('should return null if val is undefined', () => {
    const val = null
    const { asFragment } = render(<IndexTableCell {...{ val }} />)

    expect(asFragment()).toMatchSnapshot()
  })

  test('should return string value if cell is not being edited', () => {
    const val = 'test'
    const editing = false
    const { asFragment } = render(<IndexTableCell {...{ val, editing }} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
