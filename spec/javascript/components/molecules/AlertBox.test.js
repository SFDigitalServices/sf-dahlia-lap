import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import AlertBox from 'components/molecules/AlertBox'

describe('AlertBox', () => {
  const onCloseClick = jest.fn()

  beforeEach(() => {
    render(<AlertBox message='This is an alert box' onCloseClick={onCloseClick} />)
  })

  test('it renders an alert box with a message', () => {
    expect(screen.getByText('This is an alert box')).toBeInTheDocument()
  })

  test('it calls onCloseClick when the close button is clicked', () => {
    fireEvent.click(screen.getByRole('button'))
    expect(onCloseClick).toHaveBeenCalled()
  })
})
