import React from 'react'
import renderer from 'react-test-renderer';

import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'
import modelsFactory from '../../../factories/models'

describe('FlaggedApplicationsShowPage', () => {
  test('should render succesfully', () => {
    const results = modelsFactory.applicationsList()
    const fields = modelsFactory.applicationFields()

    const wrapper = renderer.create(
      <FlaggedApplicationsShowPage
        results={results}
        fields={fields} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
