import React from 'react'
import { shallow } from 'enzyme'
import ContentCard from '~/components/molecules/ContentCard'

describe('ContentCard', () => {
  test('it renders a content card with title and description', () => {
    const wrapper = shallow(
      <ContentCard title='Content card title' description='Content card description' />
    )
    expect(wrapper.find('.content-card a').text()).toEqual('Content card title')
    expect(wrapper.find('.content-card p').text()).toEqual('Content card description')
  })
})
