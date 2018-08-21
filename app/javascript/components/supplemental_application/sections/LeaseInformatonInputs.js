import React from 'react'
import { Select, Text } from 'react-form'
import { map, toSafeInteger} from 'lodash'

import DatePickerText from '~/components/applications/application_form/DatePickerText'
import FormGrid from '~/components/molecules/FormGrid'

import { pluck, decorateComponents } from '~/utils/utils'
import { withFormApi } from '~/utils/reactFormUtils'
import formUtils from '~/utils/formUtils'

const Plain = ({ text }) => <div>{text}</div>

const INPUTS = { 'Select': Select,  'Text': Text, 'Plain': Plain, 'DatePickerText': DatePickerText }

const Custom = decorateComponents(INPUTS, Component => {
  return ({ label, ...rest }) => (
    <FormGrid.Item>
      <FormGrid.Group label={label}>
        <Component {...rest}/>
      </FormGrid.Group>
    </FormGrid.Item>
  )
})

const LeaseInformatonInputs = ({ formApi, availableUnits }) => {
  const list = map(availableUnits, pluck('id', 'unit_number'))
  const availableUnitsOptions = formUtils.toOptions(list)
  const { monthly_unit_rent, monthly_parking_rent } = formApi.values
  const totalMonthlyRent = toSafeInteger(monthly_unit_rent) + toSafeInteger(monthly_parking_rent)

  // console.log(formApi)

  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <Custom.Select
          label='Assigned Unit Number'
          field='assigned_unit_number' options={availableUnitsOptions} placeholder='Select One' />
        <Custom.DatePickerText
          label='Lease Start Date'
          required={false}
          dateFormat="YYYY-MM-DD"
          showYearDropdown
          dropdownMode="select"
          field="date_of_birth"
          placeholder="Enter Date" />
        <Custom.Select
          label='Preference Used'
          field='preference_used' options={[]} placeholder='Select One' />
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        <Custom.Text
          label='Monthly Unit Rent'
          field='monthly_unit_rent' type='number' placeholder='Enter Amount' />
        <Custom.Text
          label='Monthly Parking Rent'
          field='monthly_parking_rent' type='number' placeholder='Enter Amount' />
        <Custom.Plain
          label='Total Monlthly Rent'
          text={String(totalMonthlyRent)} />
        <Custom.Text
          label='Monlthly Tenant Contribution'
          field='monthly_tenant_contribution' type='number' placeholder='Enter Amount' />
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default withFormApi(LeaseInformatonInputs)
