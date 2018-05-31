import React from 'react'
import renderer from 'react-test-renderer';

import ApplicationsPage from 'components/applications/ApplicationsPage'

describe('ApplicationsPage', () => {
  test('should render succesfully', () => {
    const applications = []
    const fields = {}

    const wrapper = renderer.create(
      <ApplicationsPage applications={applications} fields={fields} />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
