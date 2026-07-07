import React from 'react'

import { render, screen, within } from '@testing-library/react'
import selectEvent from 'react-select-event'

import SubstatusDropdown, { renderSubstatusOption } from 'components/molecules/SubstatusDropdown'
import { LEASE_UP_SUBSTATUS_OPTIONS } from 'utils/statusUtils'

const ON_CHANGE = jest.fn()
const APPEALED_SUBSTATUS = LEASE_UP_SUBSTATUS_OPTIONS.Appealed[0].value

const getScreen = (propOverrides = {}) =>
  render(
    <SubstatusDropdown
      onChange={ON_CHANGE}
      {...propOverrides}
      substatusOptions={LEASE_UP_SUBSTATUS_OPTIONS}
    />
  )

describe('SubstatusDropdown', () => {
  test('it renders a select', () => {
    getScreen()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('it renders with default props correctly', async () => {
    getScreen()

    // Ensure that the placeholder is rendered
    expect(screen.getByText('Select one...')).toBeInTheDocument()
    // Open the dropdown, since there are no items "No Options" should be rendered
    await selectEvent.openMenu(screen.getByRole('combobox'))
    expect(await screen.findByText(/no options/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toBeEnabled()
  })

  test('it passes the expected options to Dropdown when a status is provided', async () => {
    getScreen({ status: 'Appealed' })

    await selectEvent.openMenu(screen.getByRole('combobox'))
    await screen.findByText(LEASE_UP_SUBSTATUS_OPTIONS.Appealed[0].label)
    LEASE_UP_SUBSTATUS_OPTIONS.Appealed.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  describe('toggle', () => {
    test('renders as expected when value is null', () => {
      getScreen()
      const expectedButtonClasses = [
        'button',
        'dropdown-button',
        'substatus',
        'has-icon--right',
        'text-align-left'
      ]
      const toggleButton = screen.getByRole('button')
      expect(within(toggleButton).getByText('Select one...')).toBeInTheDocument()
      expect(toggleButton).toHaveClass(expectedButtonClasses.join(' '))
      expect(toggleButton).toBeEnabled()
    })

    test('renders without any additional button styles when none are provided', () => {
      getScreen()
      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('expand')
      expect(button).not.toHaveClass('error')
    })

    test('renders additional styles when provided', () => {
      getScreen({ expand: true, hasError: true })
      const button = screen.getByRole('button')
      expect(button).toHaveClass('expand')
      expect(button).toHaveClass('error')
    })

    test('renders value when provided', () => {
      getScreen({ status: 'Appealed', subStatus: APPEALED_SUBSTATUS })
      const button = screen.getByRole('button')
      expect(within(button).getByText(APPEALED_SUBSTATUS)).toBeInTheDocument()
    })

    test('renders as disabled when the dropdown is disabled', () => {
      getScreen({ disabled: true })
      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('renders a placeholder when provided', () => {
      getScreen({ placeholder: 'placeholder' })
      expect(within(screen.getByRole('button')).getByText('placeholder')).toBeInTheDocument()
    })
  })

  describe('renderSubstatusOption', () => {
    const getStatusOptionWrapper = (option, selectedValue) =>
      render(renderSubstatusOption(option, { selectValue: [{ value: selectedValue }] }))
    const testValue = 'testValue'
    const testLabel = 'testLabel'
    const sampleOption = {
      value: testValue,
      label: testLabel
    }

    test("renders a value that's not selected as expected", () => {
      getStatusOptionWrapper(sampleOption, 'otherValue')
      expect(screen.getByRole('listitem')).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByRole('listitem')).toHaveTextContent(testLabel)
    })

    test('renders a selected value as expected', () => {
      getStatusOptionWrapper(sampleOption, testValue)
      expect(screen.getByRole('listitem')).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('listitem')).toHaveTextContent(testLabel)
    })

    test('renders as expected when value is null', () => {
      getStatusOptionWrapper({}, testValue)
      expect(screen.getByRole('listitem')).toHaveTextContent('')
    })
  })
})
