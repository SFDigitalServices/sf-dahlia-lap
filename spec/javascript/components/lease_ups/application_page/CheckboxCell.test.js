import React from 'react'

import { shallow } from 'enzyme'

import CheckboxCell from 'components/lease_ups/application_page/CheckboxCell'

const mockOnClick = jest.fn()

describe('CheckboxCell', () => {
  describe('when not checked', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <CheckboxCell applicationId='applicationId1' checked={false} onClick={mockOnClick} />
      )
    })

    test('renders an input and a label', () => {
      expect(wrapper.find('input')).toHaveLength(1)
      expect(wrapper.find('label')).toHaveLength(1)
    })

    test('the input is set to unchecked', () => {
      expect(wrapper.find('input').props().checked).toBeFalsy()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      wrapper.find('input').simulate('change')
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })

  describe('when checked', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <CheckboxCell applicationId='applicationId1' checked={true} onClick={mockOnClick} />
      )
    })

    test('renders an input and a label', () => {
      expect(wrapper.find('input')).toHaveLength(1)
      expect(wrapper.find('label')).toHaveLength(1)
    })

    test('the input is set to unchecked', () => {
      expect(wrapper.find('input').props().checked).toBeTruthy()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      wrapper.find('input').simulate('change')
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })
})
