import React, { useState } from 'react'

import { isNil, isString } from 'lodash'

import ContentSection from 'components/molecules/ContentSection'
import FormGrid from 'components/molecules/FormGrid'
import getAmiChartYears from 'utils/amiYearUtils'
import { useEffectOnMount } from 'utils/customHooks'
import {
  YesNoRadioGroup,
  CurrencyField,
  PercentField,
  SelectField
} from 'utils/form/final_form/Field.js'
import validate from 'utils/form/validations'
import formUtils from 'utils/formUtils'
import { formatPercent } from 'utils/utils'

const validateIncomeCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 15))('Please enter a smaller number.')(value)
  )
}

export const getAmiPercent = ({ income, ami }) => {
  if (!income) {
    return 'Enter HH Income'
  }
  if (isNil(ami)) {
    return 'Missing AMI Chart'
  }
  const incomeFloat = isString(income) ? Number(income.replace(/[$,]+/g, '')) : income
  if (Number.isNaN(incomeFloat)) {
    return 'Fix HH Income'
  }
  return formatPercent(incomeFloat / Number(ami))
}

const ConfirmedHouseholdIncome = ({ listingAmiCharts, visited }) => {
  const [amiChartTypes, setAmiChartTypes] = useState([])
  const [amiChartYears, setAmiChartYears] = useState([])

  useEffectOnMount(() => {
    const getAmiCharts = async () => {
      if (listingAmiCharts.length > 0) {
        setAmiChartYears(formUtils.toOptions(getAmiChartYears(listingAmiCharts)))
        setAmiChartTypes(formUtils.toOptions(listingAmiCharts.map((x) => x.ami_chart_type)))
      }
    }

    getAmiCharts()
  })

  return (
    <>
      <ContentSection.Sub title='Confirmed Household Income'>
        <FormGrid.Row>
          <FormGrid.Item>
            <FormGrid.Group label='Household claimed a recurring voucher or subsidy'>
              <YesNoRadioGroup fieldName='housing_voucher_or_subsidy' />
            </FormGrid.Group>
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              fieldName='imputed_income_from_assets'
              label='Imputed Income from Assets'
              validation={validateIncomeCurrency}
              isDirty={visited && visited.imputed_income_from_assets}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              fieldName='household_assets'
              label='Total Household Liquid Assets'
              validation={validateIncomeCurrency}
              isDirty={visited && visited.household_assets}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              fieldName='confirmed_household_annual_income'
              label='Total Household Annual Income'
              validation={validateIncomeCurrency}
              isDirty={visited && visited.confirmed_household_annual_income}
              helpText='Not including imputed income from assets'
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              fieldName='hh_total_income_with_assets_annual'
              label='Final Household Annual Income'
              validation={validateIncomeCurrency}
              isDirty={visited && visited.hh_total_income_with_assets_annual}
              helpText='Includes imputed income from assets, if applicable'
            />
          </FormGrid.Item>
        </FormGrid.Row>
      </ContentSection.Sub>
      <ContentSection.Sub title='Area Median Income'>
        <FormGrid.Row>
          <FormGrid.Item>
            <PercentField
              id='ami_percentage'
              label='Household AMI Percentage'
              fieldName='ami_percentage'
              validation={validate.isValidPercent('Please enter a valid percent.')}
              isDirty={visited && visited.ami_percentage}
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
      </ContentSection.Sub>
    </>
  )
}

export default ConfirmedHouseholdIncome
