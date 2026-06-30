import React from 'react'

import { render, screen } from '@testing-library/react'
import moment from 'moment'

import ApplicationDetailsContentCard, {
  GMTToPacificTime
} from 'components/applications/application_details/ApplicationDetailsContentCard'

describe('ApplicationDetailsContentCard', () => {
  beforeEach(() => {
    jest.spyOn(moment, 'utc').mockImplementation(() => ({
      tz: () => ({
        format: () => 'Feb 26, 2026 9:00 AM'
      })
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('returns null when GMTToPacificTime receives undefined', () => {
    expect(GMTToPacificTime(undefined)).toBeNull()
  })

  test('renders updated row and badge when latest data differs', () => {
    const application = {
      phone: '415-111-2222'
    }

    const latestDataCollection = {
      phone: '415-999-9999',
      phone_last_modified: '2026-02-26T17:00:00Z'
    }

    const fields = [{ field: 'phone', label: 'Phone' }]

    const { container } = render(
      <ApplicationDetailsContentCard
        dataCollection={application}
        title='Primary Applicant'
        fields={fields}
        latestDataCollection={latestDataCollection}
      />
    )

    expect(screen.getByText('updated')).toBeInTheDocument()
    expect(container.querySelector('.application-updated-row')).toBeInTheDocument()
    expect(screen.getByText('415-999-9999')).toBeInTheDocument()
    expect(screen.getByText(/\(previous\)/i)).toBeInTheDocument()
    expect(screen.getByText(/^Updated /)).toBeInTheDocument()
  })

  test('does not render updated badge when latest data matches', () => {
    const application = {
      phone: '415-111-2222'
    }

    const latestDataCollection = {
      phone: '415-111-2222',
      phone_last_modified: '2026-02-26T17:00:00Z'
    }

    const fields = [{ field: 'phone', label: 'Phone' }]

    render(
      <ApplicationDetailsContentCard
        dataCollection={application}
        title='Primary Applicant'
        fields={fields}
        latestDataCollection={latestDataCollection}
      />
    )

    expect(screen.queryByText('updated')).not.toBeInTheDocument()
  })

  test('formats true booleans and keeps false as default None', () => {
    const fields = [
      { field: 'flag_true', label: 'Flag True' },
      { field: 'flag_false', label: 'Flag False' }
    ]

    render(
      <ApplicationDetailsContentCard
        dataCollection={{ flag_true: true, flag_false: false }}
        title='Primary Applicant'
        fields={fields}
      />
    )

    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
  })

  test('handles null data collection without rendering field values', () => {
    const fields = [{ field: 'phone', label: 'Phone' }]

    render(
      <ApplicationDetailsContentCard
        dataCollection={null}
        title='Primary Applicant'
        fields={fields}
      />
    )

    expect(screen.getByText('Primary Applicant')).toBeInTheDocument()
    expect(screen.queryByText('Phone')).not.toBeInTheDocument()
  })
})
