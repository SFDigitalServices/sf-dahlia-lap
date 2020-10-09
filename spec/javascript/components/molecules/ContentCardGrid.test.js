import React from 'react'
import { render } from 'enzyme'
import ContentCardGrid from '~/components/molecules/ContentCardGrid'

describe('ContentCardGrid', () => {
  test('it renders a content card grid with two content cards', () => {
    const wrapper = render(
      <ContentCardGrid
        title='Content card grid title'
        description='Content card grid description'
      />
    )
    expect(wrapper.find('.content-card')).toHaveLength(2)
  })
})
