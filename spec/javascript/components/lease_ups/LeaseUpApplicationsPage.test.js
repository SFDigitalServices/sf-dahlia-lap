import React from 'react'
import { merge } from 'lodash'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'

const mockfetchLeaseUpApplications = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()

const tick = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

const buildMockApplicationWithPreference = (uniqId, attributes = {}) => {
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
  buildMockApplicationWithPreference(1, {
    'Preference_Order': '2',
    'Preference_Lottery_Rank': '2'
  }),
  buildMockApplicationWithPreference(2, {
    'Preference_Order': '2',
    'Preference_Lottery_Rank': '1'
  }),
  buildMockApplicationWithPreference(3, {
    'Preference_Order': '3',
    'Preference_Lottery_Rank': '1'
  }),
  buildMockApplicationWithPreference(4, {
    'Preference_Order': '1',
    'Preference_Lottery_Rank': '2'
  }),
  buildMockApplicationWithPreference(3, {
    'Preference_Order': '1',
    'Preference_Lottery_Rank': '1'
  })
]

jest.mock('apiService', () => {
  return {
    fetchLeaseUpApplications: async (data) => {
      mockfetchLeaseUpApplications(data)
      return Promise.resolve({'records': mockApplications})
    },
    createFieldUpdateComment: async (data) => {
      console.log('trying to update field update comment')
      mockCreateFieldUpdateComment(data)
      return Promise.resolve(true)
    }
  }
})

const listing = {
  Id: '1',
  Name: 'xxxx',
  Building_Street_Address: 'yyyy',
  Report_id: 'REPORT_ID'
}

const openStatusModal = (wrapper) => {
  expect(wrapper.find('div.rt-tbody .rt-tr-group').first().find('button').exists()).toBeTruthy()
  wrapper.find('div.rt-tbody .rt-tr-group').first().find('button').simulate('click')
  wrapper.find('li.dropdown-menu_item.is-appealed > a').simulate('click')
  return wrapper
}

describe('LeaseUpApplicationsPage', () => {
  test('Should render LeaseUpTable', (done) => {
    const wrapper = renderer.create(
      <LeaseUpApplicationsPage listing={listing} />
    )
    setTimeout(() => {
      expect(wrapper.toJSON()).toMatchSnapshot()
      done()
    }, 2000)
  })

  test('Should render address when present', (done) => {
    const wrapper = mount(
      <LeaseUpApplicationsPage listing={listing} />
    )
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('div.rt-tbody .rt-tr-group').first().text()).toContain('1316 BURNETT')
      done()
    }, 2000)
  })
})

describe('LeaseUpApplicationsPage status modal', () => {
  test('Can be opened and closed', async (done) => {
    const wrapper = await mount(
      <LeaseUpApplicationsPage listing={listing} />
    )
    setTimeout(() => {
      wrapper.update()

      let openModalWrapper = openStatusModal(wrapper)
      // Expect the modal to be open
      expect(openModalWrapper.find('textarea#status-comment').exists()).toBeTruthy()

      // Click the close button
      openModalWrapper.find('.close-reveal-modal').simulate('click')

      // Expect the modal to be closed
      expect(openModalWrapper.find('textarea#status-comments').exists()).toBe(false)
      done()
    }, 2000)
  })

  test('Should show a closeable alert on apiService request failure', async (done) => {
    // How to get the mock function to be called? I added a bunch of logging but it doesn't seem to be calling the

    const wrapper = mount(
      <LeaseUpApplicationsPage listing={listing} />
    )
    await tick()
    wrapper.update()

    let openModalWrapper = openStatusModal(wrapper)

    // Expect the modal to be open
    expect(openModalWrapper.find('textarea#status-comment').exists()).toBeTruthy()

    // Click the submit button

    wrapper.find('textarea#status-comment').simulate('change', {target: {value: 'Sample comment value'}})
    console.log(openModalWrapper.find('div.modal-button_item.modal-button_primary > button').debug())
    openModalWrapper.find('div.modal-button_item.modal-button_primary > button').simulate('submit')
    await tick()
    expect(mockCreateFieldUpdateComment.mock.calls.length).toBe(1)

    // Expect the alert message to be showing

    // Click "close" on the alert message

    // Expect alert message to be closed

    done()
  })
})
