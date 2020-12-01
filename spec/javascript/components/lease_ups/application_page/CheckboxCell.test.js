import React from 'react'

import { shallow } from 'enzyme'

import Checkbox from 'components/atoms/Checkbox'
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

    test('the input is set to unchecked', () => {
      expect(wrapper.find(Checkbox).props().checked).toBeFalsy()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      wrapper.find(Checkbox).simulate('click')
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

    test('the input is set to unchecked', () => {
      expect(wrapper.find(Checkbox).props().checked).toBeTruthy()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      wrapper.find(Checkbox).simulate('click')
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })
})
