import React from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { RadioGroup, Radio, Checkbox } from 'react-form';

const YesNoRadioGroup = ({field}) => {
  return (
    <div className='radio-group-inline'>
      <RadioGroup field={field}>
        {(group) => (
          <React.Fragment>
            <p className="radio-inline">
              <Radio group={group} value={`Yes`} id={`${field}-yes`}/>
              <label className="radio-inline_label" htmlFor={`${field}-yes`}>Yes</label>
            </p>
            <p className="radio-inline">
              <Radio group={group} value={`No`} id={`${field}-no`}/>
              <label className="radio-inline_label" htmlFor={`${field}-no`}>No</label>
            </p>
          </React.Fragment>
        )}
      </RadioGroup>
    </div>
  )
}

const CheckboxBlock = ({ id, field, label }) => (
  <div className="checkbox-block">
    <Checkbox id={id || field} field={field} />
    <label className="checkbox-block_label" htmlFor={id || field}>
      {label}
    </label>
  </div>
)

const ConfirmedUnits = () => {
  return (
    <FormGrid.Row paddingBottom>
      <FormGrid.Item>
        <FormGrid.Group label="Senior in Household">
          <YesNoRadioGroup field="reserved_senior" />
        </FormGrid.Group>
      </FormGrid.Item>
      <FormGrid.Item>
        <FormGrid.Group label="Veteran in Household">
          <YesNoRadioGroup field="has_military_service" />
        </FormGrid.Group>
      </FormGrid.Item>
      <FormGrid.Item>
        <FormGrid.Group label="Person with Developmental Disability in House">
          <YesNoRadioGroup field="has_developmentaldisability" />
        </FormGrid.Group>
      </FormGrid.Item>
      <FormGrid.Item>
        <FormGrid.Group label="Household ADA Priorities">
          <div className="checkbox-group form-checkbox-item" role="group">
            <CheckboxBlock
              field="has_ada_priorities_selected.mobility_impaired"
              label="Mobility Impaired"/>
            <CheckboxBlock
              field="has_ada_priorities_selected.vision_impaired"
              label="Vision Impaired"/>
            <CheckboxBlock
              field="has_ada_priorities_selected.hearing_impaired"
              label="Hearing Impaired"/>
          </div>
        </FormGrid.Group>
      </FormGrid.Item>
    </FormGrid.Row>
  )
}

export default ConfirmedUnits
