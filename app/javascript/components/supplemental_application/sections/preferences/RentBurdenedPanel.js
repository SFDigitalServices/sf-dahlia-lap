import React from 'react'
import { Text } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, SelectStatus } from './utils'

export const RentBurdenedPanel = ({ preferenceIndex }) => (
  <FormGrid.Row expand={false}>
    <FormItem label='Preference Name'>
      <div className='text-value'>
        Rent Burdened Housing Preference
      </div>
    </FormItem>
    <FormItem label='Total Household Monthly Rent'>
      <Text field='total_monthly_rent' type='number' />
    </FormItem>
    <FormItem label='Status'>
      <SelectStatus preferenceIndex={preferenceIndex} />
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
