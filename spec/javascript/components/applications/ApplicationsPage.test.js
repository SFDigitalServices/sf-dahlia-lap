import React from 'react'

import { mount } from 'enzyme'
import moment from 'moment'
import renderer from 'react-test-renderer'

import ApplicationsPage from 'components/applications/ApplicationsPage'
import ApplicationsTableContainer from 'components/applications/ApplicationsTableContainer'

import mockApplicationsPage from '../../fixtures/applications_page'
import listings from '../../fixtures/listings'

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return { records: mockApplicationsPage, pages: 1 }
    }
  }
})

// FIXME: extract this out and make it generic
var wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms))

describe('ApplicationsPage', () => {
  test('should render successfully', async () => {
    const wrapper = renderer.create(<ApplicationsPage />)
    await wait(2000)

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
  test('should display data correctly', async () => {
    const wrapper = mount(<ApplicationsPage listings={listings} />)
    await wait(2000)
    const table = wrapper.find(ApplicationsTableContainer)
    table.setState({ loading: false })
    const firstRowData = wrapper.find('div.rt-tr-group div.rt-tr').first()

    expect(firstRowData.text()).toContain(mockApplicationsPage[0].listing.name)
    expect(firstRowData.text()).toContain(
      moment(mockApplicationsPage[0].listing.lottery_date, '').format('MM/DD/YYYY')
    )
  })
})
