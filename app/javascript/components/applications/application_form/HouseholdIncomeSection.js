import React from 'react'
import { Text, Select } from 'react-form'

const householdVouchersSubsidiesOptions = [
  {value: 'true', label: 'true'},
  {value: 'false', label: 'false'},
  {value: 'Left Blank', label: 'Left Blank'}
]

const HouseholdIncomeSection = () => {
  return (
    <div className="border-bottom margin-bottom--2x">
      <h3>Declared Household Income</h3>
      <div className="row">
        <div className="small-6 columns">
          <label>Annual Income</label>
          <Text field="annual_income" />
        </div>
        <div className="small-6 columns">
          <label>Housing Voucher/ Subsidy</label>
          <Select
            field="housing_voucher_or_subsidy"
            options={householdVouchersSubsidiesOptions} />
        </div>
      </div>
    </div>
  )
}

export default HouseholdIncomeSection
