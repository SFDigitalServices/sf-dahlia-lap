import React from 'react'
import renderer from 'react-test-renderer'
import { act } from 'react-dom/test-utils'
import { clone } from 'lodash'
import { mount } from 'enzyme'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import listing from '../../fixtures/listing'
import application from '../../fixtures/application'
import lendingInstitutions from '../../fixtures/lending_institutions'

const mockSubmitApplication = jest.fn()

jest.mock('apiService', () => {
  return {
    submitApplication: async (application) => {
      mockSubmitApplication(application)
      return { application }
    }
  }
})

describe('ApplicationEditPage', () => {
  // navigation helper for tests that change window.location on success
  const originalLocation = window.location
  beforeEach(() => {
    delete window.location
    window.location = { href: '' }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  test('it should save correctly', async () => {
    let wrapper
    await act(async () => {
      wrapper = mount(
        <ApplicationEditPage
          listing={listing}
          application={application}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )
    })
    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })

    let domainApplication = application
    domainApplication['listing_id'] = listing['id']
    domainApplication['preferences'][0]['naturalKey'] = 'karen,jones,1950-01-01'
    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(domainApplication)
  })

  describe('should render', () => {
    test('successfully', () => {
      const wrapper = renderer.create(
        <ApplicationEditPage
          listing={listing}
          application={application}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )

      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    test('successfully with preferences', () => {
      const applicationWithPreferences = clone(application)

      applicationWithPreferences.preferences[0].Application_Member = {
        Date_of_Birth: '1981-05-04',
        First_Name: 'Flagby',
        Id: 'a0n0x000000B3xDAAS',
        Last_Name: 'Email'
      }

      expect(applicationWithPreferences.preferences).toHaveLength(1)
      expect(applicationWithPreferences.preferences[0].Application_Member).toBeTruthy()

      const wrapper = renderer.create(
        <ApplicationEditPage
          listing={listing}
          application={application}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )

      expect(wrapper.toJSON()).toMatchSnapshot()
    })
  })
})
