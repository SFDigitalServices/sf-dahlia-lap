/*global mount*/
import React from 'react'
import renderer from 'react-test-renderer'
import LeaseUpsPage from 'components/lease_ups/LeaseUpsPage'
import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

const buildApplication = (uniqId, attributes = {}) => {
  return modelsFactory.application(uniqId, attributes)
}

describe('LeaseUpsPage', () => {
  const listings = {
    Id: '1',
    Name: 'xxxx',
    Building_Street_Address: 'yyyy'
  }

  sharedHooks.useFakeTimers()

  test('Should render LeaseUpTable', () => {
    const applications = [ buildApplication(1), buildApplication(2) ]

    const wrapper = renderer.create(
      <LeaseUpsPage listing={listings} applications={applications} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })

  test('Should render Mailing_Address when present', () => {
    const applications = [
      buildApplication(1, {
        'Application.Residence_Address': '',
        'Application.Mailing_Address': '1316 SUTTER'
      }),
    ]

    const wrapper = renderer.create(
      <LeaseUpsPage listing={listings} applications={applications} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })

  test('Should render order by Prefrence_Order and Preference_Lottery_Rank', () => {
    const applications = [
      buildApplication(1, {
        'Preference_Order': '2',
        'Preference_Lottery_Rank': '2'
      }),
      buildApplication(2, {
        'Preference_Order': '2',
        'Preference_Lottery_Rank': '1'
      }),
      buildApplication(3, {
        'Preference_Order': '3',
        'Preference_Lottery_Rank': '1'
      }),
      buildApplication(4, {
        'Preference_Order': '1',
        'Preference_Lottery_Rank': '2'
      }),
      buildApplication(3, {
        'Preference_Order': '1',
        'Preference_Lottery_Rank': '1'
      })
    ]

    const wrapper =  renderer.create(
      <LeaseUpsPage listing={listings} applications={applications} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
