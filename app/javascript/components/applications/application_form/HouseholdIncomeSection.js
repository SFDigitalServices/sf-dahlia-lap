import React from 'react'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import formOptions from './formOptions'
import validate from '~/utils/form/validations'

const {
  householdVouchersSubsidiesOptions
} = formOptions

const HouseholdIncomeSection = () => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <h3>Declared Household Income</h3>
      <div className='row'>
        <div className='small-6 columns'>
          <FieldWrapper
            type='text'
            fieldName='annual_income'
            id='annual_income'
            label='Annual Income'
            maxLength={maxLengthMap['income']}
            validation={validate.isValidCurrency('Please enter a valid dollar amount.')}
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
