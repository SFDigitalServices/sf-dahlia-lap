import React from 'react'
import { Form, Text, Select } from 'react-form'
import formUtils from '~/utils/formUtils'

const submissionTypeOptions = formUtils.toOptions(["Paper", "Electronic", [null, "Any type"]])

const buildListingOptions = (listings) => {
  return formUtils.toOptions([
    [null, 'Any Listing'],
    ...listings.map(i => [i.id, i.name])
  ])
}

const ApplicationsFilter = ({ onSubmit, listings = [] }) => {
  const listingOptions = buildListingOptions(listings)

  return (
    <Form onSubmit={onSubmit}>
      { formApi => (
        <form onSubmit={formApi.submitForm} >
          <div className='row'>
            <div className='column large-2'>
              <Text field="application_number" placeholder='Application Number'/>
            </div>
            <div className='column large-2'>
              <Select field="listing" options={listingOptions}  placeholder="Listing"/>
            </div>
            <div className='column large-2'>
              <Text field="first_name" placeholder="First Name"/>
            </div>
            <div className='column large-2'>
              <Text field="last_name" placeholder="Last Name"/>
            </div>
            <div className='column large-2'>
              <Select field="submission_type" options={submissionTypeOptions} placeholder="Submission Type"/>
            </div>
            <div className='column large-2'>
              <button className='small'>Filter</button>
            </div>
          </div>
        </form>
      )}
    </Form>
  )
}

export default ApplicationsFilter
