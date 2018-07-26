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

var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

describe('ApplicationsPage', () => {
  test('should render succesfully', (done) => {
    const wrapper = renderer.create(
      <ApplicationsPage />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
    wait(2000)
    done()
  })
})
