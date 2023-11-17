import React from 'react'

import { render, screen } from '@testing-library/react'

import ContentCardGrid from 'components/molecules/ContentCardGrid'

describe('ContentCardGrid', () => {
  test('it renders a content card grid with two content cards', () => {
    render(
      <ContentCardGrid
        title='Content card grid title'
        description='Content card grid description'
      />
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
