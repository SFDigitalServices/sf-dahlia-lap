import React from 'react'
import renderer from 'react-test-renderer'
import ContentSection from 'components/molecules/ContentSection'

describe('ContentSection', () => {
  test('should render correctly', () => {
    const wrapper =  renderer.create(
      <ContentSection title='main title' description='main desc'>
        <ContentSection.Sub title='sub title' description='sub desc'>
            content
        </ContentSection.Sub>
      </ContentSection>
    )

    expect(wrapper).toMatchSnapshot();
  })
})
