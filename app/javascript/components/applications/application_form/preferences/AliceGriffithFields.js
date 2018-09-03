import React from 'react'
import { map } from 'lodash'
import { buildFieldId } from './utils'
import { typeOfProofValues } from './values'
import Row from '~/components/atoms/Row'
import Column from '~/components/atoms/Column'
import { Field } from '~/utils/form/Field'

const buildTypeOfProofOptions = (values) => {
  return map(values, (option) => (
    { value: option, label: option }
  ))
}

const AddressRow = ({fieldId}) => (
  <React.Fragment>
    <Row form>
      <Column span={6} form>
        <Field.Text
          label='Alice Griffith Address'
          blockNote='(required)'
          field={fieldId('street')}
        />
      </Column>
    </Row>

    <Row form>
      <Column span={3} form>
        <Field.Text
          label='City'
          field={fieldId('city')}
        />
      </Column>
      <Column span={3} end form>
        <Row>
          <Column span={6}>
            <Field.Text
              label='State'
              field={fieldId('state')}
            />
          </Column>
          <Column span={6} end>
            <Field.Text
              label='Zip'
              field={fieldId('zip_code')}
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
          <Field.Select
            label='HH Member on Proof'
            blockNote='(required)'
            id='alice-griffith-hh-member-on-proof'
            field={fieldId('naturalKey')}
            options={householdMembers}
            value={fieldId('naturalKey')}
          />
        </Column>
        <Column span={3} form end>
          <Field.Select
            label='Type of Proof'
            blockNote='(required)'
            id='alice-griffith-type-of-proof'
            field={fieldId('type_of_proof')}
            options={typeOfProofOptions}
            value={fieldId('type_of_proof')}
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
