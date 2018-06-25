import React from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { RadioGroup, Radio, Checkbox } from 'react-form';

const YesNoRadioGroup = ({field}) => {
  return (
    <div className='radio-group-inline'>
      <RadioGroup field={field}>
        {(group) => (
          <React.Fragment>
            <p class="radio-inline">
              <Radio group={group} value={`Yes`} id={`${field}-yes`}/>
              <label class="radio-inline_label" htmlFor={`${field}-yes`}>Yes</label>
            </p>
            <p class="radio-inline">
              <Radio group={group} value={`No`} id={`${field}-no`}/>
              <label class="radio-inline_label" htmlFor={`${field}-no`}>No</label>
            </p>
          </React.Fragment>
        )}
      </RadioGroup>
    </div>
  )
}

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
            <div className="checkbox-block">
              <Checkbox id="preferences-displaced" field="household_ada_priorities.displaced_tenants_preference"/>
              <label className="checkbox-block_label" htmlFor="preferences-displaced">
                Displaced Tenants Preference
              </label>
            </div>
            <div className="checkbox-block">
              <Checkbox id="preferences-cop" field="household_ada_priorities.certificate_of_preferences"/>
              <label className="checkbox-block_label" htmlFor="preferences-cop">
                Certificate of Preference
              </label>
            </div>
          </div>
        </FormGrid.Group>
      </FormGrid.Item>
    </FormGrid.Row>
  )
}

export default ConfirmedUnits
