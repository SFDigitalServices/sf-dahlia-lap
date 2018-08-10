import React from 'react'
import { Select, Text } from 'react-form'

import FormGrid  from '~/components/molecules/FormGrid'
import { FormItem, statusOptions, fieldName } from './utils'

export const RentBurdenedPanel = ({ preferenceIndex }) => (
  <FormGrid.Row expand={false}>
    <FormItem label="Preference Name">
      <div className="text-value">
        Rent Burdened Housing Preference
      </div>
    </FormItem>
    <FormItem label="Total Household Monthly Rent">
      <Text field='total_monthly_rent' type='number'/>
    </FormItem>
    <FormItem label="Status">
      <Select field={fieldName(preferenceIndex,'post_lottery_validation')} options={statusOptions}/>
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
