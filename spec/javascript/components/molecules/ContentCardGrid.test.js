import React from 'react'

import { shallow } from 'enzyme'

import ContentCard from 'components/molecules/ContentCard'
import ContentCardGrid from 'components/molecules/ContentCardGrid'

describe('ContentCardGrid', () => {
  test('it renders a content card grid with two content cards', () => {
    const wrapper = shallow(
      <ContentCardGrid
        title='Content card grid title'
        description='Content card grid description'
      />
    )
    expect(wrapper.find(ContentCard)).toHaveLength(2)
  })
})
