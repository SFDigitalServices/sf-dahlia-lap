import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import { find, last, defaultTo } from 'lodash'

import FormGrid  from '~/components/molecules/FormGrid'
import {
  RentBurdenedPanel,
  LiveOrWorkInSanFranciscoPanel,
  AssistedHousingPanel,
  NeighborhoodResidentHousingPanel,
  AntiDisplacementHousingPanel,
  DefaultPanel
} from './preferences'

const namePanelsMap = [
  ['Rent Burdened', RentBurdenedPanel],
  ['Assisted Housing', AssistedHousingPanel],
  ['in San Francisco', LiveOrWorkInSanFranciscoPanel],
  ['NRHP', NeighborhoodResidentHousingPanel],
  ['ADHP', AntiDisplacementHousingPanel]
]

const getPreferencePanel = (name) => {
  const panel = last(find(namePanelsMap, ([n, p]) => name && name.match(n) ))
  return defaultTo(panel, DefaultPanel)
}

const Panel = ({ preference, row, applicationMembers, onClose }) => {
  const PreferencePanel = getPreferencePanel(row[1])
  return (
    <div className="app-editable expand-wide scrollable-table-nested">
        <Form onSubmit={() => console.log('submitted')}>
          { formApi => (
              <React.Fragment>
              <PreferencePanel preference={preference} applicationMembers={applicationMembers}/>
              <FormGrid.Row expand={false}>
                <div className="form-grid_item column">
              		<button className="button primary tiny margin-right margin-bottom-none" type="button" onClick={formApi.submitForm}>Save</button>
                  <button className="button secondary tiny margin-bottom-none" type="button" onClick={onClose}>Cancel</button>
              	</div>
              </FormGrid.Row>
              </React.Fragment>
            )
          }
        </Form>
    </div>
  )
}

export default Panel
