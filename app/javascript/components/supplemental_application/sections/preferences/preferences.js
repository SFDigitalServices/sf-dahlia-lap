import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'

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

export const RentBurdenedPreference = ({data}) => (
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

export const LiveOrWorkInSanFrancisco = ({data}) => (
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
