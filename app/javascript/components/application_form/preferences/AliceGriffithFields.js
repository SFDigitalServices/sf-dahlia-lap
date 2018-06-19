import React from 'react'
import { map } from 'lodash'
import { Select, Text } from 'react-form'

import { buildFieldId } from './utils'
import { typeOfProofValues } from './values'
import Row from '~/components/atoms/Row'
import Column from '~/components/atoms/Column'
import FormGroup from '~/components/atoms/FormGroup'

const buildTypeOfProofOptions = (values) => {
  return map(values, (option) => (
    { value: option, label: option }
  ))
}

const AddressRow = ({fieldId}) => (
  <React.Fragment>
    <Row form>
      <Column span={6} form>
        <FormGroup>
          <label htmlFor='alice-griffith-address'>Alice Griffith Address</label>
          <Text id='address' field={fieldId('address')}/>
        </FormGroup>
      </Column>
    </Row>

    <Row form>
      <Column span={3} form>
        <FormGroup>
          <label htmlFor='alice-griffith-city'>City</label>
          <Text id='city' field={fieldId('city')}/>
        </FormGroup>
      </Column>
      <Column span={3} end form>
        <Row>
          <Column span={6}>
            <FormGroup>
              <label htmlFor='alice-griffith-state'>State</label>
              <Text id='state' field={fieldId('state')} />
            </FormGroup>
          </Column>
          <Column span={6} end>
            <FormGroup>
              <label htmlFor='alice-griffith-zip-code'>Zip</label>
              <Text id='zipCode' field={fieldId('zipCode')}/>
            </FormGroup>
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
    <React.Fragment>
      <Row form>
        <Column span={3} form>
          <label htmlFor='alice-griffith-hh-member-on-proof'>HH Member on Proof</label>
          <Select
            id='hhMemberOnProof'
            field={fieldId('naturalKey')}
            options={householdMembers}
            value={fieldId('naturalKey')}
          />
        </Column>
        <Column span={3} form end>
          <label htmlFor='alice-griffith-type-of-proof'>Type of Proof</label>
          <Select
            id='typeOfProof'
            field={fieldId('preferenceProof')}
            options={typeOfProofOptions}
            value={fieldId('preferenceProof')}
          />
        </Column>
      </Row>
      <AddressRow fieldId={fieldId}/>
      <p>Please check to make sure that a document proving the preference address was attached to the application. If no proof document was attached, do not select this preference.</p>
						<p>MOHCD will verify that the applicant provided a valid address.</p>
    </React.Fragment>
  )
}

export default AliceGriffithFields
