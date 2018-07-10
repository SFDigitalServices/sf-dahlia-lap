import React from 'react'
import { Text, Select } from 'react-form'

const HouseholdIncomeSection = () => {
  return (
    <div className="border-bottom margin-bottom--2x">
      <h3>Declared Household Income</h3>
      <div className="row">
        <div className="small-6 columns">
          <label>Annual Income</label>
          <Text field="annualIncome" />
        </div>
        <div className="small-6 columns">
          <label>Housing Voucher/ Subsidy</label>
          <Select field="householdVouchersSubsidies"
            options={[
              {value: 'true', label: 'true'},
              {value: 'false', label: 'false'},
              {value: 'Left Blank', label: 'Left Blank'}
            ]} />
        </div>
      </div>
    </div>
  )
}

export default HouseholdIncomeSection
