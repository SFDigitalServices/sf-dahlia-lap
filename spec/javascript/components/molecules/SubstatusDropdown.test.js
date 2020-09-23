import React from 'react'
import { mount, shallow } from 'enzyme'
import Select from 'react-select'

import SubstatusDropdown, { renderSubstatusOption } from '~/components/molecules/SubstatusDropdown'
import { LEASE_UP_SUBSTATUS_OPTIONS } from '~/utils/statusUtils'
import Dropdown from '~/components/molecules/Dropdown'

const ON_CHANGE = jest.fn()
const APPEALED_SUBSTATUS = LEASE_UP_SUBSTATUS_OPTIONS.Appealed[0].value

const getWrapper = (propOverrides = {}) => mount(
  <SubstatusDropdown
    onChange={ON_CHANGE}
    {...propOverrides}
  />
)

describe('SubstatusDropdown', () => {
  let wrapper
  test('it renders a select', () => {
    wrapper = getWrapper()
    expect(wrapper.find(Select).exists()).toBeTruthy()
  })

  test('it renders with default props correctly', () => {
    wrapper = getWrapper()

    const dropdownProps = wrapper.find(Dropdown).props()
    expect(dropdownProps.items).toEqual([])
    expect(dropdownProps.value).toBeNull()
    expect(dropdownProps.placeholder).toEqual('Select one...')
    expect(dropdownProps.disabled).toBeFalsy()
  })

  test('it passes the expected options to Dropdown when a status is provided', () => {
    wrapper = getWrapper({ status: 'Appealed' })

    const dropdownProps = wrapper.find(Dropdown).props()
    expect(dropdownProps.items).toEqual(LEASE_UP_SUBSTATUS_OPTIONS.Appealed)
  })

  describe('toggle', () => {
    test('renders as expected when value is null', () => {
      wrapper = getWrapper()
      const expectedButtonClasses = [
        'button',
        'dropdown-button',
        'substatus',
        'has-icon--right',
        'text-align-left'
      ]
      const toggleButton = wrapper.find(Select).find('.substatus-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('Select one...')
      expect(toggleButton.hasClass(expectedButtonClasses.join(' '))).toEqual(true)
      expect(toggleButton.prop('disabled')).toEqual(false)
    })

    test('renders without any additional button styles when none are provided', () => {
      wrapper = getWrapper()
      const toggleButton = wrapper.find(Select).find('.substatus-dropdown__control').find('button')
      expect(toggleButton.hasClass('expand')).toBe(false)
      expect(toggleButton.hasClass('error')).toBe(false)
    })

    test('renders additional styles when provided', () => {
      wrapper = getWrapper({ expand: true, hasError: true })
      const toggleButton = wrapper.find(Select).find('.substatus-dropdown__control').find('button')
      expect(toggleButton.hasClass('expand')).toBe(true)
      expect(toggleButton.hasClass('error')).toBe(true)
    })

    test('renders value when provided', () => {
      wrapper = getWrapper({ status: 'Appealed', subStatus: APPEALED_SUBSTATUS })
      const toggleButton = wrapper.find(Select).find('.substatus-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual(APPEALED_SUBSTATUS)
    })

    test('renders as disabled when the dropdown is disabled', () => {
      wrapper = getWrapper({ disabled: true })
      const toggleButton = wrapper.find(Select).find('.substatus-dropdown__control').find('button')
      expect(toggleButton.prop('disabled')).toEqual(true)
    })

    test('renders a placeholder when provided', () => {
      wrapper = getWrapper({ placeholder: 'placeholder' })
      const toggleButton = wrapper.find(Select).find('.substatus-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('placeholder')
    })
  })

  describe('renderSubstatusOption', () => {
    const getStatusOptionWrapper = (option, selectedValue) => shallow(
      renderSubstatusOption(option, { selectValue: [{ value: selectedValue }] })
    )
    const testValue = 'testValue'
    const testLabel = 'testLabel'
    const sampleOption = {
      value: testValue,
      label: testLabel
    }

    test('renders a value that\'s not selected as expected', () => {
      wrapper = getStatusOptionWrapper(sampleOption, 'otherValue')
      expect(wrapper.find('li').prop('aria-selected')).toEqual(false)
      expect(wrapper.text()).toEqual(testLabel)
    })

    test('renders a selected value as expected', () => {
      wrapper = getStatusOptionWrapper(sampleOption, testValue)
      expect(wrapper.find('li').prop('aria-selected')).toEqual(true)
      expect(wrapper.text()).toEqual(testLabel)
    })

    test('renders as expected when value is null', () => {
      wrapper = getStatusOptionWrapper({}, testValue)
      expect(wrapper.text()).toEqual('')
    })
  })
})
