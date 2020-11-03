import React from 'react'

import formOptions from 'components/applications/application_form/formOptions'
import { buildFieldId } from 'components/applications/application_form/preferences/utils'
import FormGrid from 'components/molecules/FormGrid'
import { SelectField, CurrencyField } from 'utils/form/final_form/Field.js'
import validate from 'utils/form/validations'

import { FormItem, statusOptions } from './utils'
const { labelize } = formOptions

export const RentBurdenedPanel = ({ preferenceIndex, visited }) => (
  <FormGrid.Row expand={false}>
    <FormItem label='Preference Name'>
      <div className='text-value'>Rent Burdened Housing Preference</div>
    </FormItem>
    <FormItem>
      {/* Total monthly rent is stored in the application, not the preference. */}
      <CurrencyField
        fieldName='total_monthly_rent'
        type='number'
        label='Total Household Monthly Rent'
        validation={validate.isValidCurrency('Please enter a valid dollar amount.')}
        isDirty={visited && visited.total_monthly_rent}
      />
    </FormItem>
    <FormItem>
      <SelectField
        fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
        options={labelize(statusOptions, { disableEmpty: true })}
        label='Status'
        className='preference-status-select'
      />
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
