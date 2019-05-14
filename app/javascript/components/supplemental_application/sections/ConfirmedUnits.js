import React from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { YesNoRadioField, CheckboxField } from '~/utils/form/final_form/Field.js'

const ConfirmedUnits = () => {
  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <FormGrid.Group label='Senior in Household'>
            <YesNoRadioField fieldName='reserved_senior' />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label='Veteran in Household'>
            <YesNoRadioField fieldName='has_military_service' />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label='Person with Developmental Disability in Household'>
            <YesNoRadioField fieldName='has_developmental_disability' />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
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
