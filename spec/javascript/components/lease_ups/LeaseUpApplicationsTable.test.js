import React from 'react'

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import LeaseUpApplicationsTable from 'components/lease_ups/LeaseUpApplicationsTable'
import Provider from 'context/Provider'
import * as customHooks from 'utils/customHooks'

const mockBulkCheckboxesState = {
  a0o4U00000KIYp1QAH: false,
  a0o4U00000KIKuwQAH: false,
  a0o4U00000KIYpGQAX: false,
  a0o4U00000KIK4SQAX: false,
  a0o4U00000KIJxEQAX: false,
  a0o4U00000KIchuQAD: false,
  a0o4U00000KIKRaQAP: false,
  a0o4U00000KIXY4QAP: false,
  a0o4U00000KIYrNQAX: false,
  a0o4U00000KIJmNQAX: false,
  a0o4U00000KIKfnQAH: false,
  a0o4U00000KIKD8QAP: false,
  a0o4U00000KIXj7QAH: false,
  a0o4U00000KIJoTQAX: false,
  a0o4U00000KIKfEQAX: false,
  a0o4U00000KIK3jQAH: false,
  a0o4U00000KIXTuQAP: false,
  a0o4U00000KIL49QAH: false,
  a0o4U00000KIPTJQA5: false,
  a0o4U00000KIUAsQAP: false
}

const mockDataSet = [
  {
    application_id: 'a0o4U00000KIYp1QAH',
    application_number: 'APP-00824414',
    first_name: 'Tasha',
    last_name: 'Velez',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T19:00:03.000+0000',
    preference_order: 2,
    preference_name: 'Displaced Tenant Housing Preference (DTHP)',
    preference_record_type: 'DTHP',
    custom_preference_type: 'DTHP',
    preference_lottery_rank: 1,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'DTHP 1',
    rankOrder: 2.0001
  },
  {
    application_id: 'a0o4U00000KIKuwQAH',
    application_number: 'APP-00821953',
    first_name: 'Walter',
    last_name: 'Young',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Withdrawn',
    sub_status: 'Written withdrawal',
    status_last_updated: '2021-05-05T19:01:25.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 1,
    post_lottery_validation: 'Invalid',
    total_household_size: 3,
    layered_validation: 'Invalid',
    accessibility: 'None',
    preference_rank: 'L_W 1',
    rankOrder: 3.0001
  },
  {
    application_id: 'a0o4U00000KIYpGQAX',
    application_number: 'APP-00824415',
    first_name: 'Eric',
    last_name: 'Wiggins',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2022-03-25T20:55:09.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 2,
    post_lottery_validation: 'Confirmed',
    total_household_size: 4,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 2',
    rankOrder: 3.0002
  },
  {
    application_id: 'a0o4U00000KIK4SQAX',
    application_number: 'APP-00821618',
    first_name: 'Betty',
    last_name: 'Phelps',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T20:04:38.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 3,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 3',
    rankOrder: 3.0003
  },
  {
    application_id: 'a0o4U00000KIJxEQAX',
    application_number: 'APP-00821575',
    first_name: 'Kristine',
    last_name: 'Adams',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      vision_impairments: true,
      mobility_impairments: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-17T17:28:25.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 4,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'Vision, Mobility',
    preference_rank: 'L_W 4',
    rankOrder: 3.0004
  },
  {
    application_id: 'a0o4U00000KIchuQAD',
    application_number: 'APP-00824919',
    first_name: 'Michael',
    last_name: 'Lindsey',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Withdrawn',
    sub_status: 'Written withdrawal',
    status_last_updated: '2021-05-03T19:26:31.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 5,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 5',
    rankOrder: 3.0005
  },
  {
    application_id: 'a0o4U00000KIKRaQAP',
    application_number: 'APP-00821780',
    first_name: 'Jonathan',
    last_name: 'Ellis',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T20:05:47.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 6,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 6',
    rankOrder: 3.0006
  },
  {
    application_id: 'a0o4U00000KIXY4QAP',
    application_number: 'APP-00824151',
    first_name: 'Christopher',
    last_name: 'Benitez',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-17T22:18:17.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 7,
    post_lottery_validation: 'Confirmed',
    total_household_size: 3,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 7',
    rankOrder: 3.0007
  },
  {
    application_id: 'a0o4U00000KIYrNQAX',
    application_number: 'APP-00824426',
    first_name: 'Cynthia',
    last_name: 'Clark',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T20:28:40.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 8,
    post_lottery_validation: 'Confirmed',
    total_household_size: 2,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 8',
    rankOrder: 3.0008
  },
  {
    application_id: 'a0o4U00000KIJmNQAX',
    application_number: 'APP-00821445',
    first_name: 'Brett',
    last_name: 'Hunter',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Withdrawn',
    sub_status: 'Written withdrawal',
    status_last_updated: '2021-05-03T19:25:00.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 9,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 9',
    rankOrder: 3.0009
  },
  {
    application_id: 'a0o4U00000KIKfnQAH',
    application_number: 'APP-00821876',
    first_name: 'Christina',
    last_name: 'Huynh',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T20:31:21.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 10,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 10',
    rankOrder: 3.001
  },
  {
    application_id: 'a0o4U00000KIKD8QAP',
    application_number: 'APP-00821674',
    first_name: 'Stephen',
    last_name: 'Johnson',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T20:33:36.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 11,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 11',
    rankOrder: 3.0011
  },
  {
    application_id: 'a0o4U00000KIXj7QAH',
    application_number: 'APP-00824182',
    first_name: 'Tracy',
    last_name: 'Cannon',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T21:34:20.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 12,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 12',
    rankOrder: 3.0012
  },
  {
    application_id: 'a0o4U00000KIJoTQAX',
    application_number: 'APP-00821475',
    first_name: 'Matthew',
    last_name: 'Baker',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T21:35:48.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 13,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 13',
    rankOrder: 3.0013
  },
  {
    application_id: 'a0o4U00000KIKfEQAX',
    application_number: 'APP-00821870',
    first_name: 'Laura',
    last_name: 'Johnson',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T21:48:24.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 14,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 14',
    rankOrder: 3.0014
  },
  {
    application_id: 'a0o4U00000KIK3jQAH',
    application_number: 'APP-00821609',
    first_name: 'Mikayla',
    last_name: 'Griffin',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-05T21:49:19.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 15,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 15',
    rankOrder: 3.0015
  },
  {
    application_id: 'a0o4U00000KIXTuQAP',
    application_number: 'APP-00824135',
    first_name: 'David',
    last_name: 'Hall',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'Over income',
    status_last_updated: '2022-08-10T19:43:25.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 16,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 16',
    rankOrder: 3.0016
  },
  {
    application_id: 'a0o4U00000KIL49QAH',
    application_number: 'APP-00821997',
    first_name: 'Sean',
    last_name: 'Ramirez',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'Missing documents',
    status_last_updated: '2021-06-01T18:20:49.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 17,
    post_lottery_validation: 'Confirmed',
    total_household_size: 2,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 17',
    rankOrder: 3.0017
  },
  {
    application_id: 'a0o4U00000KIPTJQA5',
    application_number: 'APP-00822926',
    first_name: 'Robin',
    last_name: 'Jensen',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      none: true
    },
    lease_up_status: 'Disqualified',
    sub_status: 'No response after two or more attempts',
    status_last_updated: '2021-05-14T19:56:43.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 18,
    post_lottery_validation: 'Confirmed',
    total_household_size: 1,
    layered_validation: 'Confirmed',
    accessibility: 'None',
    preference_rank: 'L_W 18',
    rankOrder: 3.0018
  },
  {
    application_id: 'a0o4U00000KIUAsQAP',
    application_number: 'APP-00823612',
    first_name: 'Jacob',
    last_name: 'Thompson',
    mailing_address: '',
    residence_address: '',
    has_ada_priorities_selected: {
      mobility_impairments: true
    },
    lease_up_status: 'Withdrawn',
    sub_status: 'Verbal withdrawal',
    status_last_updated: '2021-07-16T20:46:25.000+0000',
    preference_order: 3,
    preference_name: 'Live or Work in San Francisco Preference',
    preference_record_type: 'L_W',
    custom_preference_type: 'L_W',
    preference_lottery_rank: 19,
    post_lottery_validation: 'Confirmed',
    total_household_size: 3,
    layered_validation: 'Confirmed',
    accessibility: 'Mobility',
    preference_rank: 'L_W 19',
    rankOrder: 3.0019
  }
]

