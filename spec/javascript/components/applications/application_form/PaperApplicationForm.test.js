/* global wait */
import React from 'react'
import { clone } from 'lodash'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import PaperApplicationForm from 'components/applications/application_form/PaperApplicationForm'
import listing from '../../../fixtures/listing'
import application from '../../../fixtures/domain_application'
import lendingInstitutions from '../../../fixtures/lending_institutions'

const DECLINE = 'Decline to state'
const mockSubmitApplication = jest.fn()

let testApplication

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
      await wrapper.find('form').first().simulate('submit')

      expect(wrapper.text()).toContain('Please select a language.')
      wrapper.find('#application_language select').simulate('change', { target: { value: 'English' } })
      wrapper.find('#application_language select').simulate('blur')
      wrapper.find('form').first().simulate('submit')
      expect(wrapper.text()).not.toContain('Please select a language.')
    })

    test('Alternate Contact', async () => {
      testApplication['alternate_contact'] = {
        'first_name': 'Federic',
        'middle_name': 'Daaaa',
        'last_name': 'dayan',
        'email': 'fede@eee.com'
      }
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => (null)}
        />
      )
      await wrapper.find('form').first().simulate('submit')
      // Expect no errors since alternate contact is filled out with required values
      expect(wrapper.text()).not.toContain('Please enter a First Name')

      // Delete alt contact first name and expect validation
      wrapper.find('#alt_first_name input').simulate('change', { target: { value: '' } })
      wrapper.find('form').first().simulate('submit')
      expect(wrapper.text()).toContain('Please enter a First Name')

      // Remove all values and expect the validation to go away
      wrapper.find('#alt_first_name input').simulate('change', { target: { value: '' } })
      wrapper.find('#alt_middle_name input').simulate('change', { target: { value: '' } })
      wrapper.find('#alt_last_name input').simulate('change', { target: { value: '' } })
      wrapper.find('[name="alternate_contact.email"] input').simulate('change', { target: { value: '' } })
      wrapper.find('form').first().simulate('submit')
      expect(wrapper.text()).not.toContain('Please enter a First Name')
    })

    test('Annual Income', async () => {
      testApplication['annual_income'] = 'foo'
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
        />
      )

      await wrapper.find('form').first().simulate('submit')

      const inputSel = 'input#annual_income'

      // Check that the elements that make up the annual income field are
      // present and have the correct validation error classes
      const fieldElementsSel = `${inputSel}.error`
      expect(wrapper.exists(fieldElementsSel)).toEqual(true)
      expect(wrapper.text()).toContain('Please enter a valid dollar amount.')
    })

    test('Demographics Defaults', async () => {
      testApplication['demographics'] = {}
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => (null)}
        />
      )
      await wrapper.find('form').first().simulate('submit')

      expect(wrapper.text()).toContain('Ethnicity is required')
      expect(wrapper.text()).toContain('Race is required')
      expect(wrapper.text()).toContain('Gender is required')
      expect(wrapper.text()).toContain('Sexual Orientation is required')

      wrapper.find(`select[name="demographics.ethnicity"] option[value="${DECLINE}"]`).simulate('change').simulate('blur')
      wrapper.find(`select[name="demographics.race"] option[value="${DECLINE}"]`).simulate('change').simulate('blur')
      wrapper.find(`select[name="demographics.gender"] option[value="${DECLINE}"]`).simulate('change').simulate('blur')
      wrapper.find(`select[name="demographics.sexual_orientation"] option[value="${DECLINE}"]`).simulate('change').simulate('blur')
      await wrapper.find('form').first().simulate('submit')

      expect(wrapper.text()).not.toContain('Ethnicity is required')
      expect(wrapper.text()).not.toContain('Race is required')
      expect(wrapper.text()).not.toContain('Gender is required')
      expect(wrapper.text()).not.toContain('Sexual Orientation is required')
    })

    test('Demographics Not Listed', async () => {
      testApplication['demographics'] = {}
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => (null)}
        />
      )
      // Select "Not Listed" for gender and sexual orientation
      wrapper.find('select[name="demographics.gender"]').simulate('change', { target: { value: 'Not Listed' } })
      wrapper.find('select[name="demographics.gender"]').simulate('blur')
      wrapper.find('select[name="demographics.sexual_orientation"]').simulate('change', { target: { value: 'Not Listed' } })
      wrapper.find('select[name="demographics.sexual_orientation"]').simulate('blur')

      // Expect that gender/sexual orientation fields are labeled as required
      expect(wrapper.find('label#label-demographics-gender_other').text()).toContain('(required)')
      expect(wrapper.find('label#label-demographics-sexual_orientation_other').text()).toContain('(required)')
      await wrapper.find('form').first().simulate('submit')

      // Check that these validation messages are shown since Not Listed was chosen
      expect(wrapper.text()).toContain('Gender is required')
      expect(wrapper.text()).toContain('Sexual Orientation is required')

      // Fill out the gender/sexual orientation other fields
      wrapper.find('input[name="demographics.gender_other"]').simulate('change', { target: { value: 'Not Listed' } })
      wrapper.find('input[name="demographics.gender_other"]').simulate('blur')
      wrapper.find('input[name="demographics.sexual_orientation_other"]').simulate('change', { target: { value: 'Not Listed' } })
      wrapper.find('input[name="demographics.sexual_orientation_other"]').simulate('blur')
      wrapper.find('form').first().simulate('submit')

      expect(wrapper.text()).not.toContain('Gender is required')
      expect(wrapper.text()).not.toContain('Sexual Orientation is required')

      // Change selected gender/orientation to somethiing other than not listed
      wrapper.find(`select[name="demographics.gender"] option[value="${DECLINE}"]`).simulate('change').simulate('blur')
      wrapper.find(`select[name="demographics.sexual_orientation"] option[value="${DECLINE}"]`).simulate('change').simulate('blur')

      // Expect the required block note to disappear
      expect(wrapper.find('label#label-demographics-gender_other').text()).not.toContain('(required)')
      expect(wrapper.find('label#label-demographics-sexual_orientation_other').text()).not.toContain('(required)')
    })

    test('Signature on Terms of Agreement', async () => {
      testApplication['terms_acknowledged'] = false
      const wrapper = mount(
        <PaperApplicationForm
          listing={listing}
          application={testApplication}
          lendingInstitutions={{}}
          onSubmit={() => (null)}
        />
      )
      await wrapper.find('form').first().simulate('submit')

      expect(wrapper.text()).toContain('Signature on Terms of Agreement is required')

      wrapper.find('input[name="terms_acknowledged"]').simulate('change', { target: { value: true } })
      wrapper.find('input[name="terms_acknowledged"]').simulate('blur')
      wrapper.find('form').first().simulate('submit')

      await wait(100)

      expect(wrapper.text()).not.toContain('Signature on Terms of Agreement is required')
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
        wrapper.find('#lending_agent select').simulate('blur')
        wrapper.find('form').first().simulate('submit')
        expect(wrapper.text()).not.toContain('Please select a lender.')
      })

      describe('lending institution and lender dropdowns should be filled out', () => {
        test('lender select should be filled out', async () => {
          testApplication.lending_agent = '003U000001Wnp5gIAB'
          let wrapper
          await act(async () => {
            wrapper = mount(
              <PaperApplicationForm
                listing={listing}
                lendingInstitutions={lendingInstitutions}
                application={testApplication}
              />
            )
          })
          // add additional tick to allow lending institutions to load
          await wrapper.update()

          expect(wrapper.find('#lending_institution select').props().value).toEqual('First Republic Bank')
          expect(wrapper.find('#lending_agent select').props().value).toEqual('003U000001Wnp5gIAB')
        })
      })
    })
  })
})
