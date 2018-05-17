import React from 'react'
import renderer from 'react-test-renderer'
import LeaseUpsPage from 'components/lease_ups/LeaseUpsPage'
import sinon from 'sinon'

const buildApplication = (uniqId, attributes = {}) => {
  return {
    'Preference_Order': '1',
    'Application': '1',
    'Application.Name': `Application Name ${uniqId}`,
    'Preference_Lottery_Rank': '1',
    'Application.First_Name': `some first name ${uniqId}`,
    'Application.Last_Name': `some last name ${uniqId}`,
    'Application.Phone': 'some phone',
    'Application.Email': `some email ${uniqId}`,
    'LastModifiedDate:': '14 feb 19',
    'Application.Processing_Status': 'processing',
    'Application.Residence_Address': `1316 BURNETT ${uniqId}`,
    'Listing_Preference_ID.Record_Type_For_App_Preferences': 'CAP',
    ...attributes
   }
}

describe('LeaseUpsPage', () => {
  const listings = {
    Id: '1',
    Name: 'xxxx',
    Building_Street_Address: 'yyyy'
  }

  let clock = null;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(2018, 3, 23).getTime());
  });

  afterEach(() => {
    clock.restore();
  })

  test('Should render LeaseUpTable', () => {
    const results = [ buildApplication(1), buildApplication(2) ]

    const wrapper = mount(
      <LeaseUpsPage listing={listings} results={results} />,
    )

    expect(wrapper).toMatchSnapshot();
  })


  test('Should render Mailing_Address when present', () => {
    const results = [
      buildApplication(1, {
        'Application.Residence_Address': '',
        'Application.Mailing_Address': '1316 SUTTER'
      }),
    ]

    const wrapper = mount(
      <LeaseUpsPage listing={listings} results={results} />,
    )

    expect(wrapper).toMatchSnapshot();
  })

  test('Should render order by Prefrence_Order and Preference_Lottery_Rank', () => {
    const results = [
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

    const wrapper =  mount(
      <LeaseUpsPage listing={listings} results={results} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
