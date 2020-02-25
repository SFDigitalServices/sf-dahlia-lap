import React from 'react'
import { Form } from 'react-final-form'
import { InputField, SelectField } from '~/utils/form/final_form/Field'
import formUtils from '~/utils/formUtils'
import LEASE_UP_STATUS_OPTIONS, { LEASE_UP_ACCESSIBILITY_OPTIONS } from '~/utils/statusUtils'
import Loading from '~/components/molecules/Loading'
import { clone } from 'lodash'

const statusFilterOptions = [
  ...[{value: null, label: 'Any Status'}, {value: 'No Status', label: 'No Status'}],
  ...clone(LEASE_UP_STATUS_OPTIONS)
]

const accessibilityFilterOptions = [
  {value: null, label: 'Any Accessibility Request'},
  ...clone(LEASE_UP_ACCESSIBILITY_OPTIONS)
]

const StatusOptions = formUtils.toOptions(statusFilterOptions)

const LeaseUpApplicationsFilter = ({ onSubmit, preferences = [], loading = false }) => {
  const preferenceOptions = formUtils.toOptions([[null, 'Any Preference'], ...preferences, ['general', 'General']])

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
                <div className='filter-group_item'>
                  <SelectField fieldName='accessibility' options={accessibilityFilterOptions} placeholder='Accessibility Requests' />
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
