import React from 'react'
import { shallow } from 'enzyme'
import Dropdown from '~/components/molecules/Dropdown'
import { components } from 'react-select'

const defaultOptionRenderer = ({ label }) => (
  <li>
    <a>{label}</a>
  </li>
)

const defaultToggleRenderer = ({ children, getValue, ...props }) => {
  const val = getValue()[0]
  return (
    <button>
      {val?.label ? val.label : 'placeholder'}
      <components.ValueContainer getValue={getValue} {...props}>
        {children}
      </components.ValueContainer>
    </button>
  )
}

const getWrapper = (propOverrides = {}) => shallow(
  <Dropdown
    renderOption={defaultOptionRenderer}
    renderToggle={defaultToggleRenderer}
    onChange={jest.fn()}
    {...propOverrides}
  />
)

describe(Dropdown, () => {
  let wrapper
  test('it renders a select', () => {
    wrapper = getWrapper()
    expect(wrapper.dive().find('Select').exists()).toBeTruthy()
  })

  test('it renders with default props correctly', () => {
    wrapper = getWrapper()
    const selectProps = wrapper.dive().find('Select').props()
    expect(selectProps.classNamePrefix).toBeNull()
    expect(selectProps.isDisabled).toBe(false)
    expect(selectProps.options).toEqual([])
    expect(selectProps.value).toBeNull()
    expect(selectProps.formatOptionLabel).toBe(defaultOptionRenderer)
    expect(selectProps.components.ValueContainer).toBe(defaultToggleRenderer)
  })

  test('it passes the passes provided props to the Select component', () => {
    const sampleItems = [
      { value: 'value1', label: 'label1' },
      { value: 'value2', label: 'label2' },
      { value: 'value3', label: 'label3' }
    ]
    const testClassNamePrefix = 'classNamePrefix'
    wrapper = getWrapper({
      items: sampleItems,
      value: 'value2',
      classNamePrefix: testClassNamePrefix,
      disabled: true
    })
    const selectProps = wrapper.dive().find('Select').props()
    expect(selectProps.classNamePrefix).toEqual(testClassNamePrefix)
    expect(selectProps.isDisabled).toBe(true)
    expect(selectProps.value).toEqual(sampleItems[1])
    expect(selectProps.options).toEqual(sampleItems)
  })
})
