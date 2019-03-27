/* global wait */
import React from 'react'
import renderer from 'react-test-renderer'
import { clone } from 'lodash'
import { mount } from 'enzyme'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import listing from '../../fixtures/listing'
import application from '../../fixtures/application'
import mockApplicationApiEditPayload from '../../fixtures/application_api_edit_payload'

const mockSubmitApplication = jest.fn()

jest.mock('apiService', () => {
  return {
    submitApplication: async (data) => {
      mockSubmitApplication(data)
      return true
    }
  }
})

describe('ApplicationEditPage', () => {
  test('it should save correctly', async () => {
    const wrapper = mount(
      <ApplicationEditPage
        listing={listing}
        application={application}
        editPage />
    )

    wrapper.find('form').first().simulate('submit')

    await wait(100)

    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(mockApplicationApiEditPayload)
  })

  describe('should render', () => {
    test('successfully', () => {
      const wrapper = renderer.create(
        <ApplicationEditPage
          listing={listing}
          application={application}
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
          editPage />
      )

      expect(wrapper.toJSON()).toMatchSnapshot()
    })
  })
})
