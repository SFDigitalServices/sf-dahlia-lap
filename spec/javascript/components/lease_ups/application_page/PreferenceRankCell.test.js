import React from 'react'

import { shallow } from 'enzyme'

import { COLORS } from 'components/atoms/colors'
import StyledIcon from 'components/atoms/StyledIcon'
import PreferenceRankCell from 'components/lease_ups/application_page/PreferenceRankCell'
import {
  VALIDATION_CONFIRMED,
  VALIDATION_INVALID,
  VALIDATION_UNCONFIRMED
} from 'components/lease_ups/application_page/preferenceValidationUtils'

import { findWithProps } from '../../../testUtils/wrapperUtil'

const MOCK_PREF_RANK = 'NRHP 2'

describe('PreferenceRankCell', () => {
  describe('with Unconfirmed preference', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <PreferenceRankCell preferenceRank='NRHP 2' preferenceValidation={VALIDATION_UNCONFIRMED} />
      )
    })

    test('renders the preference rank', () => {
      expect(wrapper.text().includes(MOCK_PREF_RANK)).toBeTruthy()
    })

    test('does not render an icon', () => {
      expect(wrapper.find(StyledIcon)).toHaveLength(0)
    })

    test('renders cell with flex-start justification', () => {
      expect(wrapper.props().style.justifyContent).toEqual('flex-start')
    })
  })

  describe('with Confirmed preference', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <PreferenceRankCell preferenceRank='NRHP 2' preferenceValidation={VALIDATION_CONFIRMED} />
      )
    })

    test('renders the preference rank', () => {
      expect(wrapper.text().includes(MOCK_PREF_RANK)).toBeTruthy()
    })

    test('renders a check icon', () => {
      expect(wrapper.find(StyledIcon)).toHaveLength(1)
      expect(findWithProps(wrapper, StyledIcon, { icon: 'check' })).toHaveLength(1)
    })

    test('renders the check with a green color', () => {
      expect(findWithProps(wrapper, StyledIcon, { customFill: COLORS.success })).toHaveLength(1)
    })

    test('renders cell with space-between justification', () => {
      expect(wrapper.props().style.justifyContent).toEqual('space-between')
    })
  })

  describe('with Invalid preference', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <PreferenceRankCell preferenceRank='NRHP 2' preferenceValidation={VALIDATION_INVALID} />
      )
    })

    test('renders the preference rank', () => {
      expect(wrapper.text().includes(MOCK_PREF_RANK)).toBeTruthy()
    })

    test('renders a check icon', () => {
      expect(wrapper.find(StyledIcon)).toHaveLength(1)
      expect(findWithProps(wrapper, StyledIcon, { icon: 'close' })).toHaveLength(1)
    })

    test('renders the check with a green color', () => {
      expect(findWithProps(wrapper, StyledIcon, { customFill: COLORS.alert })).toHaveLength(1)
    })

    test('renders cell with space-between justification', () => {
      expect(wrapper.props().style.justifyContent).toEqual('space-between')
    })
  })
})
