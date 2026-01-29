import React from 'react'

import { render, screen, within, fireEvent } from '@testing-library/react'
import { Form } from 'react-final-form'
import selectEvent from 'react-select-event'

import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'
import { LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

const mockOnFilterChange = jest.fn()
const mockOnClearFilters = jest.fn()
const mockOnSubmit = jest.fn()

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
            statusOptions={LEASE_UP_STATUS_OPTIONS}
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
      selectEvent.openMenu(screen.getAllByRole('combobox')[0])
      expect(screen.getByRole('option', { name: /general/i })).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(1)
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
      selectEvent.openMenu(screen.getAllByRole('combobox')[0])
      const options = screen.getAllByRole('option').map((option) => option.textContent)
      expect(options).toEqual(['test', 'test2', 'General'])
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
      selectEvent.openMenu(screen.getAllByRole('combobox')[0])
      fireEvent.click(
        screen.getByRole('option', {
          name: /general/i
        })
      )
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Household Members filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      selectEvent.openMenu(screen.getAllByRole('combobox')[1])
      fireEvent.click(
        screen.getByRole('option', {
          name: /1/i
        })
      )
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Accessibility Requests changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      selectEvent.openMenu(screen.getAllByRole('combobox')[2])
      fireEvent.click(
        screen.getByRole('option', {
          name: /mobility/i
        })
      )

      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Application Status filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      selectEvent.openMenu(screen.getAllByRole('combobox')[3])
      fireEvent.click(
        screen.getByRole('option', {
          name: /waitlisted/i
        })
      )
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
