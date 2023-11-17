import React from 'react'

import { render } from '@testing-library/react'

import ContentSection from 'components/molecules/ContentSection'

describe('ContentSection', () => {
  test('should render correctly', () => {
    const { asFragment } = render(
      <ContentSection title='main title' description='main desc'>
        <ContentSection.Sub title='sub title' description='sub desc'>
          content
        </ContentSection.Sub>
      </ContentSection>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
