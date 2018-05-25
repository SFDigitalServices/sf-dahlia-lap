import React from 'react'
import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'

import factory from '../../../factory'

describe('FlaggedApplicationsIndexPage', () => {
  test('should render succesfully', () => {
    const results = factory.applicationsList()
    const fields = factory.applicationFields()

    const wrapper = mount(
      <FlaggedApplicationsIndexPage
        results={results}
        fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
