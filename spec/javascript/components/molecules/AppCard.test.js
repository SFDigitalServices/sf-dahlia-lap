import React from 'react'

// import { shallow } from 'enzyme'
import { render, screen } from '@testing-library/react'

import AppCard from 'components/molecules/AppCard'

describe('AppCard', () => {
  test('it renders the correct children', () => {
    render(
      <AppCard>
        <div data-testid='test' />
      </AppCard>
    )
    expect(screen.getByTestId('test')).toBeInTheDocument()
  })
})
