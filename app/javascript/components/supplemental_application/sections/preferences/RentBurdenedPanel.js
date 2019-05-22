import React from 'react'
import { SelectField, TextField } from '~/utils/form/final_form/Field.js'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem } from './utils'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'
import { statusOptions } from '~/components/supplemental_application/sections/preferences/utils'
import formOptions from '~/components/applications/application_form/formOptions'
const { labelize } = formOptions

export const RentBurdenedPanel = ({ preferenceIndex }) => (
  <FormGrid.Row expand={false}>
    <FormItem label='Preference Name'>
      <div className='text-value'>
        Rent Burdened Housing Preference
      </div>
    </FormItem>
    <FormItem>
      <TextField fieldName='total_monthly_rent' type='number' label='Total Household Monthly Rent' />
    </FormItem>
    <FormItem>
      <SelectField
        fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
        options={labelize(statusOptions, {disableEmpty: true})}
        label='Status'
        className='preference-status-select' />
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
