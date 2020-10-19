import React from 'react'
import { mount, shallow } from 'enzyme'
import Select from 'react-select'

import UnitDropdown, { renderUnitOption } from '~/components/molecules/UnitDropdown'

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
  }
]

const getWrapper = (propOverrides = {}) =>
  mount(<UnitDropdown onChange={ON_CHANGE} availableUnits={[]} {...propOverrides} />)

describe('UnitDropdown', () => {
  let wrapper
  test('it renders a select', () => {
    wrapper = getWrapper()
    expect(wrapper.find(Select).exists()).toBeTruthy()
  })

  describe('toggle', () => {
    test('renders as expected when value is null', () => {
      wrapper = getWrapper({ availableUnits: units })
      const expectedButtonClasses = [
        'dropdown-button',
        'dropdown-select',
        'has-icon--right',
        'text-align-left',
        'expand'
      ]
      const toggleButton = wrapper.find(Select).find('.unit-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('Select One...')
      expect(toggleButton.hasClass(expectedButtonClasses.join(' '))).toEqual(true)
      expect(toggleButton.prop('disabled')).toEqual(false)
    })

    test('renders when the dropdown is disabled', () => {
      wrapper = getWrapper({ disabled: true })
      const toggleButton = wrapper.find(Select).find('.unit-dropdown__control').find('button')
      expect(toggleButton.prop('disabled')).toEqual(true)
    })

    test('renders a unit when provided', () => {
      wrapper = getWrapper({ unit: units[1].id, availableUnits: units })
      const toggleButton = wrapper.find(Select).find('.unit-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual(units[1].unit_number)
    })

    test('renders Units Available', () => {
      wrapper = getWrapper({ unit: null, availableUnits: [] })
      const toggleButton = wrapper.find(Select).find('.unit-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('No Units Available')
    })
  })

  describe('renderUnitOption', () => {
    const getUnitOptionWrapper = (option, selectedValue) =>
      shallow(renderUnitOption(option, { selectValue: [{ value: selectedValue }] }))

    test('renders selected unit option', () => {
      wrapper = getUnitOptionWrapper(units[0], units[0].id)
      expect(wrapper.find('li').hasClass('dropdown-menu_unit')).toEqual(true)
      expect(wrapper.find('li').prop('aria-selected')).toEqual(true)
      expect(wrapper.text()).toEqual('123studio50% (HUD)')
    })

    test('renders not selected unit option', () => {
      wrapper = getUnitOptionWrapper(units[0], units[1].id)
      expect(wrapper.find('li').hasClass('dropdown-menu_unit')).toEqual(true)
      expect(wrapper.find('li').prop('aria-selected')).toEqual(false)
      expect(wrapper.text()).toEqual('123studio50% (HUD)')
    })

    test('renders as expected with a null value', () => {
      wrapper = getUnitOptionWrapper({}, units[1].id)
      expect(wrapper.find('li').hasClass('dropdown-menu_unit')).toEqual(true)
      expect(wrapper.text()).toEqual('Select One...')
    })
  })
})
