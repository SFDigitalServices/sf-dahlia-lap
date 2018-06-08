import React from 'react'
import { map } from 'lodash'
import { Select, Text } from 'react-form'

import { buildFieldId } from './utils'
import { typeOfProofValues } from './values'
import Row from '~/components/atoms/Row'
import Column from '~/components/atoms/Column'


const buildTypeOfProofOptions = (values) => {
  return map(values, (option) => (
    { value: option, label: option }
  ))
}

const AliceGriffithFields = ({i, householdMembers}) => {
  const typeOfProofOptions = buildTypeOfProofOptions(typeOfProofValues)
  const fieldId = (field) => buildFieldId(i, field)

  return (
    <React.Fragment>
    <Row>
      <Column span={3}>
        <label>HH Member on Proof</label>
        <Select
          field={fieldId('naturalKey')}
          options={householdMembers}
          value={fieldId('naturalKey')}
        />
      </Column>
      <Column span={3} end>
        <label>Type of Proof</label>
        <Select
          field={fieldId('preferenceProof')}
          options={typeOfProofOptions}
          value={fieldId('preferenceProof')}
        />
      </Column>
    </Row>
    <Row>
      <Column span={3}>
        <label>Alice Griffith Address</label>
        <Text field={fieldId('address')}/>
      </Column>
      <Column span={3} end>
        <label>Apt or Unit #</label>
        <Text/>
      </Column>
    </Row>
    <Row>
      <Column span={3}>
        <label>City</label>
        <Text field={fieldId('city')}/>
      </Column>
      <Column span={3}>
        <label>State</label>
        <Select field={fieldId('state')} options={[]}/>
      </Column>
      <Column span={3} end>
        <label>Zip</label>
        <Text field={fieldId('zipCode')}/>
      </Column>
    </Row>
    </React.Fragment>
  )
}

export default AliceGriffithFields
