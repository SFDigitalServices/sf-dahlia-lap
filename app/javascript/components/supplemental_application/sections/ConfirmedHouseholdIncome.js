import React from 'react'
import { find, isNil } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import FormGroupTextValue from '~/components/atoms/FormGroupTextValue'
import { RadioGroup, Radio, Text } from 'react-form';
import { formatPercent } from '~/utils/utils'

const YesNoRadioGroup = ({field}) => {
  return (
    <div className='radio-group-inline'>
      <RadioGroup field={field}>
        {(group) => (
          <React.Fragment>
            <p className="radio-inline">
              <Radio group={group} value={`true`} id={`${field}-yes`}/>
              <label className="radio-inline_label" htmlFor={`${field}-yes`}>Yes</label>
            </p>
            <p className="radio-inline">
              <Radio group={group} value={`false`} id={`${field}-no`}/>
              <label className="radio-inline_label" htmlFor={`${field}-no`}>No</label>
            </p>
          </React.Fragment>
        )}
      </RadioGroup>
    </div>
  )
}

const getAMI = ({numHousehold, chartName, chartYear, amis}) => {
  console.log(amis, numHousehold, chartName, chartYear)
  let ami = find(amis, {'chartType': chartName, 'year': chartYear, 'numOfHousehold': numHousehold})
  console.log(ami)
  if (!isNil(ami)) {
    return ami.amount
  }
}

const getAMIPercent = ({income, ami}) => {
  if (!income) {
    return "Enter HH Income"
  }
  if (isNil(ami)) {
    return "Error: AMI unknown"
  }
  return formatPercent(income / Number(ami))
}



class ConfirmedHouseholdIncome extends React.Component {

  // OPTIONS 2
  componentDidMount() {
    // Display a calculated annual income if applicant only provided monthly income
    const { monthly_income, annual_income } = this.props.formApi.values
    if (isNil(annual_income) && !isNil(monthly_income)) {
      let annualIncome = monthly_income * 12
      this.props.formApi.setValue('annual_income', annualIncome)
    }
  }

  render() {
    const { total_household_size, hh_total_income_with_assets_annual } = this.props.formApi.values
    const { amis, amiCharts } = this.props
    return (
      <React.Fragment>
      <FormGrid.Row>
        <FormGrid.Item>
          <FormGrid.Group label="Recurring Voucher/Subsidy">
            <YesNoRadioGroup field="housing_voucher_or_subsidy" />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label="Household Assets">
            <Text field="household_assets"
                  placeholder="Enter Amount"
            />
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label="Household Annual Income">
            <Text field="annual_income"
                  placeholder="Enter Amount"
            />
            <span className="form-note shift-up" id="household-annual-income">Not Including % of Assets</span>
          </FormGrid.Group>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGrid.Group label="Final Household Annual Income">
            <Text field="hh_total_income_with_assets_annual"
                  placeholder="Enter Amount"
            />
            <span className="form-note shift-up" id="final-household-annual-income">Includes % of assets if applicable</span>
          </FormGrid.Group>
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row paddingBottom>
        {amiCharts.map((chart) => {
          let ami = getAMI({numHousehold: total_household_size, chartName: chart.name, chartYear: chart.year, amis: amis})
          let id = `ami-${chart.name}`
          return (
            <FormGrid.Item key={chart.name + chart.year}>
            <FormGroupTextValue label={`Calculated % of AMI - ${chart.name}`}
                                id={id}
                                name={id}
                                describeId={id}
                                note="Based on Final Household Income"
                                value={getAMIPercent({income: hh_total_income_with_assets_annual, ami: ami})}/>
          </FormGrid.Item>
          )}
        )}
      </FormGrid.Row>
      </React.Fragment>
    )
  }
}

export default ConfirmedHouseholdIncome
