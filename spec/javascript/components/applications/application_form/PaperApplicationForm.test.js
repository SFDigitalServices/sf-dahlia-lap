/* global wait */
import React from 'react'
import { clone } from 'lodash'
import { mount } from 'enzyme'

import PaperApplicationForm from 'components/applications/application_form/PaperApplicationForm'
import listing from '../../../fixtures/listing'
import application from '../../../fixtures/domain_application'

const mockSubmitApplication = jest.fn()
const applicationWithInvalidAnnualIncome = clone(application)

jest.mock('apiService', () => {
  return {
    submitApplication: async (data) => {
      mockSubmitApplication(data)
      return true
    }
  }
})

describe('PaperApplicationForm', () => {
  beforeEach(() => {
    applicationWithInvalidAnnualIncome['annual_income'] = 'foo'
  })

  describe('should validate fields correctly: ', () => {
    test('Annual Income', async () => {
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

  describe('should render EligibilitySection correctly', () => {
    describe('rental listing', () => {
      test('section should be empty', async () => {
        const wrapper = mount(
          <PaperApplicationForm
            listing={listing}
            application={applicationWithInvalidAnnualIncome}
          />
        )
        expect(wrapper.text()).not.toContain('Eligibility Information')
      })
    })

    describe('sale listing', () => {
      beforeEach(() => {
        listing.is_sale = true
        listing.is_rental = false
      })

      test('should show Eligibility Section', async () => {
        const wrapper = mount(
          <PaperApplicationForm
            listing={listing}
            application={applicationWithInvalidAnnualIncome}
          />
        )
        expect(wrapper.text()).toContain('Eligibility Information')
      })
    })
  })
})
