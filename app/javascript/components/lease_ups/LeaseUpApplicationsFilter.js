import React from 'react'
import { Form } from 'react-final-form'
import { InputField, SelectField } from '~/utils/form/final_form/Field'
import formUtils, { reorderEmptyOptions } from '~/utils/formUtils'
import LEASE_UP_STATUS_OPTIONS from '~/utils/statusUtils'
import Loading from '~/components/molecules/Loading'
import { clone } from 'lodash'

const statusFilterOptions = clone(LEASE_UP_STATUS_OPTIONS)
statusFilterOptions.unshift({value: 'No Status', label: 'No Status'})
statusFilterOptions.push({value: null, label: 'All Status'})

const StatusOptions = reorderEmptyOptions(formUtils.toOptions(statusFilterOptions))

const LeaseUpApplicationsFilter = ({ onSubmit, preferences = [], loading = false }) => {
  preferences.push([null, 'All Preferences'], ['general', 'General'])
  let preferenceOptions = reorderEmptyOptions(formUtils.toOptions(preferences))

  return (
    <Loading isLoading={loading}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} noValidate>
            <div className='filter-row'>
              <div className='filter-group'>
                <div className='filter-group_item'>
                  <SelectField fieldName='preference' options={preferenceOptions} placeholder='Preference' />
                </div>
                <div className='filter-group_item'>
                  <InputField fieldName='application_number' placeholder='Application Number' />
                </div>
                <div className='filter-group_item'>
                  <InputField fieldName='first_name' placeholder='First Name' />
                </div>
                <div className='filter-group_item'>
                  <InputField fieldName='last_name' placeholder='Last Name' />
                </div>
                <div className='filter-group_item'>
                  <SelectField fieldName='status' options={StatusOptions} placeholder='Status' />
                </div>
                <div className='filter-group_action'>
                  <button className='small'>Filter</button>
                </div>
              </div>
            </div>
          </form>
        )} />
    </Loading>
  )
}

export default LeaseUpApplicationsFilter
