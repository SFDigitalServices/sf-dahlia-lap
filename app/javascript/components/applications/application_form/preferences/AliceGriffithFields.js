import React from 'react'
import { map } from 'lodash'
import { buildFieldId } from './utils'
import { typeOfProofValues } from './values'
import Row from '~/components/atoms/Row'
import Column from '~/components/atoms/Column'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import validate from '~/utils/form/validations'

const buildTypeOfProofOptions = (values) => {
  return map(values, (option) => (
    { value: option, label: option }
  ))
}

const AddressRow = ({fieldId}) => (
  <React.Fragment>
    <Row form>
      <Column span={6} form>
        <FieldWrapper
          label='Alice Griffith Address'
          blockNote='(required)'
          fieldName={fieldId('street')}
          maxLength={maxLengthMap['address']}
          validation={validate.isPresent('Street is required')}
        />
      </Column>
    </Row>

    <Row form>
      <Column span={3} form>
        <FieldWrapper
          label='City'
          fieldName={fieldId('city')}
          maxLength={maxLengthMap['city']}
          validation={validate.isPresent('City is required')}
        />
      </Column>
      <Column span={3} end form>
        <Row>
          <Column span={6}>
            <FieldWrapper
              label='State'
              fieldName={fieldId('state')}
              maxLength={maxLengthMap['state']}
              validation={validate.isPresent('State is required')}
            />
          </Column>
          <Column span={6} end>
            <FieldWrapper
              label='Zip'
              fieldName={fieldId('zip_code')}
              maxLength={maxLengthMap['zip']}
              validation={validate.isPresent('Zip is required')}
            />
          </Column>
        </Row>
      </Column>
    </Row>
  </React.Fragment>
)

const AliceGriffithFields = ({i, householdMembers}) => {
  const typeOfProofOptions = buildTypeOfProofOptions(typeOfProofValues)
  const fieldId = (field) => buildFieldId(i, field)

  return (
    <Column>
      <Row form>
        <Column span={3} form>
          <SelectField
            label='HH Member on Proof'
            blockNote='(required)'
            id='alice-griffith-hh-member-on-proof'
            fieldName={fieldId('naturalKey')}
            options={householdMembers}
            value={fieldId('naturalKey')}
            validation={validate.isPresent('HH Member on Proof is required')}
          />
        </Column>
        <Column span={3} form end>
          <SelectField
            label='Type of Proof'
            blockNote='(required)'
            id='alice-griffith-type-of-proof'
            fieldName={fieldId('type_of_proof')}
            options={typeOfProofOptions}
            value={fieldId('type_of_proof')}
            validation={validate.isPresent('Type of Proof is required')}
          />
        </Column>
      </Row>
      <AddressRow fieldId={fieldId} />
      <p>Please check to make sure that a document proving the preference address was attached to the application. If no proof document was attached, do not select this preference.</p>
      <p>MOHCD will verify that the applicant provided a valid address.</p>
    </Column>
  )
}

export default AliceGriffithFields
