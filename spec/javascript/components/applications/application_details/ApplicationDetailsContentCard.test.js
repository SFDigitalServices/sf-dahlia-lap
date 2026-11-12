import React from 'react'

import { render, screen } from '@testing-library/react'
import moment from 'moment-timezone'

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

  test('formats unformatted phone numbers with hyphens', () => {
    render(
      <ApplicationDetailsContentCard
        dataCollection={{ phone: '4151112222' }}
        title='Primary Applicant'
        fields={['phone']}
      />
    )

    expect(screen.getByText('415-111-2222')).toBeInTheDocument()
  })

  test('does not render updated badge when phone numbers only differ in formatting', () => {
    render(
      <ApplicationDetailsContentCard
        dataCollection={{ phone: '4151112222' }}
        title='Primary Applicant'
        fields={[{ field: 'phone', label: 'Phone' }]}
        latestDataCollection={{
          phone: '415-111-2222',
          phone_last_modified: '2026-02-26T17:00:00Z'
        }}
      />
    )

    expect(screen.queryByText('updated')).not.toBeInTheDocument()
    expect(screen.getByText('415-111-2222')).toBeInTheDocument()
  })

  test('does not render updated badge on an unchanged unformatted phone when another field changes', () => {
    render(
      <ApplicationDetailsContentCard
        dataCollection={{ email: 'old@example.com', phone: '4155551234' }}
        title='Primary Applicant'
        fields={[
          { field: 'email', label: 'Email' },
          { field: 'phone', label: 'Phone' }
        ]}
        latestDataCollection={{
          email: 'new@example.com',
          email_last_modified: '2026-02-26T17:00:00Z',
          phone: '4155551234'
        }}
      />
    )

    expect(screen.getAllByText('updated')).toHaveLength(1)
    expect(screen.getByText('new@example.com')).toBeInTheDocument()
    expect(screen.getByText('415-555-1234')).toBeInTheDocument()
  })

  test('formats both values when an updated phone number is unformatted', () => {
    render(
      <ApplicationDetailsContentCard
        dataCollection={{ phone: '4151112222' }}
        title='Primary Applicant'
        fields={[{ field: 'phone', label: 'Phone' }]}
        latestDataCollection={{
          phone: '4159999999',
          phone_last_modified: '2026-02-26T17:00:00Z'
        }}
      />
    )

    expect(screen.getByText('updated')).toBeInTheDocument()
    expect(screen.getByText('415-999-9999')).toBeInTheDocument()
    expect(screen.getByText('415-111-2222')).toBeInTheDocument()
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
