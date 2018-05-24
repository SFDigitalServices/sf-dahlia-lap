import React from 'react'
import ApplicationsPage from 'components/applications/ApplicationsPage'

describe('ApplicationsPage', () => {
  test('should render succesfully', () => {
    const applications = []
    const fields = {}

    const wrapper = mount(
      <ApplicationsPage applications={applications} fields={fields} />,
    )

    expect(wrapper).toMatchSnapshot();
  })
})
