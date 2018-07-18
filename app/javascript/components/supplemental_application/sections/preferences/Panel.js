import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'

import FormGrid  from '~/components/molecules/FormGrid'
import {
  RentBurdenedPreference,
  LiveOrWorkInSanFrancisco
} from './preferences'

const getPreferencePanel = (name) => {
  if (name.match('Rent Burdened'))
    return RentBurdenedPreference
  else if (name.match('in San Francisco'))
    return LiveOrWorkInSanFrancisco
  else
    return () => <div></div>
}

const Panel = ({ data, onClose }) => {
  const PreferencePanel = getPreferencePanel(data[1])
  return (
    <div className="app-editable expand-wide scrollable-table-nested">
      <PreferencePanel data={data}/>
      <FormGrid.Row expand={false}>
        <div className="form-grid_item column">
      		<button className="button primary tiny margin-right margin-bottom-none" type="button" data-event="">Save</button>
          <button className="button secondary tiny margin-bottom-none" type="button" data-event="" onClick={(e) => (onClose())}>Cancel</button>
      	</div>
      </FormGrid.Row>
    </div>
  )
}

export default Panel
