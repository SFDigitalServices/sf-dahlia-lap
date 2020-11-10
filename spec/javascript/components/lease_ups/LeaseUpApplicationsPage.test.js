/* eslint-disable jest/no-conditional-expect */
import { act } from 'react-dom/test-utils'
import { Link } from 'react-router-dom'

import TableLayout from 'components/layouts/TableLayout'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import LeaseUpApplicationsTableContainer from 'components/lease_ups/LeaseUpApplicationsTableContainer'
import Loading from 'components/molecules/Loading'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'

import { findWithText, mountAppWithUrl } from '../../testUtils/wrapperUtil'

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
    createFieldUpdateComment: async (applicationId, status, comment, substatus) => {
      mockCreateFieldUpdateComment(applicationId)
      return Promise.resolve(mockApplications)
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

  test('should render application links as routed links', () => {
    const mockAppNames = mockApplications.map((app) => app.application.name)
    const applicationLinkWrappers = mockAppNames.map((name) => findWithText(wrapper, Link, name))

    // Just double check that our list has the same length as mockApplications, because if
    // for some reason it had length 0 the .every(..) call would always return true by default
    expect(applicationLinkWrappers).toHaveLength(5)
    expect(applicationLinkWrappers.every((w) => w.exists())).toBeTruthy()
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

  test('updates substatus and last updated date on status change', async () => {
    // Get the status last updated date before we change it, to verify that it changed.
    const dateBefore = wrapper.find(rowSelector).first().find('PrettyTime').text()

    // Change status to Appealed and open up the modal
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

    // Change the substatus
    act(() => {
      wrapper
        .find('SubstatusDropdown')
        .find('Select')
        .instance()
        .props.onChange({ value: 'None of the above' })
    })

    // Add a comment
    wrapper.find('textarea#status-comment').simulate('change', { target: { value: 'comment' } })

    // Submit the modal
    await act(async () => {
      await wrapper.find('.modal-button_primary > button').simulate('submit')
    })
    await wrapper.update()

    // Expect that we submitted the comment and the modal is closed
    expect(mockCreateFieldUpdateComment).toHaveBeenCalled()
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeFalsy()

    // Expect the changed row to have the updated substatus and date
    expect(wrapper.find(rowSelector).first().find('div.td-offset-right').text()).toEqual(
      'None of the above'
    )
    expect(wrapper.find(rowSelector).first().find('PrettyTime').text()).not.toEqual(dateBefore)
  })
})
