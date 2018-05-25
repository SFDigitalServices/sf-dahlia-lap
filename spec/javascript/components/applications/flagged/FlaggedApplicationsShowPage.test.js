import React from 'react'
import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'

import modelsFactory from '../../../factories/models'

describe('FlaggedApplicationsShowPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.applicationsList()
    const fields = modelsFactory.applicationFields()

    const wrapper = mount(
      <FlaggedApplicationsShowPage
        results={results}
        fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
