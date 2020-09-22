import React from 'react'
import { mount, shallow } from 'enzyme'
import Select from 'react-select'

import StatusDropdown, { renderStatusOption } from '~/components/molecules/StatusDropdown'
import { LEASE_UP_STATUS_OPTIONS } from '~/utils/statusUtils'
import Dropdown from '~/components/molecules/Dropdown'

const ON_CHANGE = jest.fn()

const getWrapper = (propOverrides = {}) => mount(
  <StatusDropdown
    onChange={ON_CHANGE}
    {...propOverrides}
  />
)

describe('StatusDropdown', () => {
  let wrapper
  test('it renders a select', () => {
    wrapper = getWrapper()
    expect(wrapper.find(Select).exists()).toBeTruthy()
  })

  test('it renders with default props correctly', () => {
    wrapper = getWrapper()

    const dropdownProps = wrapper.find(Dropdown).props()
    expect(dropdownProps.items).toEqual(LEASE_UP_STATUS_OPTIONS)
    expect(dropdownProps.value).toBeNull()
    expect(dropdownProps.placeholder).toEqual('Status')
    expect(dropdownProps.disabled).toBeFalsy()
  })

  describe('it renders the toggle as expected', () => {
    test('when value is null', () => {
      wrapper = getWrapper()
      const expectedButtonClasses = [
        'button',
        'dropdown-button',
        'has-icon--right',
        'text-align-left',
        'tertiary'
      ]
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('Status')
      expect(toggleButton.hasClass(expectedButtonClasses.join(' '))).toEqual(true)
      expect(toggleButton.prop('disabled')).toEqual(false)
    })

    test('without any additional button styles', () => {
      wrapper = getWrapper()
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.hasClass('expand')).toBe(false)
      expect(toggleButton.hasClass('tiny')).toBe(false)
      expect(toggleButton.hasClass('small')).toBe(false)
    })

    test('when additional styles are provided', () => {
      wrapper = getWrapper({ expand: true, size: 'tiny' })
      let toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.hasClass('expand')).toBe(true)
      expect(toggleButton.hasClass('tiny')).toBe(true)
      expect(toggleButton.hasClass('small')).toBe(false)

      wrapper = getWrapper({ expand: true, size: 'small' })
      toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.hasClass('tiny')).toBe(false)
      expect(toggleButton.hasClass('small')).toBe(true)
    })

    test('when value provided and is styled', () => {
      wrapper = getWrapper({ status: 'Appealed' })
      const expectedButtonClasses = [
        'button',
        'dropdown-button',
        'has-icon--right',
        'text-align-left',
        'is-appealed'
      ]
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('Appealed')
      expect(toggleButton.hasClass(expectedButtonClasses.join(' '))).toBe(true)
    })

    test('when the dropdown is disabled', () => {
      wrapper = getWrapper({ disabled: true })
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.prop('disabled')).toEqual(true)
    })

    test('when a placeholder is provided', () => {
      wrapper = getWrapper({ placeholder: 'placeholder' })
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('placeholder')
    })
  })

  describe('it renders the options as expected', () => {
    const getStatusOptionWrapper = (option, selectedValue) => shallow(
      renderStatusOption(option, { selectValue: [{ value: selectedValue }] })
    )
    const testValue = 'testValue'
    const testStatusClassName = 'status-class-name'
    const testLabel = 'testLabel'
    const sampleOption = {
      value: testValue,
      label: testLabel,
      statusClassName: testStatusClassName
    }

    test('with a styled value', () => {
      wrapper = getStatusOptionWrapper(sampleOption, 'notSelected')
      const expectedLiClasses = `dropdown-menu_item ${testStatusClassName}`
      expect(wrapper.find('li').hasClass(expectedLiClasses)).toEqual(true)
      expect(wrapper.text()).toEqual(testLabel)
      // Verify that its not selected
      expect(wrapper.find('li').prop('aria-selected')).toEqual(false)
    })

    test('with a selected value', () => {
      wrapper = getStatusOptionWrapper(sampleOption, testValue)
      expect(wrapper.find('li').prop('aria-selected')).toEqual(true)
      expect(wrapper.text()).toEqual(testLabel)
    })

    test('with a null value', () => {
      wrapper = getStatusOptionWrapper({}, testValue)
      expect(wrapper.find('li').hasClass(testStatusClassName)).toEqual(false)
      expect(wrapper.text()).toEqual('')
    })
  })
})
