import React from 'react'

import { render, screen, within, fireEvent } from '@testing-library/react'
import { Form } from 'react-final-form'

import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'

const mockOnFilterChange = jest.fn()
const mockOnClearFilters = jest.fn()
const mockOnSubmit = jest.fn()

jest.mock('react-select', () => (props) => {
  const handleChange = (event) => {
    const option = props.options.find((option) => option.value === event.currentTarget.value)
    props.onChange(option)
  }
  return (
    <select
      data-testid='select'
      value={props.value}
      onChange={handleChange}
      multiple={props.isMulti}
    >
      {props.options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
})

const getScreen = ({ preferences = [], hasChangedFilters = false } = {}) =>
  render(
    <Form onSubmit={mockOnSubmit}>
      {() => (
        <form>
          <LeaseUpApplicationsFilters
            preferences={preferences}
            hasChangedFilters={hasChangedFilters}
            onFilterChange={mockOnFilterChange}
            onClearFilters={mockOnClearFilters}
          />
        </form>
      )}
    </Form>
  )

describe('LeaseUpApplicationsFilters', () => {
  describe('with default props', () => {
    beforeEach(() => {
      getScreen()
    })

    test('renders all filters in order', () => {
      const fields = screen.getAllByTestId('multiSelectField')
      expect(fields).toHaveLength(4)
      expect(within(fields[0]).getByText('Preferences')).toBeInTheDocument()
      expect(within(fields[1]).getByText('Household Members')).toBeInTheDocument()
      expect(within(fields[2]).getByText('Accessibility Requests')).toBeInTheDocument()
      expect(within(fields[3]).getByText('Application Status')).toBeInTheDocument()
    })

    test('renders preferences with the correct options', () => {
      const preferenceField = screen.getAllByTestId('multiSelectField')[0]
      expect(within(preferenceField).getAllByRole('option')).toHaveLength(1)
    })

    test('renders the button with tertiary-inverse style', () => {
      const applyButton = screen.getByRole('button', {
        name: /apply filters/i
      })
      expect(applyButton).toHaveClass('tertiary-inverse')
      expect(applyButton).not.toHaveClass('primary')
    })
  })

  describe('with additional preferences', () => {
    beforeEach(() => {
      getScreen({ preferences: ['test', 'test2'] })
    })

    test('renders preferences with the correct options', () => {
      const preferenceField = screen.getAllByTestId('multiSelectField')[0]
      expect(within(preferenceField).getAllByRole('option')).toHaveLength(3)
    })
  })

  describe('when hasChangedFilters = true', () => {
    beforeEach(() => {
      getScreen({ hasChangedFilters: true })
    })

    test('renders the button with primary style', () => {
      const applyButton = screen.getByRole('button', {
        name: /apply filters/i
      })
      expect(applyButton).not.toHaveClass('tertiary-inverse')
      expect(applyButton).toHaveClass('primary')
    })
  })

  describe('onChangeFilters', () => {
    beforeEach(() => {
      getScreen()
    })

    test('should call onFilterChanged when preference filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const preferenceField = screen.getAllByTestId('multiSelectField')[0]
      fireEvent.change(within(preferenceField).getByTestId('select'), {
        target: { value: 'general' }
      })
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Household Members filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const preferenceField = screen.getAllByTestId('multiSelectField')[1]
      fireEvent.change(within(preferenceField).getByTestId('select'), {
        target: { value: 1 }
      })
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Accessibility Requests changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const preferenceField = screen.getAllByTestId('multiSelectField')[2]
      fireEvent.change(within(preferenceField).getByTestId('select'), {
        target: { value: 'Mobility impairments' }
      })
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Application Status filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const preferenceField = screen.getAllByTestId('multiSelectField')[3]
      fireEvent.change(within(preferenceField).getByTestId('select'), {
        target: { value: 'Waitlisted' }
      })
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })
  })

  describe('onClearFilters', () => {
    beforeEach(() => {
      getScreen()
    })

    test('should call onFilterChanged when preference filter changes', () => {
      expect(mockOnClearFilters.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
      expect(mockOnClearFilters.mock.calls).toHaveLength(1)
    })
  })
})
