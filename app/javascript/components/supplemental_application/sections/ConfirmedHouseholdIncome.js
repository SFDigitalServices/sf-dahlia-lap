import React, { useEffect, useState } from 'react'
import { find, kebabCase, isNil, isString, map } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import FormGroupTextValue from '~/components/atoms/FormGroupTextValue'
import { formatPercent } from '~/utils/utils'
import { YesNoRadioGroup, CurrencyField } from '~/utils/form/final_form/Field.js'
import validate from '~/utils/form/validations'
import { getAMIAction } from '~/components/supplemental_application/actions'

const validateIncomeCurrency = (value) => {
  return (
    validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
    validate.isUnderMaxValue(Math.pow(10, 15))('Please enter a smaller number.')(value)
  )
}

const getAmis = async (chartsToLoad, totalHouseholdSize) => {
  const promises = map(chartsToLoad, chart => getAMIAction({ chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year }))
  const amis = await Promise.all(promises)

  // Filter by household size and format
  return amis.map((amisForAllSizes) => {
    let ami = find(amisForAllSizes, {'numOfHousehold': totalHouseholdSize})
    if (!isNil(ami)) {
      return ({'name': ami.chartType, 'year': ami.chartYear, 'numHousehold': ami.numOfHousehold, 'amount': ami.amount})
    }
  })
}

const getAMIPercent = ({income, ami}) => {
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

const ConfirmedHouseholdIncome = ({ listingAmiCharts, form }) => {
  const totalHouseholdSize = form.getState().values.total_household_size
  const hhTotalIncomeWithAssetsAnnual = form.getState().values.hh_total_income_with_assets_annual

  const [ amiCharts, setAmiCharts ] = useState([])
  // This is the hooks version of componentDidMount.
  useEffect(() => {
    getAmis(listingAmiCharts, totalHouseholdSize).then(amis => setAmiCharts(amis))
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
            />
            <span className='form-note shift-up' id='final-household-annual-income'>Includes % of assets if applicable</span>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        {amiCharts.map((chart) => {
          let id = `ami-${kebabCase(chart.name)}`
          return (
            <FormGrid.Item key={chart.name + chart.year}>
              <FormGroupTextValue label={`Calculated % of AMI - ${chart.name}`}
                id={id}
                name={id}
                describeId={id}
                note='Based on Final Household Income'
                value={getAMIPercent({income: hhTotalIncomeWithAssetsAnnual, ami: chart.amount})} />
            </FormGrid.Item>
          )
        }
        )}
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default ConfirmedHouseholdIncome
