import React from 'react'
import { map, each, includes, keys, toPairs, isEmpty } from 'lodash'
import formOptions from './formOptions'
import { SelectField, CheckboxField } from 'utils/form/final_form/Field'

const { yesNoOptions, adaPriorityValueToLabelMap } = formOptions

const ReservedPrioritySection = ({ editValues, listing }) => {
  const autofillValues = {}

  const adaPriorities = toPairs(adaPriorityValueToLabelMap)

  if (!isEmpty(editValues) && editValues.has_ada_priorities_selected) {
    const selected = keys(editValues.has_ada_priorities_selected)
    each(selected, (value) => {
      autofillValues[value] = true
    })
  }

  const reservedTypes = map(listing.units, (unit) => unit.reserved_type)

  const developmentalDisabilityMarkup = () => {
    if (includes(reservedTypes, 'Developmental disabilities')) {
      return (
        <div className='small-6 columns'>
          <SelectField
            fieldName='has_ada_priorities_selected.has_developmental_disability'
            label='Developmentally Disabled'
            blockNote='One or more units is reserved for applicants who are developmentally disabled. Select "Yes" below if a household member is developmentally disabled.'
            options={yesNoOptions}
          />
        </div>
      )
    }
  }

  const militaryServiceMarkup = () => {
    if (includes(reservedTypes, 'Veteran')) {
      return (
        <div className='small-6 columns'>
          <SelectField
            fieldName='has_ada_priorities_selected.has_military_service'
            label='U.S. Military'
            blockNote='One or more units is reserved for applicants who are U.S. Military. Select "Yes" below if a household member is U.S. Military.'
            options={yesNoOptions}
          />
        </div>
      )
    }
  }

  const reservedCommunityMarkup = () => {
    if (listing.reserved_community_type) {
      return (
        <div className='margin-bottom--2x small-12 columns'>
          <h4>Qualifying Information for the Building Community Type</h4>
          <div className='margin-bottom--2x small-6 columns'>
            <SelectField
              fieldName='has_ada_priorities_selected.answered_community_screening'
              label='Meets Community Requirements'
              blockNote='This building is a senior and/or veteran community. Select "Yes" below if the applicant or household qualifies for the community.'
              options={yesNoOptions}
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <div className='small-12 columns'>
          <h3>Reserved and Priority Qualifying Information</h3>
          <h4>Qualifying Information For a Reserved Unit</h4>
        </div>
        {developmentalDisabilityMarkup()}
        {militaryServiceMarkup()}
        <div className='small-12 columns margin-bottom--2x'>
          <div className='small-6 columns'>
            <label>ADA Priorities Selected</label>
            <div className='checkbox-group' role='group'>
              {adaPriorities.map(([field, label], i) => (
                <div className='form-item' key={i}>
                  <div className='checkbox'>
                    <CheckboxField
                      fieldName={`has_ada_priorities_selected.${field}`}
                      // id={`adaPrioritiesSelected-${i}`}
                      label={label}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {reservedCommunityMarkup()}
      </div>
    </div>
  )
}

export default ReservedPrioritySection
