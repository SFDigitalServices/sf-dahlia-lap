import React from 'react'
import { Select, Text } from 'react-form'
import { get } from 'lodash'

import { buildFieldId } from './utils'
import { Field } from '~/utils/errors'

const CertOfPreferenceFields = ({ formApi, householdMembers, i }) => {
  const errors = get(formApi.errors,`shortFormPreferences[${i}]`)

  return (
    <div>
      <div>Errors: {JSON.stringify(errors)}</div>
      <div className="small-6 columns">
        <Field
          formApi={formApi}
          field={`shortFormPreferences.${i}.naturalKey`}
          label="Name of COP Holder"
        >
          {(field, classNames) => (
            <Select
              field={buildFieldId(i,'naturalKey')}
              options={householdMembers}
              value={buildFieldId(i,'naturalKey')}
            />
          )}
        </Field>
      </div>
      <div className="small-6 columns">
        <label>COP Certificate Number</label>
        <Text
          field={`shortFormPreferences.${i}.certificateNumber`}
        />
      </div>
      <div className="small-12 columns">
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default CertOfPreferenceFields
