import React from 'react'
import { filter, map, isEmpty } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import { pluck } from '~/utils/utils'
import formUtils from '~/utils/formUtils'
import { withContext } from '../context'
import { SelectField, CurrencyField } from '~/utils/form/final_form/Field.js'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'
import validate from '~/utils/form/validations'

const toggleNoPreferenceUsed = (form, event) => {
  // lease.preference_used need to be reset, otherwise SF validation fails
  if (isEmpty(event.target.value)) {
    form.change('lease.preference_used', '')
  }
  form.change('lease.no_preference_used', isEmpty(event.target.value))
}

const validateLeaseCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(value)
  )
}

const LeaseInformationInputs = ({ form, store }) => {
  const { availableUnits, application } = store
  const availableUnitsOptions = formUtils.toOptions(map(availableUnits, pluck('id', 'unit_number')))
  const noUnitsOptions = [{ value: '', label: 'No Units Available' }]
  const confirmedPreferences = filter(application.preferences, { 'post_lottery_validation': 'Confirmed' })
  const confirmedPreferenceOptions = formUtils.toOptions(map([{'id': null, 'preference_name': 'None'}, ...confirmedPreferences], pluck('id', 'preference_name')))
  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField
              id='lease_assigned_unit'
              label='Assigned Unit Number'
              fieldName='lease.unit'
              options={availableUnitsOptions}
              disabled={!availableUnitsOptions.length}
              disabledOptions={noUnitsOptions} />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <MultiDateField
            id='lease_start_date'
            fieldName='lease.lease_start_date'
            form={form}
            label='Lease Start Date' />
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField
              label='Preference Used'
              onChange={(value) => toggleNoPreferenceUsed(form, value)}
              fieldName='lease.preference_used'
              options={confirmedPreferenceOptions} />
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <CurrencyField
            label='Monthly Rent'
            fieldName='lease.total_monthly_rent_without_parking'
            placeholder='Enter Amount'
            validation={validateLeaseCurrency} />
        </FormGrid.Item>
        <FormGrid.Item>
          <CurrencyField
            label='Monthly Parking Cost'
            fieldName='lease.monthly_parking_rent'
            placeholder='Enter Amount'
            validation={validateLeaseCurrency} />
        </FormGrid.Item>
        <FormGrid.Item>
          <CurrencyField
            label='Monthly Tenant Contribution'
            fieldName='lease.monthly_tenant_contribution'
            placeholder='Enter Amount'
            validation={validateLeaseCurrency} />
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default withContext(LeaseInformationInputs)
