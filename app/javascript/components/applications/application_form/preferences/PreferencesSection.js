import React, { useEffect } from 'react'
import { forEach, isEmpty } from 'lodash'
import PreferenceForm from './PreferenceForm'
import { naturalKeyFromPreference, getFullHousehold } from './utils'
import { FieldArray } from 'react-final-form-arrays'

const PreferencesSection = ({ form, editValues, listingPreferences }) => {
  const loadOnMount = () => {
    const autofillPreferences = []

    if (!isEmpty(editValues) && editValues.preferences) {
      forEach(editValues.preferences, (preference) => {
        if (!isEmpty(preference.application_member)) {
          const editPreference = preference
          editPreference.naturalKey = naturalKeyFromPreference(preference)
          autofillPreferences.push(editPreference)
        }
      })
      form.change('preferences', autofillPreferences)
    }
  }
  // With the empty array passed as the second argument
  // this useEffect call acts like a componentDidMount call
  useEffect(() => {
    loadOnMount()
  }, [])

  const allPreferencesSelected = () => {
    if (form.getState().values && !isEmpty(form.getState().values.preferences) && listingPreferences) {
      return form.getState().values.preferences.length === listingPreferences.length
    }
  }

  const hasHouseholdMembers = () => {
    const hasPrimaryApplicant = !isEmpty(form.getState().values) && !isEmpty(form.getState().values.applicant) && form.getState().values.applicant.first_name
    const hasHouseholdMembers = !isEmpty(form.getState().values) && !isEmpty(form.getState().values.household_members)
    return (hasHouseholdMembers || hasPrimaryApplicant)
  }

  const disableAddPreference = () => {
    return (allPreferencesSelected() || !hasHouseholdMembers())
  }

  return (
    <div className='border-bottom margin-bottom--2x'>
      <h3>Preferences</h3>
      <FieldArray name='preferences'>
        {({ fields }) =>
          <>
            { fields.map((name, i) => {
              return (
                <div className='border-bottom margin-bottom--2x' key={name}>
                  <PreferenceForm {...{ i, name, form, listingPreferences, fullHousehold: getFullHousehold(form.getState().values) }} />
                </div>)
            })
            }
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <button
                    onClick={() => form.mutators.push('preferences', {})}
                    disabled={disableAddPreference()}
                    type='button'
                    className='mb-4 mr-4 btn btn-success'
                    id='add-preference-button'>
                      + Add Preference
                  </button>
                </div>
              </div>
            </div>
          </>
        }
      </FieldArray>
    </div>
  )
}

export default PreferencesSection
