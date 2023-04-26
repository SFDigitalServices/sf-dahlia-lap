import React from 'react'

import { shallow } from 'enzyme'

import InlineModal from 'components/molecules/InlineModal'

describe('InlineModal', () => {
  test('should use the inline-modal class for background if background is not specified', () => {
    const wrapper = shallow(<InlineModal />)
    expect(wrapper).toMatchSnapshot()
  })

  test('should pass the white background prop if specified', () => {
    const wrapper = shallow(<InlineModal whiteBackground />)
    expect(wrapper).toMatchSnapshot()
  })
})
