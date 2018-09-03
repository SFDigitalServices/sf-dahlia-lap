import React from 'react'
import { Text } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem } from './utils'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'

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
      {/*
        TODO: Add ability for users to change status on pref.
        For now, we just show the current status in a read-only field.
      */}
      <Text field={buildFieldId(preferenceIndex, 'post_lottery_validation')} disabled='true' />
    </FormItem>
  </FormGrid.Row>
)

export default RentBurdenedPanel
