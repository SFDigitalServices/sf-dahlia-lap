// TODO: this is using the old date picker text. Merge cartitas first.
import React from 'react'
import { Select, Text } from 'react-form'
import { map, toSafeInteger, includes } from 'lodash'

import DatePickerText from '~/components/applications/application_form/DatePickerText'
import FormGrid from '~/components/molecules/FormGrid'

import { pluck, decorateComponents } from '~/utils/utils'
import { withNestedForm } from '~/utils/reactFormUtils'
import formUtils from '~/utils/formUtils'

const Plain = ({ text }) => <div>{text}</div>

const INPUTS = { 'Select': Select,  'Text': Text, 'Plain': Plain, 'DatePickerText': DatePickerText }

const CustomFormGrid = decorateComponents(INPUTS, Component => {
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
  console.log(map(availableUnitsOptions,'value'))
  console.log(formApi.values.unit)
  console.log(includes(map(availableUnitsOptions,'value'), formApi.values.unit))
  return (
      <React.Fragment>
        <FormGrid.Row paddingBottom>
          <CustomFormGrid.Select
            label='Assigned Unit Number'
            field='unit' options={availableUnitsOptions} placeholder='Select One' />
          <CustomFormGrid.DatePickerText
            label='Lease Start Date'
            prefilledDate={formApi.values.lease_start_date}
            required={false}
            dateFormat="YYYY-MM-DD"
            showYearDropdown
            dropdownMode="select"
            field="lease_start_date"
            placeholder="Enter Date" />
          <CustomFormGrid.Select
            label='Preference Used'
            field='preference_used' options={[]} placeholder='Select One' />
        </FormGrid.Row>
        <FormGrid.Row paddingBottom>
          <CustomFormGrid.Text
            label='Monthly Unit Rent'
            field='total_monthly_rent_without_parking' type='number' placeholder='Enter Amount' />
          <CustomFormGrid.Text
            label='Monthly Parking Rent'
            field='monthly_parking_rent' type='number' placeholder='Enter Amount' />
          <CustomFormGrid.Plain
            label='Total Monlthly Rent'
            text={String(totalMonthlyRent)} />
          <CustomFormGrid.Text
            label='Monlthly Tenant Contribution'
            field='monthly_tenant_contribution' type='number' placeholder='Enter Amount' />
        </FormGrid.Row>
    </React.Fragment>
    )
}

export default withNestedForm('lease', LeaseInformatonInputs)
