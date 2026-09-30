import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'react-final-form'

import { CurrencyField, PercentField } from 'utils/form/final_form/Field'

const renderInForm = (field, initialValues = {}) => {
  const onSubmit = jest.fn()
  let formApi
  render(
    <Form onSubmit={onSubmit} initialValues={initialValues}>
      {({ form }) => {
        formApi = form
        return <form>{field}</form>
      }}
    </Form>
  )
  return { getForm: () => formApi }
}

describe('Field', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error')
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe.each([
    ['CurrencyField', CurrencyField],
    ['PercentField', PercentField]
  ])('%s', (_name, Component) => {
    test.each([null, undefined, ''])(
      'renders an empty string for an initial value of %p without React warnings',
      (initialValue) => {
        renderInForm(<Component fieldName='amount' label='Amount' isDirty={false} />, {
          amount: initialValue
        })

        const input = screen.getByLabelText('Amount')
        expect(input).toHaveValue('')
        // React omits the value attribute when the value prop is null (uncontrolled input),
        // and it logs each warning only once per run, so check the attribute as well.
        expect(input).toHaveAttribute('value', '')
        expect(consoleErrorSpy).not.toHaveBeenCalled()
      }
    )

    test('keeps null in form state after clearing and blurring', () => {
      const { getForm } = renderInForm(<Component fieldName='amount' label='Amount' isDirty />, {
        amount: '10'
      })
      const input = screen.getByLabelText('Amount')

      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.blur(input)

      expect(getForm().getState().values.amount).toBeNull()
      expect(input).toHaveAttribute('value', '')
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })
})
