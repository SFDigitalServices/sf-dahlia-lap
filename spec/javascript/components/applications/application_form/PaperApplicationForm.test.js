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

      expect(wrapper).toMatchSnapshot()
    })
  })
})
