import React from 'react'
import renderer from 'react-test-renderer'
import { act } from 'react-dom/test-utils'
import { clone } from 'lodash'
import { mount } from 'enzyme'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import listing from '../../fixtures/listing'
import mockApplication from '../../fixtures/application'
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
          application={mockApplication}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )
    })
    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })

    const expectedApplication = {
      ...mockApplication,
      listing_id: listing['id']
    }

    expectedApplication['preferences'][0]['naturalKey'] = 'karen,jones,1950-01-01'
    expectedApplication['preferences'][1]['naturalKey'] = 'diego,maradona,1976-06-11'
    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(expectedApplication)
  })

  test('it should not save if preference members dont match with application members', async () => {
    const applicationWithInvalidPrefs = { ...mockApplication }
    applicationWithInvalidPrefs.preferences[1].application_member.first_name = 'james'

    let wrapper
    await act(async () => {
      wrapper = mount(
        <ApplicationEditPage
          listing={listing}
          application={applicationWithInvalidPrefs}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )
    })
    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })

    expect(mockSubmitApplication.mock.calls.length).toBe(0)
  })

  test('it should not save with demographics validation errors', async () => {
    const applicationWithInvalidDemo = {
      ...mockApplication,
      demographics: {
        sexual_orientation: 'not listed',
        sexual_orientation_other: null
      }
    }

    let wrapper
    await act(async () => {
      wrapper = mount(
        <ApplicationEditPage
          listing={listing}
          application={applicationWithInvalidDemo}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )
    })
    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })

    expect(mockSubmitApplication.mock.calls.length).toBe(0)
  })

  describe('should render', () => {
    test('successfully', () => {
      const wrapper = renderer.create(
        <ApplicationEditPage
          listing={listing}
          application={mockApplication}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )

      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    test('successfully with preferences', () => {
      const applicationWithPreferences = clone(mockApplication)

      applicationWithPreferences.preferences[0].application_member = {
        date_of_birth: {
          year: '1981',
          month: '05',
          day: '04'
        },
        first_name: 'Flagby',
        id: 'a0n0x000000B3xDAAS',
        last_name: 'Email'
      }

      expect(applicationWithPreferences.preferences).toHaveLength(2)
      expect(applicationWithPreferences.preferences[0].application_member).toBeTruthy()

      const wrapper = renderer.create(
        <ApplicationEditPage
          listing={listing}
          application={mockApplication}
          lendingInstitutions={lendingInstitutions}
          editPage />
      )

      expect(wrapper.toJSON()).toMatchSnapshot()
    })
  })
})
