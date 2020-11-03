/* global shallow */
import React from 'react'

import RentBurdenedPanel from 'components/supplemental_application/sections/preferences/RentBurdenedPanel'

describe('RentBurdenedPanel', () => {
  test('should render successfully', () => {
    const wrapper = shallow(<RentBurdenedPanel preferenceIndex='1' />)

    expect(wrapper).toMatchSnapshot()
  })
})
