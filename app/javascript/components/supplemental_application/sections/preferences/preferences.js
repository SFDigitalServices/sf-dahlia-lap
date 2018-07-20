import React from 'react'
import { Form, NestedForm, Text, Select, Checkbox } from 'react-form'

import formUtils from '~/utils/formUtils'
import FormGrid  from '~/components/molecules/FormGrid'

const statusOptions = formUtils.toOptions(['Confirmed', 'Unconfirmed', 'Invalid'])

const FormItem = ({label, children}) => (
  <FormGrid.Item>
    <FormGrid.Group label={label}>
      {children}
    </FormGrid.Group>
  </FormGrid.Item>
)

export const DefaultPanel = () => {
  return (<div></div>)
}

export const AssistedHousingPanel = ({data}) => (
  <React.Fragment>
  <FormGrid.Row expand={false}>
    <FormItem label="Preference Name">
      <div className="text-value">
        Assisted Housing Preference
      </div>
    </FormItem>
    <FormItem label="Total Household Monthly Rent">
      <Text field='blabla'/>
    </FormItem>
    <FormItem label="Status">
      <Select field='blabla' options={statusOptions}/>
    </FormItem>
  </FormGrid.Row>
  <FormGrid.Row expand={false}>
    <div className="form-grid_item large-12 column">
      Do not give this preference unless applicant has provided a lease.
      If the person who lives in assisted housing is not the primary applicant,
      their address must have been provided at the time of the original application.
    </div>
    <Checkbox/>    
    <label>
      Did applicant provide a lease showing this household member's name?
    </label>
  </FormGrid.Row>
  </React.Fragment>
)

export const RentBurdenedPanel = ({data}) => (
  <FormGrid.Row expand={false}>
    <FormItem label="Preference Name">
      <div className="text-value">
        Rent Burdened Housing Preference
      </div>
    </FormItem>
    <FormItem label="Total Household Monthly Rent">
      <Text field='blabla'/>
    </FormItem>
    <FormItem label="Status">
      <Select field='blabla' options={statusOptions}/>
    </FormItem>
  </FormGrid.Row>
)

export const LiveOrWorkInSanFranciscoPanel = ({data}) => (
  <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          Live or Work in San Francisco
        </div>
      </FormItem>
      <FormItem label="Total Household Monthly Rent">
        <Select field='blabla' options={statusOptions}/>
      </FormItem>
      <FormItem label="Status">
        <Text field='blabla'/>
      </FormItem>
      <FormItem label="Status">
        <Select field='blabla' options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <FormItem label="Status">
        <Select field='blabla' options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
  </React.Fragment>
)
