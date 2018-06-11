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
      <Column span={3} form>
        <FormGroup>
          <label>Alice Griffith Address</label>
          <Text field={fieldId('address')}/>
        </FormGroup>
      </Column>
      <Column span={3} form end>
        <FormGroup>
          <label>Apt or Unit #</label>
          <Text/>
        </FormGroup>
      </Column>
    </Row>

    <Row form>
      <Column span={3} form>
        <FormGroup>
          <label>City</label>
          <Text field={fieldId('city')}/>
        </FormGroup>
      </Column>
      <Column span={3} end form>
        <Row>
          <Column span={6}>
            <FormGroup>
              <label>State</label>
              <Text field={fieldId('state')} />
            </FormGroup>
          </Column>
          <Column span={6} end>
            <FormGroup>
              <label>Zip</label>
              <Text field={fieldId('zipCode')}/>
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
        <label>HH Member on Proof</label>
        <Select
          field={fieldId('naturalKey')}
          options={householdMembers}
          value={fieldId('naturalKey')}
        />
      </Column>
      <Column span={3} form end>
        <label>Type of Proof</label>
        <Select
          field={fieldId('preferenceProof')}
          options={typeOfProofOptions}
          value={fieldId('preferenceProof')}
        />
      </Column>
    </Row>
    <AddressRow fieldId={fieldId}/>

    </React.Fragment>
  )
}

export default AliceGriffithFields
