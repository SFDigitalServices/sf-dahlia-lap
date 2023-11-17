import React from 'react'

import { render, screen } from '@testing-library/react'
import { components } from 'react-select'

import Dropdown from 'components/molecules/Dropdown'

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

const getScreen = (propOverrides = {}) =>
  render(
    <Dropdown
      renderOption={defaultOptionRenderer}
      renderToggle={defaultToggleRenderer}
      onChange={jest.fn()}
      {...propOverrides}
    />
  )

describe('Dropdown', () => {
  test('it renders a select', () => {
    getScreen()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    // expect(wrapper.dive().find(selectSelector).exists()).toBeTruthy()
  })

  test('it renders with default props correctly', () => {
    const { asFragment } = getScreen()
    expect(screen.getByRole('combobox')).toBeEnabled()
    expect(asFragment()).toMatchSnapshot()
  })

  test('it passes the passes provided props to the Select component', () => {
    const sampleItems = [
      { value: 'value1', label: 'label1' },
      { value: 'value2', label: 'label2' },
      { value: 'value3', label: 'label3' }
    ]
    const testClassNamePrefix = 'classNamePrefix'
    const { asFragment } = getScreen({
      items: sampleItems,
      value: 'value2',
      classNamePrefix: testClassNamePrefix,
      disabled: true
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
