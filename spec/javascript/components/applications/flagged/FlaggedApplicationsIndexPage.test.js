import React from 'react'
import renderer from 'react-test-renderer'

import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'
import flaggedRecords from '../../../fixtures/flagged_records'

describe('FlaggedApplicationsIndexPage', () => {
  test('should render successfully', () => {
    const title = 'Flagged Applications - Pending Review'

    const wrapper = renderer.create(
      <FlaggedApplicationsIndexPage
        title={title}
        type='pending'
        flaggedRecords={flaggedRecords} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
