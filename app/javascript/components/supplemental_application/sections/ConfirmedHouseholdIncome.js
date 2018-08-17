import React from 'react'
import { find, isNil, uniqBy } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import FormGroupTextValue from '~/components/atoms/FormGroupTextValue'
import { RadioGroup, Radio, Text } from 'react-form';
import { getAMIAction } from '~/components/supplemental_application/actions'
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
  let ami = find(amis, {'chartType': chartName, 'year': chartYear, 'householdSize': numHousehold})

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

  state = {
    amis: {},
    amiCharts: []
  }

  componentDidMount() {
    // Display a calculated annual income if applicant only provided monthly income
    if (isNil(this.props.formApi.values.annual_income) && !isNil(this.props.formApi.values.monthly_income)) {
      let annualIncome = this.props.formApi.values.monthly_income * 12
      this.props.formApi.setValue('annual_income', annualIncome)
    }

    // Determine which unique AMI charts are associated with units on the listing
    let chartsToLoad = uniqBy(this.props.units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

    this.setState({'amiCharts': chartsToLoad.map((chart) => {
      return {"name": chart.ami_chart_type, "year": chart.ami_chart_year}}
      )
    })

    // Load the state with ami values for each chart associated with the listing.
    chartsToLoad.forEach( (chart) =>
      getAMIAction({chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year}).then(response => {
        this.setState({amis: [...this.state.amis, ...response]})
      }
    ))

  }

  render() {
    const { formApi } = this.props
    const { amis } = this.state
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
                  placeholder="$45,000"
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
        {this.state.amiCharts.map((chart) => {
          let ami = getAMI({numHousehold: formApi.values.total_household_size, chartName: chart.name, chartYear: chart.year, amis: amis})
          return (
            <FormGrid.Item key={chart.name + chart.year}>
            <FormGroupTextValue label={`Calculated % of AMI - ${chart.name}`}
                                id={`ami-${chart.name}`}
                                name={`ami-${chart.name}`}
                                describeId={`ami-${chart.name}`}
                                note="Based on Final Household Income"
                                value={getAMIPercent({income: formApi.values.hh_total_income_with_assets_annual, ami: ami})}/>
          </FormGrid.Item>
          )}
        )}
      </FormGrid.Row>
      </React.Fragment>
    )
  }
}

export default ConfirmedHouseholdIncome
