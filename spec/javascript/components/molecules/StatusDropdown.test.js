import React from 'react'

import { render, screen, within } from '@testing-library/react'
import selectEvent from 'react-select-event'

import StatusDropdown, { renderStatusOption } from 'components/molecules/StatusDropdown'
import { LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

const ON_CHANGE = jest.fn()

const getScreen = (propOverrides = {}) =>
  render(
    <StatusDropdown
      onChange={ON_CHANGE}
      {...propOverrides}
      statusOptions={LEASE_UP_STATUS_OPTIONS}
    />
  )

describe('StatusDropdown', () => {
  test('it renders a select', () => {
    getScreen()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('it renders with default props correctly', () => {
    getScreen()

    selectEvent.openMenu(screen.getByRole('combobox'))

    expect(screen.getAllByRole('listitem')).toHaveLength(LEASE_UP_STATUS_OPTIONS.length)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(
      LEASE_UP_STATUS_OPTIONS.map((option) => option.label)
    )
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(screen.getByRole('button')).toHaveTextContent('Status')
    expect(screen.getByRole('combobox')).toBeEnabled()
  })

  describe('toggle', () => {
    test('renders as expected when value is null', () => {
      const { asFragment } = getScreen()
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders without any additional button styles when none are provided', () => {
      const { asFragment } = getScreen()
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders with left-aligned text', () => {
      const { asFragment } = getScreen({})
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders with additional styles when provided', () => {
      const { rerender, asFragment } = getScreen({ expand: true, size: 'tiny' })
      expect(asFragment()).toMatchSnapshot()

      rerender(<StatusDropdown onChange={ON_CHANGE} expand size='small' />)
      expect(asFragment()).toMatchSnapshot()
    })

    test('renders value with styles when provided', () => {
      getScreen({ status: 'Appealed' })
      const button = screen.getByRole('button')

      expect(within(button).getByText('Appealed')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('is-appealed')
    })

    test('does not render a value when forceDisplayPlaceholderText is true', () => {
      getScreen({
        placeholder: 'placeholder',
        status: 'Appealed',
        forceDisplayPlaceholderText: true
      })

      const button = screen.getByRole('button')

      expect(within(button).getByText('placeholder')).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toHaveClass('is-appealed')
    })

    test('renders when the dropdown is disabled', () => {
      getScreen({ disabled: true })

      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('renders a placeholder when provided', () => {
      getScreen({ placeholder: 'placeholder' })
      const button = screen.getByRole('button')
      expect(within(button).getByText('placeholder')).toBeInTheDocument()
    })
  })

  describe('renderStatusOption', () => {
    const getStatusOptionScreen = (option, selectedValue) =>
      render(renderStatusOption(option, { selectValue: [{ value: selectedValue }] }))
    const testValue = 'testValue'
    const testStatusClassName = 'status-class-name'
    const testLabel = 'testLabel'
    const sampleOption = {
      value: testValue,
      label: testLabel,
      statusClassName: testStatusClassName
    }

    test('renders a styled value with expected styles', () => {
      getStatusOptionScreen(sampleOption, 'notSelected')
      expect(screen.getByRole('listitem')).toHaveClass(testStatusClassName)
      expect(screen.getByRole('listitem')).toHaveClass('dropdown-menu_item')
      expect(screen.getByText(testLabel)).toBeInTheDocument()
      // Verify that its not selected
      expect(screen.getByRole('listitem')).toHaveAttribute('aria-selected', 'false')
    })

    test('renders a selected value as expected', () => {
      getStatusOptionScreen(sampleOption, testValue)
      expect(screen.getByRole('listitem')).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText(testLabel)).toBeInTheDocument()
    })

    test('renders as expected with a null value', () => {
      getStatusOptionScreen({}, testValue)
      expect(screen.getByRole('listitem')).not.toHaveClass(testStatusClassName)
      expect(screen.getByRole('listitem').textContent).toBe('')
    })
  })
})
