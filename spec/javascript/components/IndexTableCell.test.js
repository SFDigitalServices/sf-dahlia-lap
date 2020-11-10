import React from 'react'

import renderer from 'react-test-renderer'

import IndexTableCell from 'components/IndexTableCell'

// TODO: Add tests for editable cell functionality.
describe('IndexTableCell', () => {
  test('should return null if val is undefined', () => {
    const val = null
    const component = renderer.create(<IndexTableCell {...{ val }} />)

    expect(component.toJSON()).toBeNull()
  })

  test('should return string value if cell is not being edited', () => {
    const val = 'test'
    const editing = false
    const component = renderer.create(<IndexTableCell {...{ val, editing }} />)

    expect(component.toJSON()).toEqual(val)
  })
})
