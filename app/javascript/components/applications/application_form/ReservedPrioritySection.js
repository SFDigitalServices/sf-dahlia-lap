import React from 'react'
import { map, each, includes, keys, toPairs } from 'lodash'
import { NestedForm, Form, Checkbox, Select } from 'react-form'
import formOptions from './formOptions'

let {
  yes_no_options,
  adaPriorityValueToLabelMap
} = formOptions

const ReservedPrioritySection = ({editValues, listing}) => {
  let autofillValues = {}

  const adaPriorities = toPairs(adaPriorityValueToLabelMap)

  if (editValues && editValues.has_ada_priorities_selected) {
    let selected = keys(editValues.has_ada_priorities_selected)
    each(selected, value => autofillValues[value] = true )
  }

  let reservedTypes = map(listing.units, unit => unit.reserved_type)

  const developmentalDisabilityMarkup = () => {
    if (includes(reservedTypes, 'Developmental disabilities')) {
      return (
        <div className="small-6 columns">
          <label>Developmentally Disabled</label>
          <p className="form-note margin-bottom">One or more units is reserved for applicants who are developmentally disabled. Select "Yes" below if a household member is developmentally disabled.</p>
          <Select field="has_developmentaldisability" options={yes_no_options} />
        </div>
      )
    }
  }

  const militaryServiceMarkup = () => {
    if (includes(reservedTypes, 'Veteran')) {
      return (
        <div className="small-6 columns">
          <label>U.S. Military</label>
          <p className="form-note margin-bottom">One or more units is reserved for applicants who are U.S. Military. Select "Yes" below if a household member is U.S. Military.</p>
          <Select field="has_military_service" options={yes_no_options} />
        </div>
      )
    }
  }

  const reservedCommunityMarkup = () => {
    if (!!listing.reserved_community_type) {
      return (
        <div className="margin-bottom--2x small-12 columns">
          <h4>Qualifying Information for the Building Community Type</h4>
          <div className="margin-bottom--2x small-6 columns">
            <label>Meets Community Requirements</label>
            <p className="form-note margin-bottom">
              This building is a senior and/or veteran community. Select "Yes" below if the applicant or household qualifies for the community.
            </p>
            <Select field="answered_community_screening" options={yes_no_options} />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="border-bottom margin-bottom--2x">
      <div className="row">
        <div className="small-12 columns">
          <h3>Reserved and Priority Qualifying Information</h3>
          <h4>Qualifying Information For a Reserved Unit</h4>
        </div>
        {developmentalDisabilityMarkup()}
        {militaryServiceMarkup()}
        <div className="small-12 columns margin-bottom--2x">
          <NestedForm field="has_ada_priorities_selected">
            <Form defaultValues={autofillValues}>
              { formApi => (
                <div className="small-6 columns">
                  <label>ADA Priorities Selected</label>
                  <div className="checkbox-group" role="group">
                    { adaPriorities.map(([field, label], i ) => (
                      <div className="form-item" key={i} >
                        <div className="checkbox">
                          <Checkbox field={field} id={`adaPrioritiesSelected-${i}`} name="adaPrioritiesSelected" />
                          <label htmlFor={`adaPrioritiesSelected-${i}`}>{label}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form>
          </NestedForm>
        </div>
        {reservedCommunityMarkup()}
      </div>
    </div>
  )
}

export default ReservedPrioritySection
