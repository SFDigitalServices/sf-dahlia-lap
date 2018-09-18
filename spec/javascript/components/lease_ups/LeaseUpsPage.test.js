import React from 'react'
import { merge } from 'lodash'
import renderer from 'react-test-renderer'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import sharedHooks from '../../support/sharedHooks'

const buildApplicationPreference = (uniqId, attributes = {}) => {
  return merge({
    'Id': uniqId,
    'Processing_Status': 'processing',
    'Preference_Order': '1',
    'Preference_Lottery_Rank': '1',
    'Listing_Preference_ID': {
      'Record_Type_For_App_Preferences': 'CAP'
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

describe('LeaseUpApplicationsPage', () => {
  const listings = {
    Id: '1',
    Name: 'xxxx',
    Building_Street_Address: 'yyyy'
  }

  sharedHooks.useFakeTimers()

  test('Should render LeaseUpTable', () => {
    // FIXME: Need to figure out how to mock the results to make this snapshot actually do something
    const applications = [ buildApplicationPreference(1), buildApplicationPreference(2) ]
    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listings} applications={applications} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  test('Should render Mailing_Address when present', () => {
    const applications = [
      buildApplicationPreference(1, {
        'Application': {
          'Applicant': {
            'Residence_Address': '',
            'Mailing_Address': '1316 SUTTER'
          }
        }
      })
    ]

    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listings} applications={applications} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  test('Should render order by Prefrence_Order and Preference_Lottery_Rank', () => {
    const applications = [
      buildApplicationPreference(1, {
        'Preference_Order': '2',
        'Preference_Lottery_Rank': '2'
      }),
      buildApplicationPreference(2, {
        'Preference_Order': '2',
        'Preference_Lottery_Rank': '1'
      }),
      buildApplicationPreference(3, {
        'Preference_Order': '3',
        'Preference_Lottery_Rank': '1'
      }),
      buildApplicationPreference(4, {
        'Preference_Order': '1',
        'Preference_Lottery_Rank': '2'
      }),
      buildApplicationPreference(3, {
        'Preference_Order': '1',
        'Preference_Lottery_Rank': '1'
      })
    ]

    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listings} applications={applications} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
