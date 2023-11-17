import React from 'react'

import { render, screen } from '@testing-library/react'

import ShowHideFiltersButton from 'components/molecules/ShowHideFiltersButton'

describe('ShowHideFiltersButton', () => {
  test('it renders properly with default props', () => {
    render(<ShowHideFiltersButton />)
    expect(screen.getByText('Show Filters')).toBeInTheDocument()
    expect(screen.queryByTestId('button-iconRight')).not.toBeInTheDocument()
    expect(screen.getByTestId('button-iconLeft')).toBeInTheDocument()
  })

  test('it renders properly when isShowingFilters=true', () => {
    render(<ShowHideFiltersButton isShowingFilters />)
    expect(screen.getByText('Hide Filters')).toBeInTheDocument()
    expect(screen.queryByTestId('button-iconRight')).not.toBeInTheDocument()
    expect(screen.getByTestId('button-iconLeft')).toBeInTheDocument()
  })

  test('it renders properly when numFiltersApplied=4', () => {
    const { asFragment } = render(<ShowHideFiltersButton isShowingFilters numFiltersApplied={4} />)
    expect(screen.getByTestId('button-iconLeft')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
