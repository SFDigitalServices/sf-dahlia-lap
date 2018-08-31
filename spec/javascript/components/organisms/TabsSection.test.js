import React from 'react'

import TabsSection from 'components/organisms/TabsSection'

describe('TabsMenu', () => {
  test('it should render correctly', () => {
    const items = [
      { title: 'Short Form Application', url: '/url1' },
      { title: 'Supplemental Information', url: '/url2' }
    ]

    const wrapper = mount(
      <TabsSection items={items} currentUrl={'/url1'} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
