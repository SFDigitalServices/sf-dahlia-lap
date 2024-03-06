import React from 'react'

import { render, screen } from '@testing-library/react'

import PreferenceRankCell, {
  VALIDATION_CONFIRMED,
  VALIDATION_INVALID,
  VALIDATION_UNCONFIRMED
} from 'components/lease_ups/application_page/PreferenceRankCell'

const MOCK_PREF_RANK = 'NRHP 2'

describe('PreferenceRankCell', () => {
  describe('with Unconfirmed preference', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <PreferenceRankCell
          preferenceRank={MOCK_PREF_RANK}
          preferenceValidation={VALIDATION_UNCONFIRMED}
        />
      )
    })

    test('renders the preference rank', () => {
      expect(screen.getByText(MOCK_PREF_RANK)).toBeInTheDocument()
    })

    test('does not render an icon', () => {
      expect(screen.queryByTestId('preference-rank-x-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('preference-rank-check-icon')).not.toBeInTheDocument()
    })

    test('renders cell with flex-start justification', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('with Confirmed preference', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <PreferenceRankCell
          preferenceRank={MOCK_PREF_RANK}
          preferenceValidation={VALIDATION_CONFIRMED}
        />
      )
    })

    test('renders the preference rank', () => {
      expect(screen.getByText(MOCK_PREF_RANK)).toBeInTheDocument()
    })

    test('renders a check icon', () => {
      expect(screen.getByTestId('preference-rank-check-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('preference-rank-x-icon')).not.toBeInTheDocument()
    })

    test('renders with the correct styling', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })

  describe('with Invalid preference', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = render(
        <PreferenceRankCell
          preferenceRank={MOCK_PREF_RANK}
          preferenceValidation={VALIDATION_INVALID}
        />
      )
    })

    test('renders the preference rank', () => {
      expect(screen.getByText(MOCK_PREF_RANK)).toBeInTheDocument()
    })

    test('renders a check icon', () => {
      expect(screen.queryByTestId('preference-rank-check-icon')).not.toBeInTheDocument()
      expect(screen.getByTestId('preference-rank-x-icon')).toBeInTheDocument()
    })

    test('renders with the correct styling', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })
  })
})
