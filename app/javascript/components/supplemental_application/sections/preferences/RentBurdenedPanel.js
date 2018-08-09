import React from 'react'
import { Select, Text } from 'react-form'

import FormGrid  from '~/components/molecules/FormGrid'
import { FormItem, statusOptions } from './utils'

export const RentBurdenedPanel = ({ data }) => (
  <FormGrid.Row expand={false}>
    <FormItem label="Preference Name">
      <div className="text-value">
        Rent Burdened Housing Preference
      </div>
    </FormItem>
    <FormItem label="Total Household Monthly Rent">
      <Text field='total_household_rent' type='number'/>
    </FormItem>
    <FormItem label="Status">
      <Select field='post_lottery_validation' options={statusOptions}/>
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
