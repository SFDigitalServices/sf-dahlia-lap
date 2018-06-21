import React from 'react'
import { mount } from 'enzyme'

import SupplementalApplicationContainer from 'components/supplemental_application/SupplementalApplicationContainer'
import { mapFormFields, mapStatusHistory } from 'components/supplemental_application/mapProperties'
import { mapSupplementalApplication } from '~/components/mappers/soqlToDomain'

import application from '../../fixtures/application'

describe('SupplementalApplicationContainer', () => {
  test('it should submit to shortForm', () => {

    const statusHistory = [
      { Processing_Status: 'Approved', Processing_Comment: 'xxxx1', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' },
      { Processing_Status: 'Pending', Processing_Comment: 'xxxx2', Processing_Date_Updated:'2018-05-10T19:54:11.000+0000' }
    ]

    const onSubmit = (values) => {
      // console.log(application)
      console.log(values)
    }

    const wrapper = mount(
      <SupplementalApplicationContainer
        application={mapSupplementalApplication(application)}
        statusHistory={mapStatusHistory(statusHistory)}
        formFields={mapFormFields(application)}
        onSubmit={onSubmit}/>
    )
    // wrapper.find('#demographics-dependents').first().simulate('keyDown', { keyCode: 40 })
    // wrapper.find('#demographics-dependents').first().simulate('keyDown', { keyCode: 12 })

    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-marital-status select option[value=2]').simulate('change')
    wrapper.find('form').first().simulate('submit')
  })
})
