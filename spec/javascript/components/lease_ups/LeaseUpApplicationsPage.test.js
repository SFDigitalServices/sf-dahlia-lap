import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import { statusRequiresComments } from '../../utils/statusUtils'

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

/**
 * Make createFieldUpdateComment succeed the first time and fail the second time.
 *
 * If additional tests are added that call createFieldUpdateComment these mocks may
 * need to be modified.
 *
 * Unfortunately, we can't mock the implementation inside of individual tests.
 * See: https://github.com/facebook/jest/issues/5962 for more info.
 */
mockCreateFieldUpdateComment.mockImplementationOnce(() => Promise.resolve('works'))
mockCreateFieldUpdateComment.mockImplementationOnce(() => Promise.reject(new Error('error thrown')))

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

let mockApplications = [
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

const openStatusModal = (wrapper) => {
  expect(wrapper.find('div.rt-tbody .rt-tr-group').first().find('button').exists()).toBeTruthy()
  wrapper.find('div.rt-tbody .rt-tr-group').first().find('button').simulate('click')
  wrapper.find('li.dropdown-menu_item.is-appealed > a').simulate('click')
  return wrapper
}

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
  test('Should render accessibility when present', async () => {
    expect(wrapper.find('div.rt-tbody .rt-tr-group').first().text()).toContain('Vision')
  })

  describe('StatusModal', () => {
    const openModalSelector = '.ReactModal__Content--after-open'
    const commentBoxSelector = 'textarea#status-comment'
    const commentLabelSelector = 'label#status-comment-label'
    const updateButtonSelector = 'div.modal-button_item.modal-button_primary > button'
    const statusSelector = '.form-modal_form_wrapper .dropdown.status'
    const subStatusSelector = '.form-modal_form_wrapper .dropdown.subStatus'

    test('Can be opened and closed', async () => {
      openStatusModal(wrapper)

      // Expect the modal to be open
      expect(wrapper.find(openModalSelector).exists()).toBeTruthy()

      // Click the close button
      wrapper.find('.close-reveal-modal').simulate('click')

      // Expect the modal to be closed
      expect(wrapper.find(openModalSelector).exists()).toBe(false)

      // if submit wasn't clicked we shouldn't trigger an API request
      expect(mockCreateFieldUpdateComment.mock.calls.length).toEqual(0)
    })

    test('Should display sub status options properly', async () => {
      openStatusModal(wrapper)

      // Expect the modal to be open
      expect(wrapper.find(openModalSelector).exists()).toBeTruthy()
      const status = await wrapper.find(statusSelector).first().html()
      if (!status.toLowerCase().includes('processing') && !status.toLowerCase().includes('lease signed')) {
        expect(wrapper.find(subStatusSelector).exists()).toBe(true)
        const emptyStatus = wrapper.find(`${subStatusSelector} button`).html()
        expect(emptyStatus.toLowerCase().includes('select one...')).toBe(true)
      } else {
        expect(wrapper.find(subStatusSelector).exists()).toBe(false)
      }

      // Click the close button
      wrapper.find('.close-reveal-modal').simulate('click')

      // Expect the modal to be closed
      expect(wrapper.find(openModalSelector).exists()).toBe(false)

      // if submit wasn't clicked we shouldn't trigger an API request
      expect(mockCreateFieldUpdateComment.mock.calls.length).toEqual(0)
    })

    test('Should call createFieldUpdateComment and close on successful submit', async () => {
      mockCreateFieldUpdateComment.mockReturnValueOnce(true)
      openStatusModal(wrapper)

      const status = await wrapper.find(statusSelector).first().html()
      if (!status.toLowerCase().includes('processing') && !status.toLowerCase().includes('lease signed')) {
        expect(wrapper.find(subStatusSelector).exists()).toBe(true)
        const emptyStatus = wrapper.find(`${subStatusSelector} button`).html()
        expect(emptyStatus.toLowerCase().includes('select one...')).toBe(true)

        wrapper.find(subStatusSelector).find('button').simulate('click')
        await tick()
        wrapper.find(`${subStatusSelector} .dropdown-menu li a`).first().simulate('click')
        await tick()

        const updatedStatus = wrapper.find(`${subStatusSelector} button`).html()
        expect(updatedStatus.toLowerCase().includes('select one...')).toBe(false)
      } else {
        expect(wrapper.find(subStatusSelector).exists()).toBe(false)
      }

      // Fill out the comment form and submit
      wrapper.find(commentBoxSelector).simulate('change', { target: { value: 'Sample comment value' } })
      wrapper.find(updateButtonSelector).simulate('submit')
      await tick()
      wrapper.update()

      // Expect createFieldUpdateComment was called and modal is closed
      expect(mockCreateFieldUpdateComment.mock.calls.length).toBe(1)
      expect(wrapper.find(openModalSelector).exists()).toBe(false)
    })

    test('Should display errors on required comment', async () => {
      openStatusModal(wrapper)

      const status = await wrapper.find(statusSelector).first().html()
      let substatus = ''
      if (!status.toLowerCase().includes('processing') && !status.toLowerCase().includes('lease signed')) {
        substatus = wrapper.find(`${subStatusSelector} button`).html()

        wrapper.find(subStatusSelector).find('button').simulate('click')
        await tick()
        wrapper.find(`${subStatusSelector} .dropdown-menu li a`).first().simulate('click')
        await tick()
      }

      // Leave comment empty and submit
      wrapper.find(updateButtonSelector).simulate('submit')
      await tick()
      wrapper.update()

      expect(mockCreateFieldUpdateComment.mock.calls.length).toEqual(0)

      const labelValue = await wrapper.find(commentLabelSelector).html()
      // check if required is present for either condition
      expect(labelValue.toLowerCase().includes('required')).toBe(statusRequiresComments(status.toLowerCase(), substatus.toLowerCase()))
    })

    test('Should open closeable alert modal on failed submit', async () => {
      openStatusModal(wrapper)

      const status = await wrapper.find(statusSelector).first().html()
      if (!status.toLowerCase().includes('processing') && !status.toLowerCase().includes('lease signed')) {
        wrapper.find(subStatusSelector).find('button').simulate('click')
        await tick()
        wrapper.find(`${subStatusSelector} .dropdown-menu li a`).first().simulate('click')
        await tick()
      }

      // Fill out the comment and submit
      wrapper.find(commentBoxSelector).simulate('change', { target: { value: 'Sample comment value' } })
      await act(async () => {
        wrapper.find(updateButtonSelector).simulate('submit')
      })
      await tick()
      wrapper.update()

      expect(mockCreateFieldUpdateComment.mock.calls.length).toEqual(1)

      // Expect alert message to be present
      expect(wrapper.find('.alert-body').exists()).toBeTruthy()

      // Close the alert message
      wrapper.find('.alert-box-and-notice button.close').simulate('click')

      // Expect alert to be closed
      expect(wrapper.find('.alert-body').exists()).toBe(false)
    })
  })
})
