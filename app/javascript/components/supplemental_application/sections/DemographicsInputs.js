import React from 'react'
import { range } from 'lodash'
import { Select } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import formUtils from '~/utils/formUtils'

const DemographicsInputs = ({onChange}) => {
  const numberOfPeopleOptions = formUtils.toOptions(range(10))
  const martialStatusOptions = formUtils.toOptions(['Single', 'Married', 'Domestic Partner'])

  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <FormGrid.Group label='Number of Dependents'>
            <Select id='demographics-dependents' field='number_of_dependents' options={numberOfPeopleOptions} placeholder='Select One' />
          </FormGrid.Group>
        </FormGrid.Item>

        <FormGrid.Item>
          <FormGrid.Group label='Number of Seniors'>
            <Select id='demographics-seniors' field='number_of_seniors' options={numberOfPeopleOptions} placeholder='Select One' />
            <span className='form-note shift-up' id='household-annual-income'>
              Check the listing to verify the age cutoff for seniors.
            </span>
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label='Number of Minors'>
            <Select id='demographics-minors' field='number_of_minors' options={numberOfPeopleOptions} placeholder='Select One' />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label='Primary Applicant Marital Status'>
            <Select id='demographics-marital-status' field='applicant.marital_status' options={martialStatusOptions} placeholder='Select One' />
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default DemographicsInputs
