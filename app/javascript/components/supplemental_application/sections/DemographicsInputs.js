import React from 'react'
import { range } from 'lodash'
import { SelectField } from '~/utils/form/final_form/Field.js'

import FormGrid from '~/components/molecules/FormGrid'
import formUtils from '~/utils/formUtils'

const DemographicsInputs = () => {
  const numberOfPeopleOptions = range(10)
  const martialStatusOptions = ['Single', 'Married', 'Domestic Partner']

  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField id='demographics-dependents'
              fieldName='number_of_dependents'
              options={numberOfPeopleOptions}
              format={formUtils.formatNumber}
              label='Number of Dependents' />
          </FormGrid.Group>
        </FormGrid.Item>

        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField id='demographics-seniors'
              fieldName='number_of_seniors'
              options={numberOfPeopleOptions}
              format={formUtils.formatNumber}
              label='Number of Seniors' />
            <span className='form-note' id='household-annual-income'>
              Check the listing to verify the age cutoff for seniors.
            </span>
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField id='demographics-minors'
              fieldName='number_of_minors'
              options={numberOfPeopleOptions}
              format={formUtils.formatNumber}
              label='Number of Minors' />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField id='demographics-marital-status'
              fieldName='applicant.marital_status'
              options={martialStatusOptions}
              label='Primary Applicant Marital Status' />
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default DemographicsInputs
