import React from 'react'

import FormGrid from 'components/molecules/FormGrid'
import { CheckboxField, TextCheckboxField } from 'utils/form/final_form/Field'

const ConfirmedUnits = ({ form, showHCBSUnitsCheckbox }) => {
  return (
    <>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group label='Household ADA Priorities'>
            <div className='checkbox-group form-checkbox-item' role='group'>
              <CheckboxField
                fieldName='has_ada_priorities_selected.mobility_impairments'
                label='Mobility Impairments'
              />
              <CheckboxField
                fieldName='has_ada_priorities_selected.vision_impairments'
                label='Vision Impairments'
              />
              <CheckboxField
                fieldName='has_ada_priorities_selected.hearing_impairments'
                label='Hearing Impairments'
              />
              {showHCBSUnitsCheckbox && (
                <CheckboxField
                  fieldName='has_ada_priorities_selected.hcbs_units'
                  label='HCBS Units'
                />
              )}
            </div>
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label='Household Member Priorities'>
            <div className='checkbox-group form-checkbox-item' role='group'>
              <TextCheckboxField
                fieldName='reserved_senior'
                label='Senior in Household'
                initialValue='No'
                form={form}
              />
              <TextCheckboxField
                fieldName='has_military_service'
                label='Veteran in Household'
                initialValue='No'
                form={form}
              />
              <TextCheckboxField
                fieldName='has_developmental_disability'
                label='Person with Developmental Disability in Household'
                initialValue='No'
                form={form}
              />
            </div>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
    </>
  )
}

export default ConfirmedUnits
