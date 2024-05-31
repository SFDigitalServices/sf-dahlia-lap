import React from 'react'

import { render } from '@testing-library/react'

import LayeredPreferencePanel from 'components/supplemental_application/sections/preferences/LayeredPreferencePanel'

const preference = {
  person_who_claimed_name: 'John Doe',
  veteran_type_of_proof: 'DD Form 214',
  receives_preference: true,
  post_lottery_validation: 'Unconfirmed'
}

const preference_invalid = {
  person_who_claimed_name: 'John Doe',
  veteran_type_of_proof: 'DD Form 214',
  receives_preference: true,
  post_lottery_validation: 'Invalid'
}

describe('LayeredPreferencePanel', () => {
  test('should render successfully', () => {
    const { asFragment } = render(<LayeredPreferencePanel preference={preference} />)
    expect(asFragment()).toMatchSnapshot()
  })
  test('should handle when preference is invalid', () => {
    const { asFragment } = render(<LayeredPreferencePanel preference={preference_invalid} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
