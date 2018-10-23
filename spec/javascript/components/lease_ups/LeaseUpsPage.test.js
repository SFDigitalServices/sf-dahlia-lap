import React from 'react'
import { merge } from 'lodash'
import renderer from 'react-test-renderer'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import sharedHooks from '../../support/sharedHooks'

const mockfetchLeaseUpApplications = jest.fn()

const mockBuildApplicationPreference = (uniqId, attributes = {}) => {
  return merge({
    'Id': uniqId,
    'Processing_Status': 'processing',
    'Preference_Order': '1',
    'Preference_Lottery_Rank': '1',
    'Listing_Preference_ID': {
      'Record_Type_For_App_Preferences': 'COP'
    },
    'Application': {
      'Id': 1000 + uniqId,
      'Name': `Application Name ${uniqId}`,
      'Status_Last_Updated': '2018-04-26T12:31:39.000+0000',
      'Applicant': {
        'Id': '1',
        'Residence_Address': `1316 BURNETT ${uniqId}`,
        'First_Name': `some first name ${uniqId}`,
        'Last_Name': `some last name ${uniqId}`,
        'Phone': 'some phone',
        'Email': `some email ${uniqId}`
      }
    }
  }, attributes)
}

let mockApplications = [
  mockBuildApplicationPreference(1, {
    'Preference_Order': '2',
    'Preference_Lottery_Rank': '2'
  }),
  mockBuildApplicationPreference(2, {
    'Preference_Order': '2',
    'Preference_Lottery_Rank': '1'
  }),
  mockBuildApplicationPreference(3, {
    'Preference_Order': '3',
    'Preference_Lottery_Rank': '1'
  }),
  mockBuildApplicationPreference(4, {
    'Preference_Order': '1',
    'Preference_Lottery_Rank': '2'
  }),
  mockBuildApplicationPreference(3, {
    'Preference_Order': '1',
    'Preference_Lottery_Rank': '1'
  })
]

jest.mock('apiService', () => {
  return {
    fetchLeaseUpApplications: async (data) => {
      mockfetchLeaseUpApplications(data)
      return mockApplications
    }
  }
})

describe('LeaseUpApplicationsPage', () => {
  const listing = {
    Id: '1',
    Name: 'xxxx',
    Building_Street_Address: 'yyyy'
  }

  sharedHooks.useFakeTimers()

  test('Should render LeaseUpTable', () => {
    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listing} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  test('Should render Mailing_Address when present', () => {
    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listing} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  test('Should render order by Prefrence_Order and Preference_Lottery_Rank', () => {
    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listing} />
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
