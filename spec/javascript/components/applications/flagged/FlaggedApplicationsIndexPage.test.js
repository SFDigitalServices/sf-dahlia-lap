import React from 'react'

import { render } from '@testing-library/react'

import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'

import flaggedRecords from '../../../fixtures/flagged_records'

describe('FlaggedApplicationsIndexPage', () => {
  test('should render successfully', () => {
    const title = 'Flagged Applications - Pending Review'

    const { asFragment } = render(
      <FlaggedApplicationsIndexPage title={title} type='pending' flaggedRecords={flaggedRecords} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
