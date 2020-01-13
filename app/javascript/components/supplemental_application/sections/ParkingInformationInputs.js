import React, { useState } from 'react'

import FormGrid from '~/components/molecules/FormGrid'
import { SelectField, CurrencyField } from '~/utils/form/final_form/Field.js'
import validate from '~/utils/form/validations'

const monthlyRentFieldName = 'lease.monthly_parking_rent'
const Yes = 'Yes'
const No = 'No'

const validateLeaseCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(value)
  )
}

const ParkingInformationInputs = ({ form: { change }, values: { lease } }) => {
  const [parkingSpaceAssigned, setParkingSpaceAssigned] = useState(lease && lease['monthly_parking_rent'] ? Yes : No)
  const selectParkingSpaceAssigned = (event) => {
    const { target: { value } } = event
    setParkingSpaceAssigned(value)
    if (value === No) {
      change(monthlyRentFieldName, '')
    }
  }
  return (
    <React.Fragment>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <FormGrid.Group>
            <SelectField
              label='BMR Parking Space Assigned?'
              selectValue={parkingSpaceAssigned}
              onChange={selectParkingSpaceAssigned}
              fieldName='lease.bmr_parking_space_assigned'
              options={[Yes, No]} />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <CurrencyField
            label='Monthly Parking Cost'
            fieldName={monthlyRentFieldName}
            placeholder='Enter Amount'
            validation={validateLeaseCurrency}
            disabled={parkingSpaceAssigned === No} />
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default ParkingInformationInputs
