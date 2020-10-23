import React from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { CurrencyField, SelectField, InputField } from '~/utils/form/final_form/Field.js'
import { validateLeaseCurrency } from '~/utils/form/validations'

const monthlyRentFieldName = 'lease.monthly_parking_rent'
const parkingSpotFieldName = 'lease.parking_spot_number'
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
      change(parkingSpotFieldName, null)
    }
  }

  const monthlyRentVisited = getFieldState(monthlyRentFieldName)?.visited
  const hasParkingSpace = lease?.bmr_parking_space_assigned === Yes

  return (
    <>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            label='BMR Parking Space Assigned?'
            onChange={onChangeHasParkingSpace}
            fieldName='lease.bmr_parking_space_assigned'
            options={[Yes, No, Waitlist]}
            disabled={disabled}
          />
        </FormGrid.Item>
        {hasParkingSpace && (
          <FormGrid.Item width='25%'>
            <CurrencyField
              label='Monthly Cost'
              fieldName={monthlyRentFieldName}
              validation={validateLeaseCurrency}
              disabled={disabled}
              isDirty={monthlyRentVisited}
              placeholder='Enter cost...'
            />
          </FormGrid.Item>
        )}
        {hasParkingSpace && (
          <FormGrid.Item width='25%'>
            <InputField
              label='Space Assigned'
              fieldName={parkingSpotFieldName}
              disabled={disabled}
              isDirty={monthlyRentVisited}
              placeholder='Enter space...'
            />
          </FormGrid.Item>
        )}
      </FormGrid.Row>
    </>
  )
}

export default ParkingInformationInputs
