import React, { useEffect, useState } from 'react'
import { isNil, isString } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import { formatPercent } from '~/utils/utils'
import getAmiChartYears from '~/utils/amiYearUtils'
import formUtils from '~/utils/formUtils'

import {
  YesNoRadioGroup,
  CurrencyField,
  PercentField,
  SelectField
} from '~/utils/form/final_form/Field.js'
import validate from '~/utils/form/validations'

const validateIncomeCurrency = value => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 15))(
      'Please enter a smaller number.'
    )(value)
  )
}

export const getAmiPercent = ({ income, ami }) => {
  if (!income) {
    return 'Enter HH Income'
  }
  if (isNil(ami)) {
    return 'Missing AMI Chart'
  }
  let incomeFloat = isString(income)
    ? Number(income.replace(/[$,]+/g, ''))
    : income
  if (Number.isNaN(incomeFloat)) {
    return 'Fix HH Income'
  }
  return formatPercent(incomeFloat / Number(ami))
}

const ConfirmedHouseholdIncome = ({ listingAmiCharts, visited }) => {
  const [amiChartTypes, setAmiChartTypes] = useState([])
  const [amiChartYears, setAmiChartYears] = useState([])

  useEffect(() => {
    const getAmiCharts = async () => {
      if (listingAmiCharts.length > 0) {
        setAmiChartYears(
          formUtils.toOptions(getAmiChartYears(listingAmiCharts))
        )
        setAmiChartTypes(
          formUtils.toOptions(listingAmiCharts.map(x => x.ami_chart_type))
        )
      }
    }

    getAmiCharts()
  }, [])

  return (
    <>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group label='Recurring Voucher/Subsidy'>
            <YesNoRadioGroup fieldName='housing_voucher_or_subsidy' />
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group>
            <CurrencyField
              fieldName='household_assets'
              label='Household Assets'
              placeholder='Enter Amount'
              validation={validateIncomeCurrency}
              isDirty={visited && visited['household_assets']}
            />
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group>
            <CurrencyField
              fieldName='confirmed_household_annual_income'
              label='Confirmed Annual Income'
              placeholder='Enter Amount'
              validation={validateIncomeCurrency}
              isDirty={visited && visited['confirmed_household_annual_income']}
            />
            <span className='form-note shift-up' id='household-annual-income'>
              Not Including % of Assets
            </span>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group>
            <CurrencyField
              fieldName='hh_total_income_with_assets_annual'
              label='Final Household Annual Income'
              placeholder='Enter Amount'
              validation={validateIncomeCurrency}
              isDirty={visited && visited['hh_total_income_with_assets_annual']}
            />
            <span
              className='form-note shift-up'
              id='final-household-annual-income'
            >
              Includes % of assets if applicable
            </span>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <PercentField
            id='ami_percentage'
            label='AMI Percentage'
            fieldName='ami_percentage'
            placeholder='Enter Percentage'
            validation={validate.isValidPercent(
              'Please enter a valid percent.'
            )}
            isDirty={visited && visited['ami_percentage']}
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            id='ami_chart_type'
            fieldName='ami_chart_type'
            label='AMI Chart Type'
            options={amiChartTypes}
            noPlaceholder={amiChartTypes.length <= 1}
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            id='ami_chart_year'
            fieldName='ami_chart_year'
            label='AMI Chart Year'
            options={amiChartYears}
            noPlaceholder={amiChartYears.length <= 1}
          />
        </FormGrid.Item>
      </FormGrid.Row>
    </>
  )
}

export default ConfirmedHouseholdIncome
