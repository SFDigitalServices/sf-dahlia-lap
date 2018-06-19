import React from 'react'
import { range } from 'lodash'
import { Select } from 'react-form';

import FormGrid from '~/components/molecules/FormGrid'
import formUtils from '~/utils/formUtils'

const DemographicsInputs = ({onChange}) => {
  const numberOfDependentsOptions = formUtils.toOptions(range(10))
  const martialStatusOptions = formUtils.toOptions(["Single", "Married", "Domestic Partner"])

  return (
    <React.Fragment>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group label='Number of Dependents'>
            <Select field='dependents' options={numberOfDependentsOptions} placeholder='Select One'/>
          </FormGrid.Group>
        </FormGrid.Item>

        <FormGrid.Item>
          <FormGrid.Group label='Primary Applicant Marital Status'>
            <Select field='maritalStatus' options={martialStatusOptions} placeholder='Select One' />
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default DemographicsInputs
