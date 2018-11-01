import React from 'react'
import { Form, Text, Select } from 'react-form'

import formUtils from '~/utils/formUtils'
import Loading from '~/components/molecules/Loading'

const StatusOptions = formUtils.toOptions(['No Status', 'Processing', 'Disqualified', 'Approved', 'Lease Signed', 'Waitlisted', 'Withdrawn', 'Appealed', 'All Status', [null, 'Any type']])

const LeaseUpApplicationsFilter = ({ onSubmit, loading = false }) => {
  return (
    <Loading isLoading={loading}>
      <Form onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} >
            <div className='filter-row'>
              <div className='filter-group'>
                <div className='filter-group_item'>
                  <Text field='application_number' placeholder='Application Number' />
                </div>
                <div className='filter-group_item'>
                  <Text field='first_name' placeholder='First Name' />
                </div>
                <div className='filter-group_item'>
                  <Text field='last_name' placeholder='Last Name' />
                </div>
                <div className='filter-group_item'>
                  <Select field='status' options={StatusOptions} placeholder='Status' />
                </div>
                <div className='filter-group_action'>
                  <button className='small'>Filter</button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Form>
    </Loading>
  )
}

export default LeaseUpApplicationsFilter
