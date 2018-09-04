// TODO: this is using the old date picker text. Merge cartitas first.
import React from 'react'
import { Select, Text } from 'react-form'
import { map, toSafeInteger } from 'lodash'

// import DatePickerText from '~/components/applications/application_form/DatePickerText'
import FormGrid from '~/components/molecules/FormGrid'

import { pluck, decorateComponents } from '~/utils/utils'
import { withNestedForm } from '~/utils/form/hoc'
import formUtils from '~/utils/formUtils'

const Plain = ({ text }) => <div>{text}</div>

const INPUTS = { 'Select': Select, 'Text': Text, 'Plain': Plain }

const CustomFormGrid = decorateComponents(INPUTS, Component => {
  return ({ label, ...rest }) => (
    <FormGrid.Item>
      <FormGrid.Group label={label}>
        <Component {...rest} />
      </FormGrid.Group>
    </FormGrid.Item>
  )
})

const LeaseInformatonInputs = ({ formApi, availableUnits }) => {
  const list = map(availableUnits, pluck('id', 'unit_number'))
  const availableUnitsOptions = formUtils.toOptions(list)
  // const { monthly_unit_rent, monthly_parking_rent } = formApi.values

  const monlthUnitRent = formApi.values.monthly_unit_rent
  const monthlyParkingRent = formApi.values.monthly_parking_rent

  const totalMonthlyRent = toSafeInteger(monlthUnitRent) + toSafeInteger(monthlyParkingRent)
  // console.log(map(availableUnitsOptions,'value'))
  // console.log(formApi.values.unit)
  // console.log(includes(map(availableUnitsOptions,'value'), formApi.values.unit))
  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <CustomFormGrid.Select
          label='Assigned Unit Number'
          field='unit' options={availableUnitsOptions} placeholder='Select One' />
        <CustomFormGrid.Text
          field='date_of_birth'
          label='Date of Birth'
          blockNote='(required)'
          type='date'
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          placeholder='YYYY-MM-DD'
        />
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
