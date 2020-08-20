import React from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { CheckboxField, TextCheckboxField } from '~/utils/form/final_form/Field.js'

const ConfirmedUnits = ({form}) => {
  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item wide>
          <FormGrid.Group label='Household Members Priorities'>
            <div className='checkbox-group form-checkbox-item' role='group'>
              <TextCheckboxField
                fieldName='reserved_senior'
                label='Senior in Household'
                form={form} />
              <TextCheckboxField
                fieldName='has_military_service'
                label='Veteran in Household'
                form={form} />
              <TextCheckboxField
                fieldName='has_developmental_disability'
                label='Person with Developmental Disability in Household'
                form={form} />
            </div>
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item wide>
          <FormGrid.Group label='Household ADA Priorities'>
            <div className='checkbox-group form-checkbox-item' role='group'>
              <CheckboxField
                fieldName='has_ada_priorities_selected.mobility_impairments'
                label='Mobility Impairments' />
              <CheckboxField
                fieldName='has_ada_priorities_selected.vision_impairments'
                label='Vision Impairments' />
              <CheckboxField
                fieldName='has_ada_priorities_selected.hearing_impairments'
                label='Hearing Impairments' />
            </div>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default ConfirmedUnits
