import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'
import FormModal from '~/components/organisms/FormModal'
import { LEASE_UP_SUBSTATUS_OPTIONS } from '~/utils/statusUtils'
import StatusDropdown from '~/components/molecules/StatusDropdown'
import SubstatusDropdown from '~/components/molecules/SubstatusDropdown'
import { TextAreaField } from '~/utils/form/final_form/Field'
import AlertBox from '~/components/molecules/AlertBox'

// We need to import statusUtils with require so we can use jest.spyOn
const statusUtils = require('~/utils/statusUtils')
const ON_SUBMIT = jest.fn()
const ON_ALERT_CLOSE_CLICK = jest.fn()
const HEADER = 'Heading'

const getWrapper = (propOverrides = {}) => mount(
  <StatusModalWrapper
    header={HEADER}
    onSubmit={ON_SUBMIT}
    onAlertCloseClick={ON_ALERT_CLOSE_CLICK}
    loading={false}
    submitButton='Update'
    {...propOverrides}
  />
).update()

describe('StatusModalWrapper', () => {
  let wrapper
  test('should render the FormModal as closed if isOpen is false', () => {
    wrapper = getWrapper({ isOpen: false })

    expect(wrapper.find(FormModal).prop('isOpen')).toBeFalsy()
  })

  test('should open a closeable alert modal when showAlert is true', () => {
    const alertMessage = 'test alert message'
    wrapper = getWrapper({ showAlert: true, alertMsg: alertMessage, isOpen: true })
    expect(wrapper.find(AlertBox).exists).toBeTruthy()
    expect(wrapper.find(AlertBox).props().message).toEqual(alertMessage)

    wrapper.find(AlertBox).find('button.close').simulate('click')
    expect(ON_ALERT_CLOSE_CLICK).toHaveBeenCalled()
  })

  test('should validate the form and call onSubmit function on submit', () => {
    const validateSpy = jest.spyOn(statusUtils, 'validateStatusForm')
    wrapper = getWrapper({ status: 'Lease Signed', isOpen: true })

    wrapper.find('button.primary').simulate('submit')
    expect(ON_SUBMIT).toHaveBeenCalled()
    expect(validateSpy).toHaveBeenCalled()
  })
  test('should display the status dropdown with the status provided', () => {
    wrapper = getWrapper({ status: 'Appealed', isOpen: true })
    expect(wrapper.find(StatusDropdown).props().status).toBeTruthy()
  })
  test('should display correct substatus options if substatuses are available', () => {
    wrapper = getWrapper({ status: 'Appealed', isOpen: true })

    expect(wrapper.find(SubstatusDropdown).exists()).toBeTruthy()
    const expectedAppealedItems = LEASE_UP_SUBSTATUS_OPTIONS.Appealed
    expect(wrapper.find(SubstatusDropdown).find('Dropdown').props().items).toEqual(expect.arrayContaining(expectedAppealedItems))
  })

  test('should not display sub status dropdown if substatuses are not available', () => {
    wrapper = getWrapper({ status: 'Processing', isOpen: true })

    expect(wrapper.find(SubstatusDropdown).exists()).toBeFalsy()
  })

  test('should not require comment if status does not require comment', () => {
    wrapper = getWrapper({ status: 'Lease Signed', isOpen: true })
    wrapper.find('button.primary').simulate('submit')

    expect(wrapper.find(TextAreaField).find('FieldError > span.error').exists()).toBeFalsy()
    expect(ON_SUBMIT).toHaveBeenCalled()
  })

  describe('when required fields are missing', () => {
    test('should not show error state before fields are touched', () => {
      wrapper = getWrapper({ status: 'Appealed', isOpen: true })

      expect(wrapper.find(SubstatusDropdown).props().hasError).toBeFalsy()
      expect(wrapper.find(TextAreaField).find('FieldError > span.error').exists()).toBeFalsy()
    })

    test('should show error state for substatus and comment on submit if required', () => {
      wrapper = getWrapper({ status: 'Appealed', isOpen: true })
      wrapper.find('button.primary').simulate('submit')

      expect(wrapper.find(SubstatusDropdown).props().hasError).toBe(true)
      // Expect the comment field to have an error
      expect(wrapper.find(TextAreaField).find('FieldError > span.error').exists()).toBeTruthy()
      // Expect that we did not try to submit
      expect(ON_SUBMIT).not.toHaveBeenCalled()
    })

    test('should stop showing error state and allow submission when required fields are filled out', () => {
      wrapper = getWrapper({ status: 'Appealed', isOpen: true })

      wrapper.find('button.primary').simulate('submit')

      // Verify there are errors initially
      expect(wrapper.find(SubstatusDropdown).props().hasError).toBe(true)
      expect(wrapper.find(TextAreaField).find('FieldError > span.error').exists()).toBeTruthy()
      expect(ON_SUBMIT).not.toHaveBeenCalled()

      // Fill out the fields and verify that the errors go away
      act(() => {
        wrapper.find(SubstatusDropdown).find('Select').instance().props.onChange({ value: LEASE_UP_SUBSTATUS_OPTIONS.Appealed[0].value })
      })
      wrapper.update()
      expect(wrapper.find(SubstatusDropdown).props().hasError).toBe(false)
      wrapper.find('textarea').simulate('change', { target: { value: 'Sample comment value' } })
      expect(wrapper.find(TextAreaField).find('FieldError > span.error').exists()).toBeFalsy()

      wrapper.find('button.primary').simulate('submit')
      expect(ON_SUBMIT).toHaveBeenCalled()
    })
  })
})
