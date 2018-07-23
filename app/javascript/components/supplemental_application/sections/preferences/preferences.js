import React from 'react'
import { Form, NestedForm, Text, Select, Checkbox } from 'react-form'

import { map } from 'lodash'
import formUtils from '~/utils/formUtils'
import FormGrid  from '~/components/molecules/FormGrid'
import { typeOfProofValues } from '~/components/applications/application_form/preferences/values.js'

const statusOptions = formUtils.toOptions(['Confirmed', 'Unconfirmed', 'Invalid'])

const individualPreferenceOptions = formUtils.toOptions(['Live in SF', 'Work in SF'])

const buildApplicationMembersOptions = (applicationMembers) => {
  return formUtils.toOptions(map(applicationMembers, (applicationMember) => {
    return [
      applicationMember.id,
      `${applicationMember.last_name}, ${applicationMember.first_name}`
    ]
  }))
}

const FormItem = ({label, children}) => (
  <FormGrid.Item>
    <FormGrid.Group label={label}>
      {children}
    </FormGrid.Group>
  </FormGrid.Item>
)

const Comment = ({children}) => (
  <p className='t-base c-steel'>
    {children}
  </p>
)

export const DefaultPanel = () => {
  return (<div></div>)
}

export const AssistedHousingPanel = ({ data, applicationMembers }) => {
  const applicationMembersOptions = buildApplicationMembersOptions(applicationMembers)

  return (
    <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          Assisted Housing Preference
        </div>
      </FormItem>
      <FormItem label="Name on Lease">
        <Select field='blabla' options={applicationMembersOptions}/>
      </FormItem>
      <FormItem label="Status">
        <Select field='blabla' options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <div className='form-group'>
        <div className="form-grid_item large-12 column  padding-bottom">
          <Comment>
            Do not give this preference unless applicant has provided a lease.
            If the person who lives in assisted housing is not the primary applicant,
            their address must have been provided at the time of the original application.
          </Comment>
          <div className="margin-bottom--2x">
            <Checkbox/>
            <label>
              Did applicant provide a lease showing this household member's name?
            </label>
          </div>
        </div>
      </div>
    </FormGrid.Row>
    </React.Fragment>
  )
}

export const RentBurdenedPanel = ({ data }) => (
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

export const LiveOrWorkInSanFranciscoPanel = ({ data, applicationMembers }) => {
  const applicationMembersOptions = buildApplicationMembersOptions(applicationMembers)
  const typeOfProofOptions = formUtils.toOptions(typeOfProofValues)
  return (
    <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          Live or Work in San Francisco
        </div>
      </FormItem>
      <FormItem label="Individual Preference Name">
        <Select field='individual_preference' options={individualPreferenceOptions}/>
      </FormItem>
      <FormItem label="HH Member on Proof">
        <Select field='naturalKey' options={applicationMembersOptions}/>
      </FormItem>
      <FormItem label="Type of Proof">
        <Select field='type_of_proof' options={typeOfProofOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <FormItem label="Status">
        <Select field='post_lottery_validation' options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <div className='form-group'>
        <div className="form-grid_item large-12 column  padding-bottom">
          <Comment>
            Please check to make sure that a document proving the preference address is provided.
            if no proof document is provided, do not select this preference.
          </Comment>
        </div>
      </div>
    </FormGrid.Row>
  </React.Fragment>)
}

export const NeighborhoodResidentHousingPanel = ({ data, applicationMembers }) => {
  const applicationMembersOptions = buildApplicationMembersOptions(applicationMembers)
  const typeOfProofOptions = formUtils.toOptions(typeOfProofValues)
  return (
    <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          Neighborhood Resident Housing Preference (NRHP)
        </div>
      </FormItem>
      <FormItem label="HH Member on Proof">
        <Select field='blabla' options={applicationMembersOptions}/>
      </FormItem>
      <FormItem label="Type of Proof">
        <Select field='blabla' options={typeOfProofOptions}/>
      </FormItem>
      <FormItem label="Status">
        <Select field='blabla' options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <div className='form-group'>
        <div className="form-grid_item large-12 column  padding-bottom">
          <Comment>
            Please check to make sure that a document proving the preference address is provided.
            if no proof document is provided, do not select this preference.
          </Comment>
          <Comment>
            if the HH member name on the proof is not the primary applicant,
            their residence address must have beein provided at time of the original application.
            MOHD will verify that their address qualifies for this preference.
          </Comment>
        </div>
      </div>
    </FormGrid.Row>
  </React.Fragment>)
}

export const AntiDisplacementHousingPanel = ({ data, applicationMembers }) => {
  const applicationMembersOptions = buildApplicationMembersOptions(applicationMembers)
  const typeOfProofOptions = formUtils.toOptions(typeOfProofValues)
  return (
    <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          Anti-Displacement Housing Preference
        </div>
      </FormItem>
      <FormItem label="HH Member on Proof">
        <Select field='blabla' options={applicationMembersOptions}/>
      </FormItem>
      <FormItem label="Type of Proof">
        <Select field='blabla' options={typeOfProofOptions}/>
      </FormItem>
      <FormItem label="Status">
        <Select field='blabla' options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <div className='form-group'>
        <div className="form-grid_item large-12 column  padding-bottom">
          <Comment>
            Please check to make sure that a document proving the preference address is provided.
            if no proof document is provided, do not select this preference.
          </Comment>
          <Comment>
            if the HH member name on the proof is not the primary applicant,
            their residence address must have beein provided at time of the original application.
            MOHD will verify that their address qualifies for this preference.
          </Comment>
        </div>
      </div>
    </FormGrid.Row>
  </React.Fragment>)
}
