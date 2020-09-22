import React from 'react'
import { mount } from 'enzyme'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

const mockfetchLeaseUpApplications = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()

const tick = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

jest.mock('apiService', () => {
  return {
    fetchLeaseUpApplications: async (data) => {
      mockfetchLeaseUpApplications(data)
      return Promise.resolve({ 'records': mockApplications })
    },
    createFieldUpdateComment: async (data) => {
      var response = mockCreateFieldUpdateComment(data)
      return Promise.resolve(response)
    }
  }
})

const buildMockApplicationWithPreference = (uniqId, prefOrder, prefRank) => {
  return {
    'id': uniqId,
    'processing_status': 'processing',
    'preference_order': prefOrder,
    'preference_lottery_rank': prefRank,
    'record_type_for_app_preferences': 'COP',
    'application': {
      'id': 1000 + uniqId,
      'name': `Application Name ${uniqId}`,
      'status_last_updated': '2018-04-26T12:31:39.000+0000',
      'has_ada_priorities_selected': { 'vision_impairments': true },
      'applicant': {
        'id': '1',
        'residence_address': `1316 BURNETT ${uniqId}`,
        'first_name': `some first name ${uniqId}`,
        'last_name': `some last name ${uniqId}`,
        'phone': 'some phone',
        'email': `some email ${uniqId}`
      }
    }
  }
}

const mockApplications = [
  buildMockApplicationWithPreference(1, '2', '2'),
  buildMockApplicationWithPreference(2, '2', '1'),
  buildMockApplicationWithPreference(3, '3', '1'),
  buildMockApplicationWithPreference(4, '1', '2'),
  buildMockApplicationWithPreference(5, '1', '1')
]

const listing = {
  id: 'listingId',
  name: 'listingName',
  building_street_address: 'buildingAddress',
  report_id: 'REPORT_ID'
}

const rowSelector = 'div.rt-tbody .rt-tr-group'
let wrapper

describe('LeaseUpApplicationsPage', () => {
  beforeEach(async () => {
    wrapper = await mount(
      <LeaseUpApplicationsPage listing={listing} />
    )
    await tick()
    wrapper.update()
  })
  test('Should render LeaseUpTable', async () => {
    expect(wrapper).toMatchSnapshot()
  })
  test('Should render accessibility requests when present', async () => {
    expect(wrapper.find(rowSelector).first().text()).toContain('Vision')
  })

  test('status modal can be opened and closed', () => {
    expect(wrapper.find(rowSelector).first().find('button').exists()).toBeTruthy()
    wrapper.find(rowSelector).first().find('Select').instance().props.onChange({ 'value': 'Appealed' })
    wrapper.update()
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeTruthy()

    // Click the close button
    wrapper.find('.close-reveal-modal').simulate('click')

    // Expect the modal to be closed
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeFalsy()

    // if submit wasn't clicked we shouldn't trigger an API request
    expect(mockCreateFieldUpdateComment).not.toHaveBeenCalled()
  })
})
