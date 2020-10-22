import React from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { CurrencyField, SelectField, InputField } from '~/utils/form/final_form/Field.js'
import { validateLeaseCurrency } from '~/utils/form/validations'

const monthlyRentFieldName = 'lease.monthly_parking_rent'
const Yes = 'Yes'
const No = 'No'
const Waitlist = 'Waitlist'

const ParkingInformationInputs = ({
  form: { change, getFieldState },
  values: { lease },
  disabled = false
}) => {
  const onChangeHasParkingSpace = ({ target: { value } }) => {
    if (value !== Yes) {
      change(monthlyRentFieldName, null)
    }
  }

  const monthlyRentVisited = getFieldState(monthlyRentFieldName)?.visited

  const hasParkingSpace = lease?.bmr_parking_space_assigned === Yes

  return (
    <>
      <FormGrid.Row>
        <FormGrid.Item medium>
          <SelectField
            label='BMR Parking Space Assigned?'
            onChange={onChangeHasParkingSpace}
            fieldName='lease.bmr_parking_space_assigned'
            options={[Yes, No, Waitlist]}
            disabled={disabled}
          />
        </FormGrid.Item>
        <FormGrid.Item medium>
          <CurrencyField
            label='Monthly Parking Cost'
            fieldName={monthlyRentFieldName}
            validation={validateLeaseCurrency}
            disabled={disabled || !hasParkingSpace}
            isDirty={monthlyRentVisited}
          />
        </FormGrid.Item>
        <FormGrid.Item medium>
          <InputField
            label='Space Assigned'
            fieldName='lease.parking_spot_number'
            disabled={disabled || !hasParkingSpace}
            isDirty={monthlyRentVisited}
            placeholder='Enter Space Assigned'
          />
        </FormGrid.Item>
      </FormGrid.Row>
    </>
  )
}

export default ParkingInformationInputs
