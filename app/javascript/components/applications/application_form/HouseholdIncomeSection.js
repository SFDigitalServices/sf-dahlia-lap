import React from 'react'
import { CurrencyField, SelectField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import formOptions from './formOptions'
import validate from '~/utils/form/validations'

const {
  householdVouchersSubsidiesOptions
} = formOptions

const HouseholdIncomeSection = ({ visited }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <h3>Declared Household Income</h3>
      <div className='row'>
        <div className='small-6 columns'>
          <CurrencyField
            fieldName='annual_income'
            id='annual_income'
            label='Annual Income'
            maxLength={maxLengthMap['income']}
            validation={validate.isValidCurrency('Please enter a valid dollar amount.')}
            isDirty={visited && visited['annual_income']}
          />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='housing_voucher_or_subsidy'
            label='Housing Voucher/ Subsidy'
            options={householdVouchersSubsidiesOptions} />
        </div>
      </div>
    </div>
  )
}

export default HouseholdIncomeSection
