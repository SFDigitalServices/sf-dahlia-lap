import React from 'react'
import renderer from 'react-test-renderer'
import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'
import mockApplicationsPage from '../../fixtures/applications_page'

jest.mock('apiService', () => {
  return {
    fetchApplications: async () => {
      return mockApplicationsPage
    }
  }
})

// FIXME: extract this out and make it generic
var wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

describe('ListingApplicationsPage', () => {
  const listing = { id: 'listingId', name: 'listing name', lottery_date: '2017-03-22T18:00:00.000+0000' }

  test('should render succesfully', (done) => {
    const wrapper = renderer.create(
      <ListingApplicationsPage
        listing={listing}
      />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
    wait(2000)
    done()
  })
})
