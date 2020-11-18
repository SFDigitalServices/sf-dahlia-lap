import React from 'react'

import { shallow } from 'enzyme'

import Button from 'components/atoms/Button'
import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'
import { SelectField } from 'utils/form/final_form/Field'

import { findWithProps } from '../../testUtils/wrapperUtil'

const mockOnFilterChange = jest.fn()
const mockOnClearFilters = jest.fn()

const getWrapper = ({ preferences = [], hasChangedFilters = false } = {}) =>
  shallow(
    <LeaseUpApplicationsFilters
      preferences={preferences}
      hasChangedFilters={hasChangedFilters}
      onFilterChange={mockOnFilterChange}
      onClearFilters={mockOnClearFilters}
    />
  )

describe('LeaseUpApplicationsFilters', () => {
  describe('with default props', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper()
    })

    test('renders all filters in order', () => {
      const fields = wrapper.find(SelectField)
      expect(fields).toHaveLength(4)
      expect(fields.at(0).props().label).toEqual('Preferences')
      expect(fields.at(1).props().label).toEqual('Household Members')
      expect(fields.at(2).props().label).toEqual('Accessibility Requests')
      expect(fields.at(3).props().label).toEqual('Application Status')
    })

    test('renders preferences with the correct options', () => {
      const preferenceField = wrapper.find(SelectField).at(0)
      expect(preferenceField.props().options).toHaveLength(2)
    })

    test('renders the button with tertiary-inverse style', () => {
      const buttonWrapper = findWithProps(wrapper, Button, { text: 'Apply filters' })
      expect(buttonWrapper.props().classes).toContain('tertiary-inverse')
      expect(buttonWrapper.props().classes).not.toContain('primary')
    })
  })

  describe('with additional preferences', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ preferences: ['test', 'test2'] })
    })

    test('renders preferences with the correct options', () => {
      const preferenceField = wrapper.find(SelectField).at(0)
      expect(preferenceField.props().options).toHaveLength(4)
    })
  })

  describe('when hasChangedFilters = true', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ hasChangedFilters: true })
    })

    test('renders the button with primary style', () => {
      const buttonWrapper = findWithProps(wrapper, Button, { text: 'Apply filters' })
      expect(buttonWrapper.props().classes).not.toContain('tertiary-inverse')
      expect(buttonWrapper.props().classes).toContain('primary')
    })
  })

  describe('onChangeFilters', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper()
    })

    test('should call onFilterChanged when preference filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const fieldWrapper = findWithProps(wrapper, SelectField, { label: 'Preferences' })
      fieldWrapper.props().onChange()
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Household Members filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const fieldWrapper = findWithProps(wrapper, SelectField, { label: 'Household Members' })
      fieldWrapper.props().onChange()
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Accessibility Requests changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const fieldWrapper = findWithProps(wrapper, SelectField, { label: 'Accessibility Requests' })
      fieldWrapper.props().onChange()
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })

    test('should call onFilterChanged when Application Status filter changes', () => {
      expect(mockOnFilterChange.mock.calls).toHaveLength(0)
      const fieldWrapper = findWithProps(wrapper, SelectField, { label: 'Application Status' })
      fieldWrapper.props().onChange()
      expect(mockOnFilterChange.mock.calls).toHaveLength(1)
    })
  })

  describe('onClearFilters', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper()
    })

    test('should call onFilterChanged when preference filter changes', () => {
      expect(mockOnClearFilters.mock.calls).toHaveLength(0)
      const clearAllButtonWrapper = findWithProps(wrapper, Button, { text: 'Clear all' })
      clearAllButtonWrapper.props().onClick()
      expect(mockOnClearFilters.mock.calls).toHaveLength(1)
    })
  })
})
