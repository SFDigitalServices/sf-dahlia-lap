/* global mount */
import React from 'react'

import TabsMenu from 'components/molecules/TabsMenu'

describe('TabsMenu', () => {
  test('should render tab', () => {
    const items = [
      { title: 'Short Form Application', url: '/url1' },
      { title: 'Supplemental Information', url: '/url2' }
    ]

    const wrapper = mount(
      <TabsMenu items={items} currentUrl={'/url1'} />
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('li').at(0).hasClass('active')).toEqual(true)
    expect(wrapper.find('li').at(1).hasClass('active')).toEqual(false)
  })
})
