import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import moment from 'moment'

import ApplicationsPage from 'components/applications/ApplicationsPage'
import ApplicationsTableContainer from 'components/applications/ApplicationsTableContainer'

import mockApplicationsPage, { mockUnMappedApplications } from '../../fixtures/applications_page'
import listings from '../../fixtures/listings'

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return { records: mockApplicationsPage, pages: 1 }
    }
  }
})

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return { records: mockUnMappedApplications, pages: 1 }
    }
  }
})

// FIXME: extract this out and make it generic
var wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

describe('ApplicationsPage', () => {
  test('should render succesfully', (done) => {
    const wrapper = renderer.create(
      <ApplicationsPage />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
    wait(2000)
    done()
  })
  test('should display data correctly', async (done) => {
    const wrapper = mount(
      <ApplicationsPage listings={listings} />
    )
    await wait(2000)
    const table = wrapper.find(ApplicationsTableContainer)
    table.setState({ loading: false }, () => {
      const firstRowData = wrapper.find('div.rt-tr-group div.rt-tr').first()

      expect(firstRowData.text()).toContain(mockUnMappedApplications[0].Listing.Name)
      expect(firstRowData.text()).toContain(moment(mockUnMappedApplications[0].Listing.Lottery_Date, '').format('MM/DD/YYYY'))
    })
    done()
  })
})
