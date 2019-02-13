import React from 'react'
import { find, isNil, isString } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import FormGroupTextValue from '~/components/atoms/FormGroupTextValue'
import { formatPercent } from '~/utils/utils'
import YesNoRadioGroup from '../YesNoRadioGroup'
import { Field } from '~/utils/form/Field'

const getAMI = ({numHousehold, chartName, chartYear, amis}) => {
  let ami = find(amis, {'chartType': chartName, 'year': chartYear, 'numOfHousehold': numHousehold})
  if (!isNil(ami)) {
    return ami.amount
  }
}

const getAMIPercent = ({income, ami}) => {
  if (!income) {
    return 'Enter HH Income'
  }
  let incomeFloat = isString(income) ? Number(income.replace(/[$,]+/g, '')) : income
  if (isNil(ami) || Number.isNaN(incomeFloat)) {
    return ''
  }
  return formatPercent(incomeFloat / Number(ami))
}

const ConfirmedHouseholdIncome = ({ amis, amiCharts, formApi }) => {
  const totalHouseholdSize = formApi.values.total_household_size
  const hhTotalIncomeWithAssetsAnnual = formApi.values.hh_total_income_with_assets_annual

  return (
    <React.Fragment>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group label='Recurring Voucher/Subsidy'>
            <YesNoRadioGroup field='housing_voucher_or_subsidy' />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group >
            <Field.Text field='household_assets'
              label='Household Assets'
              placeholder='Enter Amount'
              errorMessage={(label, error) => error}
            />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group >
            <Field.Text field='confirmed_household_annual_income'
              label='Confirmed Annual Income'
              placeholder='Enter Amount'
              errorMessage={(label, error) => error}
            />
            <span className='form-note shift-up' id='household-annual-income'>
              Not Including % of Assets
            </span>
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group>
            <Field.Text field='hh_total_income_with_assets_annual'
              label='Final Household Annual Income'
              placeholder='Enter Amount'
              errorMessage={(label, error) => error}
            />
            <span className='form-note shift-up' id='final-household-annual-income'>Includes % of assets if applicable</span>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        {amiCharts.map((chart) => {
          let ami = getAMI({numHousehold: totalHouseholdSize, chartName: chart.name, chartYear: chart.year, amis: amis})
          let id = `ami-${chart.name}`
          return (
            <FormGrid.Item key={chart.name + chart.year}>
              <FormGroupTextValue label={`Calculated % of AMI - ${chart.name}`}
                id={id}
                name={id}
                describeId={id}
                note='Based on Final Household Income'
                value={getAMIPercent({income: hhTotalIncomeWithAssetsAnnual, ami: ami})} />
            </FormGrid.Item>
          )
        }
        )}
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default ConfirmedHouseholdIncome
