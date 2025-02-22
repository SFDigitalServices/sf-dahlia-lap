import React from 'react'

import { map, sortBy } from 'lodash'
import { Form } from 'react-final-form'

import Loading from 'components/molecules/Loading'
import { InputField, SelectField } from 'utils/form/final_form/Field'
import formUtils from 'utils/formUtils'

const submissionTypeOptions = formUtils.toOptions([
  formUtils.toEmptyOption('Any type'),
  'Paper',
  'Electronic'
])

const buildListingOptions = (listings) => {
  return formUtils.toOptions([
    formUtils.toEmptyOption('Any Listing'),
    ...map(listings, (i) => [i.id, i.name])
  ])
}

const ApplicationsFilter = ({ onSubmit, listings = [], loading = false }) => {
  const sortedList = sortBy(listings, 'name')
  const initialValues = {}
  const listingOptions = buildListingOptions(sortedList)
  const listingIdField = <SelectField fieldName='listing_id' options={listingOptions} />

  return (
    <Loading isLoading={loading}>
      <Form
        onSubmit={(filters) => onSubmit(formUtils.scrubEmptyValues(filters, true))}
        initialValues={initialValues}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} noValidate>
            <div className='filter-row'>
              <div className='filter-group'>
                <div className='filter-group_item'>
                  <InputField fieldName='application_number' placeholder='Application Number' />
                </div>
                <div className='filter-group_item'>{listingIdField}</div>
                <div className='filter-group_item'>
                  <InputField fieldName='first_name' placeholder='First Name' />
                </div>
                <div className='filter-group_item'>
                  <InputField fieldName='last_name' placeholder='Last Name' />
                </div>
                <div className='filter-group_item'>
                  <SelectField
                    fieldName='submission_type'
                    options={submissionTypeOptions}
                    placeholder='Submission Type'
                  />
                </div>
                <div className='filter-group_action'>
                  <button className='small'>Filter</button>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </Loading>
  )
}

export default ApplicationsFilter
