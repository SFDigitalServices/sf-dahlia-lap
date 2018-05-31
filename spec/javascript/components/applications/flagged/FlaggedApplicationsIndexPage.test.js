import React from 'react'
import renderer from 'react-test-renderer';

import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'
import modelsFactory from '../../../factories/models'

describe('FlaggedApplicationsIndexPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.applicationsList()
    const fields = modelsFactory.applicationFields()
    const title = 'Flagged Applications - Pending Review'

    const wrapper = renderer.create(
      <FlaggedApplicationsIndexPage
        title={title}
        results={results}
        fields={fields} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
