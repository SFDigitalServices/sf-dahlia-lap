import React from 'react'

import FormGrid from 'components/molecules/FormGrid'

import { Comment, FormItem } from './utils'

export const LayeredPreferencePanel = ({ preference }) => {
  return (
    <>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>{'Veteran status'}</div>
        </FormItem>
        <FormItem label='HH Member on Proof'>
          <div className='text-value'>{preference.person_who_claimed_name}</div>
        </FormItem>
        <FormItem label='Type of Proof'>
          <div className='text-value'>
            {preference.veteran_type_of_proof ? preference.veteran_type_of_proof : 'None'}
          </div>
        </FormItem>
        <FormItem label='Status'>
          <div className='text-value'>{preference.post_lottery_validation}</div>
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <div className='form-group'>
          <div className='form-grid_item large-12 column padding-bottom'>
            <Comment>{'Veteran status already confirmed by MOHCD.'}</Comment>
          </div>
        </div>
      </FormGrid.Row>
    </>
  )
}

export default LayeredPreferencePanel
