import React from 'react'

import { render, screen } from '@testing-library/react'

import Column from 'components/atoms/Column'

describe('Column', () => {
  test('it should render a column with the correct properties', () => {
    render(
      <Column span='span-test' end form>
        <div data-testid='child' className='some-div' />
      </Column>
    )
    const columnElement = screen.getByTestId('column')
    expect(columnElement).toBeInTheDocument()
    expect(columnElement).toHaveClass('small-span-test')
    expect(columnElement).toHaveClass('end')
    expect(columnElement).toHaveClass('form-grid_item')
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
