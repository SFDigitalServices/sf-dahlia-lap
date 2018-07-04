import React from 'react'
import renderer from 'react-test-renderer';
import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import sharedHooks from '../../support/sharedHooks'
import { mount } from 'enzyme';

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
})
