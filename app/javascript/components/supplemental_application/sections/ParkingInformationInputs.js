import React, { useState } from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { SelectField, CurrencyField } from '~/utils/form/final_form/Field.js'
import { validateLeaseCurrency } from '~/utils/form/validations'

const monthlyRentFieldName = 'lease.monthly_parking_rent'
const Yes = 'Yes'
const No = 'No'

const ParkingInformationInputs = ({ form: { change, getFieldState }, values: { lease } }) => {
  const [parkingSpaceAssigned, setParkingSpaceAssigned] = useState(lease && lease['monthly_parking_rent'] ? Yes : No)
  const selectParkingSpaceAssigned = (event) => {
    const { target: { value } } = event
    setParkingSpaceAssigned(value)
    if (value === No) {
      change(monthlyRentFieldName, '')
    }
  }
  const monthlyRentVisited = getFieldState(monthlyRentFieldName)?.visited
  return (
    <>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            label='BMR Parking Space Assigned?'
            selectValue={parkingSpaceAssigned}
            onChange={selectParkingSpaceAssigned}
            fieldName='lease.bmr_parking_space_assigned'
            options={[Yes, No]}
            noPlaceholder />
        </FormGrid.Item>
        <FormGrid.Item>
          <CurrencyField
            label='Monthly Parking Cost'
            fieldName={monthlyRentFieldName}
            validation={validateLeaseCurrency}
            disabled={parkingSpaceAssigned === No}
            isDirty={monthlyRentVisited} />
        </FormGrid.Item>
      </FormGrid.Row>
    </>
  )
}

export default ParkingInformationInputs
