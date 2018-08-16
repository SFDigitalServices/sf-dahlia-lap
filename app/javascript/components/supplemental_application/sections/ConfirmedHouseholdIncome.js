import React from 'react'
import { find, isNil } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import FormGroupTextValue from '~/components/atoms/FormGroupTextValue'
import { RadioGroup, Radio, Text } from 'react-form';
import { getAMIAction } from '~/components/supplemental_application/actions'


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

const getAMIPercent = ({chart, applicationValues, amis}) => {
  if (isNil(amis))
    return "Error: AMI unknown"
  console.log('Calculating the ami percent', chart, applicationValues, amis)

  let ami = find(amis, {'chartType': chart.name, 'year': chart.year, 'numOfHousehold': applicationValues.total_household_size})
  console.log(ami)
  let amiIncome = ami.amount
  if (isNil(applicationValues.annual_income))
    return "Enter HH Income"
  if (isNil(amiIncome))
    return "Error: AMI unknown"
  return applicationValues.annual_income / Number(amiIncome)
}



class ConfirmedHouseholdIncome extends React.Component {

  state = {
    amis: null,
    amiCharts: [{"name": 'HUD Unadjusted', 'year': 2018}]
  }

  componentDidMount() {
    console.log('ConfirmedHouseholdIncome did mount', this.props.formApi.values)
    // Display a calculated annual income if applicant only provided monthly income
    if (isNil(this.props.formApi.values.annual_income) && !isNil(this.props.formApi.values.monthly_income)) {
      let annualIncome = this.props.formApi.values.monthly_income * 12
      this.props.formApi.setValue('annual_income', annualIncome)
    }

    getAMIAction({chartType: this.state.amiCharts[0].name, chartYear: this.state.amiCharts[0].year}).then(response =>
      this.setState({amis: response})
    )
  }

  render() {
    const { formApi } = this.props

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
        {this.state.amiCharts.map((chart) =>
          <FormGrid.Item>
            <FormGroupTextValue label={chart.name}
                                id="ami-hud"
                                name="ami-hud"
                                describeId="ami-hud"
                                note="Based on Final Household Income"
                                value={getAMIPercent({applicationValues: formApi.values, chart: chart, amis: this.state.amis})}/>
          </FormGrid.Item>
        )}
      </FormGrid.Row>
      </React.Fragment>
    )
  }
}

export default ConfirmedHouseholdIncome
