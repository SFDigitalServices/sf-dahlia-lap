import React from 'react'

import { render, screen } from '@testing-library/react'

import FormGroupCheckboxGroup from 'components/atoms/FormGroupCheckboxGroup'

describe('FormGroupCheckboxGroup', () => {
  test('it should render a form group checkbox group with the correct label and checkbox properties', () => {
    render(
      <FormGroupCheckboxGroup
        label='form label'
        id='checkbox-id'
        name='checkbox-name'
        value='checkbox-value'
      />
    )

    expect(screen.getByText(/form label/i)).toBeInTheDocument()
    expect(screen.getByText(/checkbox-value/i)).toBeInTheDocument()
    expect(screen.getByText(/form label/i)).toHaveAttribute('for', 'checkbox-name')
    expect(
      screen.getByRole('checkbox', {
        name: /checkbox-value/i
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/checkbox-value/i)).toHaveAttribute('for', 'checkbox-id')
  })
})
