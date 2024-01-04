import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import LeaveConfirmationModal from 'components/organisms/LeaveConfirmationModal'
import appPaths from 'utils/appPaths'

describe('LeaveConfirmationModal', () => {
  const isOpen = true
  const handleClose = jest.fn()
  const destination = appPaths.toApplication('asdf1234')

  test('it should render successfully', () => {
    const { asFragment } = render(
      <LeaveConfirmationModal isOpen={isOpen} handleClose={handleClose} destination={destination} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  test('it should close when the appropriate buttons are clicked', () => {
    render(
      <LeaveConfirmationModal isOpen={isOpen} handleClose={handleClose} destination={destination} />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /keep editing/i,
        hidden: true
      })
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /close modal/i,
        hidden: true
      })
    )

    expect(handleClose.mock.calls).toHaveLength(2)
  })
})
