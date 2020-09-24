import React from 'react'
import renderer from 'react-test-renderer'

import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'
import flaggedApplications from '../../../fixtures/flagged_applications'

describe('FlaggedApplicationsShowPage', () => {
  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <FlaggedApplicationsShowPage flaggedApplications={flaggedApplications} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
