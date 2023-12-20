import React from 'react'

import { render } from '@testing-library/react'

import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'

import flaggedApplications from '../../../fixtures/flagged_applications'

describe('FlaggedApplicationsShowPage', () => {
  test('should render succesfully', () => {
    const { asFragment } = render(
      <FlaggedApplicationsShowPage flaggedApplications={flaggedApplications} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
