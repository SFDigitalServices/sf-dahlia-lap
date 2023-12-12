import React from 'react'

import { render, screen } from '@testing-library/react'

import UnitDropdown, { renderUnitOption } from 'components/molecules/UnitDropdown'

const ON_CHANGE = jest.fn()
const units = [
  {
    id: '1',
    unit_number: '123',
    unit_type: 'studio',
    priority_type: null,
    max_ami_for_qualifying_unit: 50,
    ami_chart_type: 'HUD'
  },
  {
    id: '2',
    unit_number: '100',
    unit_type: 'studio',
    priority_type: null,
    max_ami_for_qualifying_unit: 50,
    ami_chart_type: 'HUD'
  },
  {
    id: '0',
    unit_number: '0',
    unit_type: 'studio',
    priority_type: null,
    max_ami_for_qualifying_unit: 50,
    ami_chart_type: 'HUD'
  }
]

const getScreen = (propOverrides = {}) =>
  render(<UnitDropdown onChange={ON_CHANGE} availableUnits={[]} {...propOverrides} />)

describe('UnitDropdown', () => {
  test('it renders a select', () => {
    getScreen()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  describe('toggle', () => {
    test('renders as expected when value is null', () => {
      getScreen({ availableUnits: units })
      const expectedButtonClasses = [
        'dropdown-button',
        'dropdown-select',
        'has-icon--right',
        'text-align-left',
        'expand'
      ]
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Select One...')
      expect(button).toHaveClass(expectedButtonClasses.join(' '))
      expect(button).toBeEnabled()
    })

    test('renders when the dropdown is disabled', () => {
      getScreen({ disabled: true })
      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('renders a unit when provided', () => {
      getScreen({ unit: units[1].id, availableUnits: units })
      expect(screen.getByRole('button')).toHaveTextContent(units[1].unit_number)
    })

    test('renders Units Available', () => {
      getScreen({ unit: null, availableUnits: [] })
      expect(screen.getByRole('button')).toHaveTextContent('No Units Available')
    })
  })

  describe('renderUnitOption', () => {
    const getUnitOptionWrapper = (option, selectedValue) =>
      render(renderUnitOption(option, { selectValue: [{ value: selectedValue }] }))

    test('renders selected unit option', () => {
      getUnitOptionWrapper(units[0], units[0].id)
      const li = screen.getByRole('listitem')
      expect(li).toHaveClass('dropdown-menu_unit')
      expect(li).toHaveAttribute('aria-selected', 'true')
      expect(li).toHaveTextContent('123studio50% (HUD)')
    })

    test('renders not selected unit option', () => {
      getUnitOptionWrapper(units[0], units[1].id)
      const li = screen.getByRole('listitem')
      expect(li).toHaveClass('dropdown-menu_unit')
      expect(li).toHaveAttribute('aria-selected', 'false')
      expect(li).toHaveTextContent('123studio50% (HUD)')
    })

    test('renders as expected with a null value', () => {
      getUnitOptionWrapper({}, units[1].id)
      expect(screen.getByRole('listitem')).toHaveClass('dropdown-menu_unit')
      expect(screen.getByText('Select One...')).toBeInTheDocument()
    })

    test('renders unit with number `0`', () => {
      getUnitOptionWrapper(units[2], units[2].id)
      const li = screen.getByRole('listitem')
      expect(li).toHaveClass('dropdown-menu_unit')
      expect(li).toHaveAttribute('aria-selected', 'true')
      expect(li).toHaveTextContent('0studio50% (HUD)')
    })
  })
})