describe('LeaseUpApplicationsTable', () => {
  let spy

  beforeEach(() => {
    spy = jest.spyOn(customHooks, 'useAppContext')
    spy.mockImplementation(() => [
      {
        applicationsListData: { appliedFilters: {} }
      }
    ])
  })

  afterEach(() => {
    spy.mockRestore()
  })

  test('should render succesfully when not loading', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Provider value={{ applicationsListData: {} }}>
          <LeaseUpApplicationsTable
            dataSet={mockDataSet}
            listingId='a0W4U00000Hm6qRUAR'
            onLeaseUpStatusChange={jest.fn()}
            loading={false}
            pages={10}
            rowsPerPage={10}
            atMaxPages={false}
            bulkCheckboxesState={mockBulkCheckboxesState}
            onBulkCheckboxClick={jest.fn()}
          />
        </Provider>
      </BrowserRouter>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  test('should render succesfully when loading', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Provider value={{ applicationsListData: {} }}>
          <LeaseUpApplicationsTable
            dataSet={mockDataSet}
            listingId='a0W4U00000Hm6qRUAR'
            onLeaseUpStatusChange={jest.fn()}
            loading={true}
            pages={10}
            rowsPerPage={10}
            atMaxPages={false}
            onBulkCheckboxClick={jest.fn()}
            bulkCheckboxesState={mockBulkCheckboxesState}
          />
        </Provider>
      </BrowserRouter>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
