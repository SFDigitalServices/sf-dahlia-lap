import React from 'react'

import { range } from 'lodash'

import FormGrid from 'components/molecules/FormGrid'
import { SelectField } from 'utils/form/final_form/Field'
import formUtils from 'utils/formUtils'

const DemographicsInputs = () => {
  const numberOfPeopleOptions = range(10)
  const martialStatusOptions = ['Single', 'Married', 'Domestic Partner']

  return (
    <>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            id='demographics-dependents'
            fieldName='number_of_dependents'
            options={numberOfPeopleOptions}
            format={formUtils.formatNumber}
            label='Number of Dependents'
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            id='demographics-seniors'
            fieldName='number_of_seniors'
            options={numberOfPeopleOptions}
            format={formUtils.formatNumber}
            label='Number of Seniors'
            helpText='Check the listing to verify the age cutoff for seniors.'
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            id='demographics-minors'
            fieldName='number_of_minors'
            options={numberOfPeopleOptions}
            format={formUtils.formatNumber}
            label='Number of Minors'
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            id='demographics-marital-status'
            fieldName='applicant.marital_status'
            options={martialStatusOptions}
            label='Primary Applicant Marital Status'
          />
        </FormGrid.Item>
      </FormGrid.Row>
    </>
  )
}

export default DemographicsInputs
