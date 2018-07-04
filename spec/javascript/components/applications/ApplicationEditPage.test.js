import React from 'react'
import renderer from 'react-test-renderer';
import { clone } from 'lodash'
import { mount } from 'enzyme';

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import sharedHooks from '../../support/sharedHooks'
import listing from '../../fixtures/listing'
import application from '../../fixtures/application'
import mockApplicationApiEditPayload from '../../fixtures/application_api_edit_payload'

jest.mock('apiService', () => {
  const mockSubmitApplication = (data) => {
    expect(data).toEqual(mockApplicationApiEditPayload)
  }
  return { submitApplication: mockSubmitApplication }
})

describe('ApplicationNewPage', () => {
  sharedHooks.useFakeTimers()

  test.only('should render succesfully', () => {
    const wrapper = renderer.create(
      <ApplicationEditPage
        listing={listing}
        application={application}
        editPage={true} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })

  test('it should save correctly', () => {
    const wrapper = mount(
        <ApplicationEditPage
          listing={listing}
          application={application}
          editPage={true} />,
      )

      wrapper.find('form').first().simulate('submit')
  })

  test('should render succesfully with preferences', () => {
    const applicationWithPreferences = clone(application)

    applicationWithPreferences.preferences[0].Application_Member = {
      Date_of_Birth:"1981-05-04",
      First_Name:"Flagby",
      Id:"a0n0x000000B3xDAAS",
      Last_Name:"Email"
    }

    expect(applicationWithPreferences.preferences).toHaveLength(1)
    expect(applicationWithPreferences.preferences[0].Application_Member).toBeTruthy()

    const wrapper = renderer.create(
      <ApplicationEditPage
        listing={listing}
        application={application}
        editPage={true} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
