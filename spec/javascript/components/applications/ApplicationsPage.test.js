import React from 'react'
import renderer from 'react-test-renderer';
import apiService from '~/apiService'

import ApplicationsPage from 'components/applications/ApplicationsPage'

import mockApplicationsPage from '../../fixtures/applications_page'

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return mockApplicationsPage
    }
  }
})

describe('ApplicationsPage', async () => {
  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <ApplicationsPage />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
