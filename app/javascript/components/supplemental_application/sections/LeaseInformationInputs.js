import React from 'react'
import { Select, Text, Checkbox } from 'react-form'
import { filter, map, toSafeInteger } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import { pluck, decorateComponents } from '~/utils/utils'
import { withNestedForm } from '~/utils/form/hoc'
import formUtils from '~/utils/formUtils'
import { withContext } from '../context'

const Plain = ({ text }) => <div className='text-value'>{text}</div>

const INPUTS = { 'Select': Select, 'Text': Text, 'Plain': Plain, 'Checkbox': Checkbox }

const CustomFormGrid = decorateComponents(INPUTS, Component => {
  return ({ label, ...rest }) => (
    <FormGrid.Item>
      <FormGrid.Group label={label}>
        <Component {...rest} />
      </FormGrid.Group>
    </FormGrid.Item>
  )
})

const getTotalMonthlyRent = (values) => {
  const monthlyUnitRent = values.total_monthly_rent_without_parking
  const monthlyParkingRent = values.monthly_parking_rent

  if (monthlyUnitRent || monthlyParkingRent) {
    return toSafeInteger(monthlyUnitRent) + toSafeInteger(monthlyParkingRent)
  } else {
    return 'Total Unit & Parking Rent'
  }
}

const toggleNoPreferenceUsed = (formApi, value) => {
  formApi.setValue('no_preference_used', !value)
}

const LeaseInformationInputs = ({ formApi, store }) => {
  const { availableUnits, application } = store
  const availableUnitsOptions = formUtils.toOptions(map(availableUnits, pluck('id', 'unit_number')))
  const totalMonthlyRent = getTotalMonthlyRent(formApi.values)
  const confirmedPreferences = filter(application.preferences, { 'post_lottery_validation': 'Confirmed' })
  const confirmedPreferenceOptions = formUtils.toOptions(map([{'id': null, 'preference_name': 'None'}, ...confirmedPreferences], pluck('id', 'preference_name')))
  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <CustomFormGrid.Select
          label='Assigned Unit Number'
          field='unit' options={availableUnitsOptions} placeholder='Select One' />
        <CustomFormGrid.Text
          field='lease_start_date'
          label='Lease Start Date'
          type='date'
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          placeholder='YYYY-MM-DD'
        />
        <CustomFormGrid.Select
          label='Preference Used'
          onChange={(value) => toggleNoPreferenceUsed(formApi, value)}
          field='preference_used' options={confirmedPreferenceOptions} placeholder='Select One' />
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        <CustomFormGrid.Text
          label='Monthly Unit Rent'
          field='total_monthly_rent_without_parking' type='number' placeholder='Enter Amount' />
        <CustomFormGrid.Text
          label='Monthly Parking Rent'
          field='monthly_parking_rent' type='number' placeholder='Enter Amount' />
        <CustomFormGrid.Plain
          label='Total Monthly Rent'
          text={String(totalMonthlyRent)} />
        <CustomFormGrid.Text
          label='Monthly Tenant Contribution'
          field='monthly_tenant_contribution' type='number' placeholder='Enter Amount' />
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default withNestedForm('lease', withContext(LeaseInformationInputs))
