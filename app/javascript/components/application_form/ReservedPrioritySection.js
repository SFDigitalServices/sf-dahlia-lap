import React from 'react'
import { NestedForm, Form, Checkbox, Select } from 'react-form'
import formOptions from './formOptions'

let {
  yes_no_options,
  priority_options,
} = formOptions

const ReservedPrioritySection = ({editValues, listing}) => {
  let autofillValues = {}

  if (editValues && editValues.Has_ADA_Priorities_Selected) {
    let selected = editValues.Has_ADA_Priorities_Selected.split(";")
    _.each(selected, (value) => {
      autofillValues[value] = true
    })
  }

  let reservedTypes = _.map(listing.Units, (unit) => {
    return unit.Reserved_Type
  })

  const developmentalDisabilityMarkup = () => {
    if (_.includes(reservedTypes, 'Developmental disabilities')) {
      return (
        <div className="small-6 columns">
          <label>Developmentally Disabled</label>
          <p className="form-note margin-bottom">One or more units is reserved for applicants who are developmentally disabled. Select "Yes" below if a household member is developmentally disabled.</p>
          <Select field="hasDevelopmentalDisability" options={yes_no_options} />
        </div>
      )
    }
  }

  const militaryServiceMarkup = () => {
    if (_.includes(reservedTypes, 'Veteran')) {
      return (
        <div className="small-6 columns">
          <label>U.S. Military</label>
          <p className="form-note margin-bottom">One or more units is reserved for applicants who are U.S. Military. Select "Yes" below if a household member is U.S. Military.</p>
          <Select field="hasMilitaryService" options={yes_no_options} />
        </div>
      )
    }
  }

  const reservedCommunityMarkup = () => {
    if (_.includes(reservedTypes, 'Senior')) {
      return (
        <div className="margin-bottom--2x small-12 columns">
          <h4>Qualifying Information for the Building Community Type</h4>
          <div className="margin-bottom--2x small-6 columns">
            <label>Meets Community Requirements</label>
            <p className="form-note margin-bottom">This building is a senior and/or veteran community. Select "Yes" below if the applicant or household qualifies for the community.</p>
            <Select field="answeredCommunityScreening" options={yes_no_options} />
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
          <NestedForm field="adaPrioritiesSelected">
            <Form defaultValues={autofillValues}>
              { formApi => (
                <div className="small-6 columns">
                  <label>ADA Priorities Selected</label>
                  <div className="checkbox-group" role="group">
                    { priority_options.map( ( option, i ) => (
                      <div className="form-item" key={i} >
                        <div className="checkbox">
                          <Checkbox field={option} id={`adaPrioritiesSelected-${i}`} name="adaPrioritiesSelected" />
                          <label htmlFor={`adaPrioritiesSelected-${i}`}>{option}</label>
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
