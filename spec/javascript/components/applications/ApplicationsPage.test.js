import React from 'react'
import renderer from 'react-test-renderer';

import ApplicationsPage from 'components/applications/ApplicationsPage'

describe('ApplicationsPage', () => {
  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <ApplicationsPage />,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })
})
