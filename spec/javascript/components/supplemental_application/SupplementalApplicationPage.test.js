import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme';
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import supplementalApplication from '../../fixtures/supplemental_application'
import units from '../../fixtures/units'
import mockShortFormSubmitPayload from '../../fixtures/short_form_submit_payload'

jest.mock('apiService', () => {
  const mockSubmitApplication = async (data) => {
    expect(data).toEqual(mockShortFormSubmitPayload)
  }
  return { submitApplication: mockSubmitApplication }
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
        application={supplementalApplication}
        units={units}/>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it saves correctly', () => {
    mockShortFormSubmitPayload.numberOfDependents = 1
    mockShortFormSubmitPayload.primaryApplicant.maritalStatus = 'Domestic Partner'
    const wrapper = mount(
      <SupplementalApplicationPage
        application={supplementalApplication}
        statusHistory={statusHistory}
        units={units}/>
    )

    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-marital-status select option[value=3]').simulate('change')
    wrapper.find('form').first().simulate('submit')
  })
})
