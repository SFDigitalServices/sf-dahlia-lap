import React from 'react'

import { render, screen } from '@testing-library/react'

import FormGrid from 'components/molecules/FormGrid'

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
    // expect(wrapper.find('.form-grid_item')).toHaveLength(1)
    // expect(wrapper.find('.small-3')).toHaveLength(1)
  })

  test('renders the FormGrid.Item properly with width=33%', () => {
    const { asFragment } = render(<FormGrid.Item width='33%'>ABC</FormGrid.Item>)
    expect(asFragment()).toMatchSnapshot()
  })
})
