import React from 'react'

import { render, screen } from '@testing-library/react'

import LeaseUpStatusButtons from 'components/molecules/lease_up_sidebar/LeaseUpStatusButtons'
import { LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

const ON_CHANGE_STATUS = jest.fn()

jest.mock('react-select', () => (props) => {
  const handleChange = (event) => {
    const option = props.options.find((option) => option.value === event.currentTarget.value)
    props.onChange(option)
  }
  return (
    <select
      data-testid={props['data-testid'] || 'select'}
      value={props.defaultValue?.value}
      onChange={handleChange}
      multiple={props.isMulti}
      data-disabled={props.isDisabled}
      className={props.className}
    >
      <option value=''>Select an option</option>
      {props.options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
})

describe('LeaseUpStatusButtons', () => {
  test('should render the status dropdown correctly', () => {
    render(
      <LeaseUpStatusButtons
        onChangeStatus={ON_CHANGE_STATUS}
        status={'Approved'}
        statusOptions={LEASE_UP_STATUS_OPTIONS}
      />
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('Approved')
  })

  test('should render the status dropdown correctly when no status is passed', () => {
    render(
      <LeaseUpStatusButtons
        onChangeStatus={ON_CHANGE_STATUS}
        statusOptions={LEASE_UP_STATUS_OPTIONS}
      />
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('')
  })

  test('should render a comment button', () => {
    render(
      <LeaseUpStatusButtons
        onChangeStatus={ON_CHANGE_STATUS}
        status={'Approved'}
        statusOptions={LEASE_UP_STATUS_OPTIONS}
      />
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeEnabled()
  })

  test('should disable both buttons when loading', () => {
    render(
      <LeaseUpStatusButtons
        onChangeStatus={ON_CHANGE_STATUS}
        status={'Approved'}
        isLoading
        statusOptions={LEASE_UP_STATUS_OPTIONS}
      />
    )

    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('combobox')).toHaveAttribute('data-disabled', 'true')
  })
})
