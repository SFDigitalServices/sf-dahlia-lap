import React, { useEffect, useState } from 'react'
import { find, isNil, isString, map } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import { formatPercent } from '~/utils/utils'
import { YesNoRadioGroup, CurrencyField, InputField, SelectField } from '~/utils/form/final_form/Field.js'
import validate from '~/utils/form/validations'
import { getAMIAction } from '~/components/supplemental_application/actions'

const validateIncomeCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 15))('Please enter a smaller number.')(value)
  )
}

export const getAmis = async (chartsToLoad, totalHouseholdSize) => {
  const promises = map(chartsToLoad, chart => getAMIAction({ chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year }))
  const amis = await Promise.all(promises)

  // Filter by household size and format
  return amis.map((amisForAllSizes) => {
    let ami = find(amisForAllSizes, {'numOfHousehold': totalHouseholdSize})
    if (!isNil(ami)) {
      return ({'name': ami.chartType, 'year': ami.year, 'numHousehold': ami.numOfHousehold, 'amount': ami.amount})
    }
  })
}

export const getAmiPercent = ({income, ami}) => {
  if (!income) {
    return 'Enter HH Income'
  }
  if (isNil(ami)) {
    return 'Missing AMI Chart'
  }
  let incomeFloat = isString(income) ? Number(income.replace(/[$,]+/g, '')) : income
  if (Number.isNaN(incomeFloat)) {
    return 'Fix HH Income'
  }
  return formatPercent(incomeFloat / Number(ami))
}

const ConfirmedHouseholdIncome = ({ listingAmiCharts, form, visited }) => {
  const { values } = form.getState()
  const totalHouseholdSize = values.total_household_size

  const [ amiCharts, setAmiCharts ] = useState([])

  useEffect(() => {
    const getAmiCharts = async () => {
      let amis = await getAmis(listingAmiCharts, totalHouseholdSize)
      amis = amis.map((chart) => ({
        value: chart.amount,
        label: `${chart.name} ${chart.year}`
      }))
      if (amis.length > 1) {
        amis.unshift({ value: null, label: 'Select One...' })
      }
      setAmiCharts(amis)
    }

    getAmiCharts()
  }, [])

  return (
    <React.Fragment>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group label='Recurring Voucher/Subsidy'>
            <YesNoRadioGroup fieldName='housing_voucher_or_subsidy' />
          </FormGrid.Group>
        </FormGrid.Item>
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
        <FormGrid.Item>
          <FormGrid.Group>
            <CurrencyField
              fieldName='hh_total_income_with_assets_annual'
              label='Final Household Annual Income'
              placeholder='Enter Amount'
              validation={validateIncomeCurrency}
              isDirty={visited && visited['hh_total_income_with_assets_annual']}
            />
            <span className='form-note shift-up' id='final-household-annual-income'>Includes % of assets if applicable</span>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        <FormGrid.Item>
          <InputField
            id={'ami_value'}
            label='AMI'
            fieldName={'ami'} />
        </FormGrid.Item>
        <FormGrid.Item>
          <SelectField
            fieldName='ami_chart'
            label='AMI Charts'
            options={amiCharts} />
        </FormGrid.Item>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default ConfirmedHouseholdIncome
