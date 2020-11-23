import React from 'react'

import { mount } from 'enzyme'
import Select from 'react-select'

import Dropdown from 'components/molecules/Dropdown'
import StatusDropdown from 'components/molecules/StatusDropdown'
import { LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

const ON_CHANGE = jest.fn()

const getWrapper = (propOverrides = {}) =>
  mount(<StatusDropdown onChange={ON_CHANGE} {...propOverrides} />)

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

  describe('toggle', () => {
    test('renders as expected when value is null', () => {
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

    test('renders without any additional button styles when none are provided', () => {
      wrapper = getWrapper()
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.hasClass('expand')).toBe(false)
      expect(toggleButton.hasClass('tiny')).toBe(false)
      expect(toggleButton.hasClass('small')).toBe(false)
    })

    test('renders with additional styles when provided', () => {
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

    test('renders value with styles when provided', () => {
      wrapper = getWrapper({ status: 'Appealed' })
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('Appealed')
      expect(toggleButton.hasClass('is-appealed')).toBe(true)
    })

    test('renders when the dropdown is disabled', () => {
      wrapper = getWrapper({ disabled: true })
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.prop('disabled')).toEqual(true)
    })

    test('renders a placeholder when provided', () => {
      wrapper = getWrapper({ placeholder: 'placeholder' })
      const toggleButton = wrapper.find(Select).find('.status-dropdown__control').find('button')
      expect(toggleButton.text()).toEqual('placeholder')
    })
  })

  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('renderStatusOption', () => {
  //   const getStatusOptionWrapper = (option, selectedValue) =>
  //     shallow(renderStatusOption(option, { selectValue: [{ value: selectedValue }] }))
  //   const testValue = 'testValue'
  //   const testStatusClassName = 'status-class-name'
  //   const testLabel = 'testLabel'
  //   const sampleOption = {
  //     value: testValue,
  //     label: testLabel,
  //     statusClassName: testStatusClassName
  //   }

  // eslint-disable-next-line jest/no-commented-out-tests
  //   test('renders a styled value with expected styles', () => {
  //     wrapper = getStatusOptionWrapper(sampleOption, 'notSelected')
  //     expect(wrapper.find('li').hasClass(testStatusClassName)).toEqual(true)
  //     expect(wrapper.find('li').hasClass('dropdown-menu_item')).toEqual(true)
  //     expect(wrapper.text()).toEqual(testLabel)
  //     // Verify that its not selected
  //     expect(wrapper.find('li').prop('aria-selected')).toEqual(false)
  //   })

  // eslint-disable-next-line jest/no-commented-out-tests
  //   test('renders a selected value as expected', () => {
  //     wrapper = getStatusOptionWrapper(sampleOption, testValue)
  //     expect(wrapper.find('li').prop('aria-selected')).toEqual(true)
  //     expect(wrapper.text()).toEqual(testLabel)
  //   })

  // eslint-disable-next-line jest/no-commented-out-tests
  //   test('renders as expected with a null value', () => {
  //     wrapper = getStatusOptionWrapper({}, testValue)
  //     expect(wrapper.find('li').hasClass(testStatusClassName)).toEqual(false)
  //     expect(wrapper.text()).toEqual('')
  //   })
  // })
})
