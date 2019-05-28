/* global wait */
import React from 'react'
import { clone } from 'lodash'
import { mount } from 'enzyme'

import PaperApplicationForm from 'components/applications/application_form/PaperApplicationForm'
import listing from '../../../fixtures/listing'
import application from '../../../fixtures/domain_application'
import lendingInstitutions from '../../../fixtures/lending_institutions'

const mockSubmitApplication = jest.fn()

let testApplication = null

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
    testApplication = clone(application)
  })

  describe('should validate fields correctly: ', () => {
    test('Annual Income', async () => {
      testApplication['annual_income'] = 'foo'
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
        />
      )

      wrapper.find('form').first().simulate('submit')

      await wait(100)

      const inputSel = 'input#annual_income'

      // Check that the elements that make up the annual income field are
      // present and have the correct validation error classes
      const fieldElementsSel = `${inputSel}.error`
      expect(wrapper.exists(fieldElementsSel)).toEqual(true)
      expect(wrapper.text()).toContain('Please enter a valid dollar amount.')
    })

    test('Language', async () => {
      testApplication['application_language'] = null
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => (null)}
        />
      )
      wrapper.find('form').first().simulate('submit')

      await wait(100)

      expect(wrapper.text()).toContain('Please select a language.')
      wrapper.find('#application_language select').simulate('change', { target: { value: 'English' } })
      wrapper.find('form').first().simulate('submit')
      expect(wrapper.text()).not.toContain('Please select a language.')
    })
  })

  describe('should render EligibilitySection correctly', () => {
    describe('rental listing', () => {
      test('section should be empty', async () => {
        const wrapper = mount(
          <PaperApplicationForm
            listing={listing}
            application={testApplication}
            lendingInstitutions={{}}
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
            application={testApplication}
            lendingInstitutions={{}}
          />
        )
        expect(wrapper.text()).toContain('Eligibility Information')
      })

      test('should allow lending institution and lending agent to be filled out', async () => {
        const wrapper = mount(
          <PaperApplicationForm
            listing={listing}
            lendingInstitutions={lendingInstitutions}
            application={testApplication}
          />
        )
        wrapper.find('#lending_institution select').simulate('change', { target: { value: 'First Republic Bank' } })
        expect(wrapper.text()).toContain('Hilary Byrde')
        wrapper.find('form').first().simulate('submit')
        expect(wrapper.text()).toContain('Please select a lender.')
        expect(wrapper.text()).toContain('The applicant cannot qualify for the listing unless this is true.')
        wrapper.find('#lending_agent select').simulate('change', { target: { value: 1 } })
        wrapper.find('form').first().simulate('submit')
        expect(wrapper.text()).not.toContain('Please select a lender.')
      })

      describe('lending institution and lender dropdowns should be filled out', () => {
        test('lender select should be filled out', async () => {
          testApplication.lending_agent = '003U000001Wnp5gIAB'
          const wrapper = mount(
            <PaperApplicationForm
              listing={listing}
              lendingInstitutions={lendingInstitutions}
              application={testApplication}
            />
          )
          await wait(100)
          expect(wrapper.find('#lending_institution select').props().value).toEqual('First Republic Bank')
          expect(wrapper.find('#lending_agent select').props().value).toEqual('003U000001Wnp5gIAB')
        })
      })
    })
  })
})
