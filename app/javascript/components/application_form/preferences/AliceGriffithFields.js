import React from 'react'
import { Select, Text } from 'react-form'

const AliceGriffithFields = ({i}) => {
  const householdMembers = []
  return (
    <React.Fragment>
    <div className='row'>
      <div className="small-3 columns">
        <label>Preference Name</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
          value={`shortFormPreferences.${i}.naturalKey`}
        />
      </div>
      <div className="small-3 columns">
        <label>HH Member on Proof</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
          value={`shortFormPreferences.${i}.naturalKey`}
        />
      </div>
      <div className="small-3 columns end">
        <label>Type of Proof</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
          value={`shortFormPreferences.${i}.naturalKey`}
        />
      </div>
    </div>
    <div className='row'>
      <div className="small-3 columns">
        <label>Alice Griffith Address</label>
        <Text/>
      </div>
      <div className="small-3 columns end">
        <label>Apt or Unit #</label>
        <Text/>
      </div>
    </div>
    <div className='row'>
      <div className="small-3 columns">
        <label>City</label>
        <Text/>
      </div>
      <div className="small-3 columns">
        <label>State</label>
        <Text/>
      </div>
      <div className="small-3 columns end">
        <label>Zip</label>
        <Text/>
      </div>
    </div>
    </React.Fragment>
  )
}

export default AliceGriffithFields
