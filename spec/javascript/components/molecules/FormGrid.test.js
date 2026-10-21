import React from 'react'

import { render, screen } from '@testing-library/react'

import FormGrid from 'components/molecules/FormGrid'

describe('FormGrid.Row', () => {
  test('expands by default', () => {
    render(<FormGrid.Row>ABC</FormGrid.Row>)

    expect(screen.getByText('ABC')).toHaveClass('expand')
    expect(screen.getByText('ABC')).not.toHaveClass('margin-left-none', 'margin-right-none')
  })

  test('preserves an explicit false expand value', () => {
    render(<FormGrid.Row expand={false}>ABC</FormGrid.Row>)

    expect(screen.getByText('ABC')).not.toHaveClass('expand')
    expect(screen.getByText('ABC')).toHaveClass('margin-left-none', 'margin-right-none')
  })
})

describe('FormGrid.Item', () => {
  test('renders the FormGrid.Item properly with default props', () => {
    const { asFragment } = render(<FormGrid.Item>ABC</FormGrid.Item>)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders children properly', () => {
    render(<FormGrid.Item>ABC</FormGrid.Item>)
    expect(screen.getByText('ABC')).toBeInTheDocument()
  })

  test('renders the FormGrid.Item properly with width=25%', () => {
    const { asFragment } = render(<FormGrid.Item width='25%'>ABC</FormGrid.Item>)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders the FormGrid.Item properly with width=33%', () => {
    const { asFragment } = render(<FormGrid.Item width='33%'>ABC</FormGrid.Item>)
    expect(asFragment()).toMatchSnapshot()
  })
})
