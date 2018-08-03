/* global wait */
import React from 'react'
import renderer from 'react-test-renderer'
import { cloneDeep, merge } from 'lodash'
import { mount } from 'enzyme';
// import apiService from '~/apiService'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import supplementalApplication from '../../fixtures/supplemental_application'
import mockShortFormSubmitPayload from '../../fixtures/short_form_submit_payload'

const mockSubmitApplication = jest.fn()

jest.mock('apiService', () => {
  // const mockSubmitApplication = async (data) => {
  //   expect(data).toEqual(mockShortFormSubmitPayload)
  // }
  return { submitApplication: async (data) => {
      mockSubmitApplication(data)
      return true
    }
  }
})

const statusHistory = [
  { Processing_Status: 'Approved', Processing_Comment: 'xxxx1', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' },
  { Processing_Status: 'Pending', Processing_Comment: 'xxxx2', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' }
]

describe('SupplementalApplicationPage', () => {
  test('it should render correctly without status history', () => {
    const component = renderer.create(
      <SupplementalApplicationPage
        statusHistory={statusHistory}
        application={supplementalApplication}/>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it saves demographics correctly', async () => {
    mockShortFormSubmitPayload.numberOfDependents = 1
    mockShortFormSubmitPayload.primaryApplicant.maritalStatus = 'Domestic Partner'
    const wrapper = mount(
      <SupplementalApplicationPage
        application={supplementalApplication}
        statusHistory={statusHistory}/>
    )

    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-marital-status select option[value=3]').simulate('change')
    wrapper.find('form').first().simulate('submit')

    await wait(100)

    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(mockShortFormSubmitPayload)
  })


  test.only('it save an application preference panel', async () => {
    const withValidPreferences = cloneDeep(supplementalApplication)
    const payload = cloneDeep(mockShortFormSubmitPayload)

    merge(payload.shortFormPreferences[0], {
      naturalKey: "Bla,Ble,",
      individualPreference: "Live in SF"
    })

    merge(withValidPreferences.preferences[0], {
      Preference_Name: "Live or Work in San Francisco Preference",
      Individual_preference: "Live in SF",
      Receives_Preference: true,
      Application_Member: { Id: 'xxx', First_Name: 'Bla', Last_Name: 'Ble', DOB:'03/03/83' }
    })

    const wrapper = mount(
      <SupplementalApplicationPage
        application={withValidPreferences}
        statusHistory={statusHistory}
      />
    )

    // expect(wrapper).toMatchSnapshot()
    // console.log(wrapper.find('TableWrapper .action-link').debug())

    wrapper.find('TableWrapper .action-link').simulate('click')

    // wrapper.find('.individual-preference-select').first().simulate('change', { target: {value: '2' } });

    wrapper.find('TableWrapper .save-panel-btn').simulate('click')

    await wait(100)

    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(payload)

    // console.log(wrapper.find('TableWrapper').props())
    // console.log(wrapper.find('TableWrapper').debug())
    // wrapper.find('form').first().simulate('submit')
    // wrapper.find('form').first().simulate('submit')
    // await wait(100)
    // expect(mockSubmitApplication.mock.calls.length).toBe(1)
    // expect(mockSubmitApplication.mock.calls[0][0]).toEqual(mockShortFormSubmitPayload)
  })
})
