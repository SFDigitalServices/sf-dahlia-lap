import React from 'react'

import { render, screen } from '@testing-library/react'

import ContentCard from 'components/molecules/ContentCard'

describe('ContentCard', () => {
  test('it renders a content card with title and description', () => {
    render(<ContentCard title='Content card title' description='Content card description' />)
    expect(screen.getByText('Content card title')).toBeInTheDocument()
    expect(screen.getByText('Content card description')).toBeInTheDocument()
  })
})
