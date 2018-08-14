import React from 'react'
import { isNil } from 'lodash'

import FormGrid from '~/components/molecules/FormGrid'
import FormGroupTextValue from '~/components/atoms/FormGroupTextValue'
import { RadioGroup, Radio, Text } from 'react-form';

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

const getAMIPercent = (income, ami) => {
  console.log('Calculating the ami percent', income)
  if (isNil(income))
    return "Enter HH Income"
  if (isNil(ami))
    return "Error: AMI unknown"
  return income / ami
}



class ConfirmedHouseholdIncome extends React.Component {

  state = {
    hudAMI: null,
    stateAMI: null
  }

  componentDidMount() {
    // Display a calculated annual income if applicant only provided monthly income
    if (isNil(this.props.application.annual_income)) {
      let annualIncome = this.props.application.monthly_income * 12
      this.props.formApi.setValue('annual_income', annualIncome)
    }

    console.log('ConfirmedHouseholdIncome did mount')
    // Fetch initial AMI values based on household size.
    this.setState({hudAMI: 5})
    this.setState({stateAMI: 5})
  }

  componentDidUpdate() {
    // Check if household size has changed, if it has, re-fetch AMIs
    console.log('income component did update')
    console.log(this.props.formApi.values)
  }

  render() {
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
        <FormGrid.Item>
          <FormGroupTextValue label="Calculated % of AMI - HUD"
                              id="ami-hud"
                              name="ami-hud"
                              describeId="ami-hud"
                              note="Based on Final Household Income"
                              value={getAMIPercent(this.props.formApi.values.hh_total_income_with_assets_annual, this.state.hudAMI)}/>
        </FormGrid.Item>
        <FormGrid.Item>
          <FormGroupTextValue label="Calculated % of AMI - State"
                              id="ami-state"
                              name="ami-state"
                              describeId="ami-hud"
                              note="Based on Final Household Income"
                              value={getAMIPercent(this.props.formApi.values.hh_total_income_with_assets_annual, this.state.stateAMI)}/>
        </FormGrid.Item>
      </FormGrid.Row>
      </React.Fragment>
    )
  }
}

export default ConfirmedHouseholdIncome
