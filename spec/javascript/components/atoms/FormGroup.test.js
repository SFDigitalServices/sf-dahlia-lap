import React from 'react'

import { render, screen } from '@testing-library/react'

import FormGroup from 'components/atoms/FormGroup'

describe('FormGroup', () => {
  test('it should render a form group with the correct children', () => {
    render(
      <FormGroup>
        <div data-testid='form-group-child' />
      </FormGroup>
    )
    expect(screen.getByTestId('form-group-child')).toBeInTheDocument()
  })
})
