import React from 'react'
import { forEach, isEmpty } from 'lodash'
import PreferenceForm from './PreferenceForm'
import { naturalKeyFromPreference, getFullHousehold } from './utils'
import { FieldArray } from 'react-final-form-arrays'

const allPreferencesSelected = (form, listingPreferences) => {
  if (form.getState().values && !isEmpty(form.getState().values.preferences) && listingPreferences) {
    return form.getState().values.preferences.length === listingPreferences.length
  }
}

const hasHouseholdMembers = (form) => {
  let hasPrimaryApplicant = !isEmpty(form.getState().values) && !isEmpty(form.getState().values.applicant) && form.getState().values.applicant.first_name
  let hasHouseholdMembers = !isEmpty(form.getState().values) && !isEmpty(form.getState().values.household_members)
  return (hasHouseholdMembers || hasPrimaryApplicant)
}

const disableAddPreference = (form, listingPreferences) => {
  return (allPreferencesSelected(form, listingPreferences) || !hasHouseholdMembers(form))
}

class PreferencesSection extends React.Component {
  componentDidMount () {
    const { form, editValues } = this.props

    let autofillPreferences = []

    if (!isEmpty(editValues) && editValues.preferences) {
      forEach(editValues.preferences, (preference) => {
        if (!isEmpty(preference.application_member)) {
          let editPreference = preference
          editPreference['naturalKey'] = naturalKeyFromPreference(preference)
          autofillPreferences.push(editPreference)
        }
      })
      form.change('preferences', autofillPreferences)
    }
  }

  render () {
    const { form, listingPreferences } = this.props
    const fullHousehold = getFullHousehold(form.getState().values)

    return (
      <div className='border-bottom margin-bottom--2x'>
        <h3>Preferences</h3>
        <FieldArray name='preferences'>
          {({ fields }) =>
            <React.Fragment>
              { fields.map((name, index) => {
                return (
                  <div className='border-bottom margin-bottom--2x' key={name}>
                    <PreferenceForm {...{index, name, form, listingPreferences, fullHousehold}} />
                  </div>)
              })
              }
              <div className='row'>
                <div className='form-group'>
                  <div className='small-4 columns'>
                    <button
                      onClick={() => form.mutators.push('preferences', {})}
                      disabled={disableAddPreference(form, listingPreferences)}
                      type='button'
                      className='mb-4 mr-4 btn btn-success'
                      id='add-preference-button'>
                        + Add Preference
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
        </FieldArray>
      </div>
    )
  }
}

export default PreferencesSection
