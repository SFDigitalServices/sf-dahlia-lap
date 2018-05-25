import React from 'react'
import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'

import modelsFactory from '../../../factories/models'

describe('FlaggedApplicationsIndexPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.applicationsList()
    const fields = modelsFactory.applicationFields()

    const wrapper = mount(
      <FlaggedApplicationsIndexPage
        results={results}
        fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
