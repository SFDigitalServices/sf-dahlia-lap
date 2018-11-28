/* global wait */
import React from 'react'
import { clone } from 'lodash'
import { mount } from 'enzyme'

import PaperApplicationForm from 'components/applications/application_form/PaperApplicationForm'
import listing from '../../../fixtures/listing'
import application from '../../../fixtures/domain_application'

const mockSubmitApplication = jest.fn()

jest.mock('apiService', () => {
  return {
    submitApplication: async (data) => {
      mockSubmitApplication(data)
      return true
    }
  }
})

describe('PaperApplicationForm', () => {
  describe('should validate fields correctly: ', () => {
    test('Annual Income', async () => {
      const applicationWithInvalidAnnualIncome = clone(application)
      applicationWithInvalidAnnualIncome['annual_income'] = 'foo'

      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={applicationWithInvalidAnnualIncome}
        />
      )

      wrapper.find('form').first().simulate('submit')

      await wait(100)

      const formGroupSel = '.form-group'
      const labelSel = 'label.form-label[htmlFor="annual_income"]'
      const fieldWrapper1Sel = 'r[field="annual_income"]'
      const fieldWrapper2Sel = 't#annual_income'
      const inputSel = 'input#annual_income'
      const errorMsgWrapperSel = 'FormError[field="annual_income"]'
      const errorMsgSel = 'span.small'

      // Check that the elements that make up the annual income field are
      // present and have the correct validation error classes
      const fieldElementsSel =
        `${formGroupSel}.error > ` +
        `${labelSel} + ` +
        `${fieldWrapper1Sel}.error > ` +
        `${fieldWrapper2Sel}.error > ` +
        `${inputSel}.error`
      expect(wrapper.exists(fieldElementsSel)).toEqual(true)

      // Check that the error message elements are present, have the
      // correct error classes, and correct error message text
      const errorElementsSel =
        `${formGroupSel}.error > ` +
        `${labelSel} + ` +
        `${fieldWrapper1Sel}.error + ` +
        `${errorMsgWrapperSel} > ` +
        `${errorMsgSel}.error`
      expect(wrapper.find(errorElementsSel).text()).toEqual('Please enter a valid dollar amount.')
    })
  })
})
