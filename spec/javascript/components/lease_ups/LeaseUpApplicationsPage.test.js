/* eslint-disable jest/no-conditional-expect */
import { mountAppWithUrl } from '../../testUtils/wrapperUtil'
import { act } from 'react-dom/test-utils'
import LeaseUpApplicationsPage from '~/components/lease_ups/LeaseUpApplicationsPage'
import Loading from '~/components/molecules/Loading'

import TableLayout from '~/components/layouts/TableLayout'
import LeaseUpApplicationsTableContainer from '~/components/lease_ups/LeaseUpApplicationsTableContainer'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

const mockGetLeaseUpListing = jest.fn()
const mockFetchLeaseUpApplications = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()

jest.mock('apiService', () => {
  return {
    getLeaseUpListing: async (id) => {
      mockGetLeaseUpListing(id)
      return Promise.resolve({ ...mockListing })
    },
    fetchLeaseUpApplications: async (listingId, page, filters) => {
      mockFetchLeaseUpApplications(listingId, page, filters)
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
  buildMockApplicationWithPreference('1', '2', '2'),
  buildMockApplicationWithPreference('2', '2', '1'),
  buildMockApplicationWithPreference('3', '3', '1'),
  buildMockApplicationWithPreference('4', '1', '2'),
  buildMockApplicationWithPreference('5', '1', '1')
]

const rowSelector = 'div.rt-tbody .rt-tr-group'

const getWrapper = async () => {
  let wrapper
  await act(async () => {
    wrapper = mountAppWithUrl(`/lease-ups/listings/${mockListing.id}`)
  })

  wrapper.update()
  return wrapper
}

describe('LeaseUpApplicationsPage', () => {
  let wrapper
  beforeEach(async () => {
    wrapper = await getWrapper()
  })

  test('should match the snapshot', async () => {
    expect(wrapper.find(LeaseUpApplicationsPage)).toMatchSnapshot()
  })

  test('renders the table', () => {
    expect(wrapper.find(LeaseUpApplicationsTableContainer)).toHaveLength(1)
  })

  test('calls get listing with the listing id', () => {
    expect(mockGetLeaseUpListing.mock.calls).toHaveLength(1)
    expect(mockGetLeaseUpListing.mock.calls[0][0]).toEqual(mockListing.id)
  })

  test('calls get applications with the listing id and page number = 0', () => {
    expect(mockFetchLeaseUpApplications.mock.calls).toHaveLength(1)
    expect(mockFetchLeaseUpApplications.mock.calls[0][0]).toEqual(mockListing.id)
    expect(mockFetchLeaseUpApplications.mock.calls[0][1]).toEqual(0)
  })

  test('it is not loading', () => {
    expect(wrapper.find(Loading).props().isLoading).toBeFalsy()
  })

  test('renders the header properly', () => {
    expect(wrapper.find(TableLayout)).toHaveLength(1)
    const headerProps = wrapper.find(TableLayout).prop('pageHeader')
    expect(headerProps.title).toEqual(mockListing.name)
    expect(headerProps.content).toEqual(mockListing.building_street_address)
    expect(headerProps.action.title).toEqual('Export')
    expect(headerProps.breadcrumbs).toHaveLength(2)
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
