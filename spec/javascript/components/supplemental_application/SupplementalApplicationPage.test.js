import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme';
import apiService from '~/apiService'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import supplementalApplication from '../../fixtures/supplemental_application'
import mockShortFormSubmitPayload from '../../fixtures/short_form_submit_payload'

jest.mock('apiService', () => {
  const mockSubmitApplication = async (data) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    // console.log(data)
    expect(data).toEqual(mockShortFormSubmitPayload)
  }

  return { submitApplication: mockSubmitApplication };
})

describe('SupplementalApplicationPage', () => {
  const statusHistory = [
    { Processing_Status: 'Approved', Processing_Comment: 'xxxx1', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' },
    { Processing_Status: 'Pending', Processing_Comment: 'xxxx2', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' }
  ]

  test('it should render correctly without status history', () => {
    const component = renderer.create(
      <SupplementalApplicationPage
        statusHistory={statusHistory}
        application={supplementalApplication}/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  test('it saves correctly', () => {
    const wrapper = mount(
      <SupplementalApplicationPage
        application={supplementalApplication}
        statusHistory={statusHistory}/>
    );

    // console.log(wrapper.find('#demographics-dependents select').debug())
    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-marital-status select option[value=3]').simulate('change')
    wrapper.find('form').first().simulate('submit')
  })
})
