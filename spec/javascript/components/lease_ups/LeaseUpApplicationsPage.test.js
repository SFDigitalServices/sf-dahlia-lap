/* eslint-disable jest/no-conditional-expect */
import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

const mockGetLeaseUpListing = jest.fn()
const mockFetchLeaseUpApplications = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()

const tick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

jest.mock('apiService', () => {
  return {
    getLeaseUpListing: async (id) => {
      mockGetLeaseUpListing(id)
      return Promise.resolve({ ...mockListing })
    },
    fetchLeaseUpApplications: async (data) => {
      mockFetchLeaseUpApplications(data)
      return Promise.resolve({ records: mockApplications })
    },
    createFieldUpdateComment: async (data) => {
      var response = mockCreateFieldUpdateComment(data)
      return Promise.resolve(response)
    }
  }
})

const buildMockApplicationWithPreference = (uniqId, prefOrder, prefRank) => {
  return {
    id: uniqId,
    processing_status: 'processing',
    preference_order: prefOrder,
    preference_lottery_rank: prefRank,
    record_type_for_app_preferences: 'COP',
    application: {
      id: 1000 + uniqId,
      name: `Application Name ${uniqId}`,
      status_last_updated: '2018-04-26T12:31:39.000+0000',
      has_ada_priorities_selected: { vision_impairments: true },
      applicant: {
        id: '1',
        residence_address: `1316 BURNETT ${uniqId}`,
        first_name: `some first name ${uniqId}`,
        last_name: `some last name ${uniqId}`,
        phone: 'some phone',
        email: `some email ${uniqId}`
      }
    }
  }
}

const mockListing = {
  id: 'listingId',
  name: 'listingName',
  building_street_address: 'buildingAddress',
  report_id: 'REPORT_ID'
}

const mockApplications = [
  buildMockApplicationWithPreference(1, '2', '2'),
  buildMockApplicationWithPreference(2, '2', '1'),
  buildMockApplicationWithPreference(3, '3', '1'),
  buildMockApplicationWithPreference(4, '1', '2'),
  buildMockApplicationWithPreference(5, '1', '1')
]

const rowSelector = 'div.rt-tbody .rt-tr-group'
let wrapper

describe('LeaseUpApplicationsPage', () => {
  beforeEach(async () => {
    wrapper = mount(<LeaseUpApplicationsPage listingId={mockListing.id} />)
    await act(tick)
    wrapper.update()
  })

  test('should render LeaseUpTable', async () => {
    expect(wrapper).toMatchSnapshot()
  })

  test('should render accessibility requests when present', async () => {
    expect(wrapper.find(rowSelector).first().text()).toContain('Vision')
  })

  test('status modal can be opened and closed', () => {
    expect(wrapper.find(rowSelector).first().find('button').exists()).toBeTruthy()
    act(() => {
      wrapper
        .find(rowSelector)
        .first()
        .find('Select')
        .instance()
        .props.onChange({ value: 'Appealed' })
    })
    wrapper.update()
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeTruthy()

    act(() => {
      // Click the close button
      wrapper.find('.close-reveal-modal').simulate('click')
    })

    wrapper.update()

    // Expect the modal to be closed
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeFalsy()

    // if submit wasn't clicked we shouldn't trigger an API request
    expect(mockCreateFieldUpdateComment).not.toHaveBeenCalled()
  })
})
