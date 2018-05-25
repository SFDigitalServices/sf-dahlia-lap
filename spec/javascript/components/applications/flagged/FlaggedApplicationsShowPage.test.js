import React from 'react'
import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'

import factory from '../../../factory'

describe('FlaggedApplicationsShowPage', () => {
  test('should render succesfully', () => {
    const results = factory.applicationsList()
    const fields = factory.applicationFields()

    const wrapper = mount(
      <FlaggedApplicationsShowPage
        results={results}
        fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
