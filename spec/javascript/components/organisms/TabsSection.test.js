import React from 'react'

import { render } from '@testing-library/react'

import TabsSection from 'components/organisms/TabsSection'

describe('TabsMenu', () => {
  test('it should render correctly', () => {
    const items = [
      { title: 'Short Form Application', url: '/url1' },
      { title: 'Supplemental Information', url: '/url2', active: true }
    ]

    const { asFragment } = render(<TabsSection items={items} currentUrl={'/url1'} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
