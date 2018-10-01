/* global wait */
import React from 'react'
import renderer from 'react-test-renderer'
import { cloneDeep, merge } from 'lodash'
import { mount } from 'enzyme'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import supplementalApplication from '../../fixtures/supplemental_application'
import units from '../../fixtures/units'
import mockShortFormSubmitPayload from '../../fixtures/short_form_submit_payload'

const mockSubmitApplication = jest.fn()
const mockUpdateApplicationOnly = jest.fn()
const mockUpdatePreference = jest.fn()

jest.mock('apiService', () => {
  return {
    submitApplication: async (data) => {
      mockSubmitApplication(data)
      return true
    },
    updateApplicationOnly: async (data) => {
      mockUpdateApplicationOnly(data)
      return true
    },
    updatePreference: async (data) => {
      mockUpdatePreference(data)
      return true
    },
    getAMI: async (data) => {
      return { ami: '10' }
    }
  }
})

const statusHistory = [
  { Processing_Status: 'Approved', Processing_Comment: 'xxxx1', Processing_Date_Updated: '2018-05-10T19:54:11.000+0000' },
  { Processing_Status: 'Pending', Processing_Comment: 'xxxx2', Processing_Date_Updated: '2018-05-10T19:54:11.000+0000' }
]

describe('SupplementalApplicationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it should render correctly without status history', () => {
    const component = renderer.create(
      <SupplementalApplicationPage
        statusHistory={statusHistory}
        application={supplementalApplication}
        units={units} />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it saves demographics correctly', async () => {
    const payload = cloneDeep(mockShortFormSubmitPayload)
    payload.numberOfDependents = 1
    payload.primaryApplicant.maritalStatus = 'Domestic Partner'
    const wrapper = mount(
      <SupplementalApplicationPage
        application={supplementalApplication}
        statusHistory={statusHistory}
        units={units} />
    )

    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-marital-status select option[value=3]').simulate('change')
    wrapper.find('form').first().simulate('submit')

    await wait(100)

    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(payload)
  })

  test('it saves an application preference panel', async () => {
    const withValidPreferences = cloneDeep(supplementalApplication)
    const payload = cloneDeep(mockShortFormSubmitPayload)

    merge(payload.shortFormPreferences[0], {
      appMemberID: 'xxx',
      naturalKey: 'Bla,Ble,',
      individualPreference: 'Live in SF'
    })

    merge(withValidPreferences.preferences[0], {
      Preference_Name: 'Live or Work in San Francisco Preference',
      Individual_preference: 'Live in SF',
      Receives_Preference: true,
      Application_Member: { Id: 'xxx', First_Name: 'Bla', Last_Name: 'Ble', DOB: '03/03/83' }
    })

    const wrapper = mount(
      <SupplementalApplicationPage
        application={withValidPreferences}
        statusHistory={statusHistory}
      />
    )

    wrapper.find('TableWrapper .action-link').simulate('click')
    wrapper.find('TableWrapper .save-panel-btn').simulate('click')

    await wait(100)

    expect(mockUpdateApplicationOnly.mock.calls.length).toBe(1)
    expect(mockUpdatePreference.mock.calls.length).toBe(1)
  })

  test('should render the status update dropdown button and its menu of status options correctly', async () => {
    const wrapper = mount(
      <SupplementalApplicationPage
        application={supplementalApplication}
      />
    )

    // Click on the status update dropdown button to open
    // the status options dropdown menu
    wrapper.find('.button-pager .dropdown').simulate('click')

    // Check that the page matches the snapshot that we have stored
    // of how the dropdown button and dropdown menu should render
    // when the dropdown menu is open
    expect(wrapper).toMatchSnapshot()
  })
})
