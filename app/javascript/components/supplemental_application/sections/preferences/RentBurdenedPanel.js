import React from 'react'
import { SelectField, FieldWrapper } from '~/utils/form/final_form/Field.js'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem } from './utils'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'
import { statusOptions } from '~/components/supplemental_application/sections/preferences/utils'

export const RentBurdenedPanel = ({ preferenceIndex }) => (
  <FormGrid.Row expand={false}>
    <FormItem label='Preference Name'>
      <div className='text-value'>
        Rent Burdened Housing Preference
      </div>
    </FormItem>
    <FormItem>
      <FieldWrapper fieldName='total_monthly_rent' type='number' label='Total Household Monthly Rent' />
    </FormItem>
    <FormItem>
      <SelectField
        fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
        options={statusOptions}
        label='Status'
        className='preference-status-select' />
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
