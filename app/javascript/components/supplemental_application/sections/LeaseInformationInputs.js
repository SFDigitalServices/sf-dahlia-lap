import React from 'react'
import { Checkbox, Form, NestedForm, Select, Text } from 'react-form'
import { filter, map } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import { pluck, decorateComponents } from '~/utils/utils'
import formUtils from '~/utils/formUtils'
import { withContext } from '../context'
import { Field } from '~/utils/form/Field'
import validate from '~/utils/form/validations'

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

const toggleNoPreferenceUsed = (formApi, value) => {
  formApi.setValue('no_preference_used', !value)
}

const validateLeaseCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(value)
  )
}

const validateError = (values) => ({
  total_monthly_rent_without_parking: validateLeaseCurrency(values.total_monthly_rent_without_parking),
  monthly_parking_rent: validateLeaseCurrency(values.monthly_parking_rent),
  monthly_tenant_contribution: validateLeaseCurrency(values.monthly_tenant_contribution)
})

const LeaseInformationInputs = ({ formApi, store }) => {
  const { availableUnits, application } = store
  const availableUnitsOptions = formUtils.toOptions(map(availableUnits, pluck('id', 'unit_number')))
  const confirmedPreferences = filter(application.preferences, { 'post_lottery_validation': 'Confirmed' })
  const confirmedPreferenceOptions = formUtils.toOptions(map([{'id': null, 'preference_name': 'None'}, ...confirmedPreferences], pluck('id', 'preference_name')))
  return (
    <NestedForm field='lease' >
      <Form defaultValues={formApi.values['lease']} validateError={validateError}>
        { nestedFormApi => {
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
                  onChange={(value) => toggleNoPreferenceUsed(nestedFormApi, value)}
                  field='preference_used' options={confirmedPreferenceOptions} placeholder='Select One' />
              </FormGrid.Row>
              <FormGrid.Row paddingBottom>
                <FormGrid.Item>
                  <Field.Text
                    label='Monthly Rent'
                    field='total_monthly_rent_without_parking'
                    placeholder='Enter Amount'
                    errorMessage={(label, error) => error} />
                </FormGrid.Item>
                <FormGrid.Item>
                  <Field.Text
                    label='Monthly Parking Cost'
                    field='monthly_parking_rent'
                    placeholder='Enter Amount'
                    errorMessage={(label, error) => error} />
                </FormGrid.Item>
                <FormGrid.Item>
                  <Field.Text
                    label='Monthly Tenant Contribution'
                    field='monthly_tenant_contribution'
                    placeholder='Enter Amount'
                    errorMessage={(label, error) => error} />
                </FormGrid.Item>
              </FormGrid.Row>
            </React.Fragment>
          )
        }}
      </Form>
    </NestedForm>
  )
}

export default withContext(LeaseInformationInputs)
