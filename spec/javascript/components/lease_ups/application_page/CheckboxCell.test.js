import React from 'react'

import { shallow } from 'enzyme'

import UnlabeledCheckbox from 'components/atoms/UnlabeledCheckbox'
import CheckboxCell from 'components/lease_ups/application_page/CheckboxCell'

const mockOnClick = jest.fn()

describe('CheckboxCell', () => {
  describe('when not checked', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <CheckboxCell applicationId='applicationId1' checked={false} onClick={mockOnClick} />
      )
        .find(UnlabeledCheckbox)
        .dive()
    })

    test('the input is set to unchecked', () => {
      expect(wrapper.find('input').props().checked).toBeFalsy()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      wrapper.find('input').simulate('click')
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })

  describe('when checked', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <CheckboxCell applicationId='applicationId1' checked={true} onClick={mockOnClick} />
      )
        .find(UnlabeledCheckbox)
        .dive()
    })

    test('the input is set to unchecked', () => {
      expect(wrapper.find('input').props().checked).toBeTruthy()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      wrapper.find('input').simulate('click')
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })
})
