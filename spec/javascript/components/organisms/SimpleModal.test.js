import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import SimpleModal from 'components/organisms/SimpleModal'

describe('SimpleModal', () => {
  const isOpen = true
  const onCloseClick = jest.fn()
  const onPrimaryClick = jest.fn()
  const onSecondaryClick = jest.fn()

  test('it should render default status type successfully', () => {
    const { asFragment } = render(
      <SimpleModal
        header='Update Status'
        primary='update'
        secondary='cancel'
        isOpen={isOpen}
        handleClose={onCloseClick}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
        type='status'
        alert={{
          title: "This change will affect this application's preferences",
          subtitle: 'This application would no longer be eligible for Live Work Preference',
          message:
            'Note, you will have the opportunity to grant another household member this preference',
          invert: false
        }}
      >
        <div>content</div>
      </SimpleModal>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  test('it should render alert type successfully', () => {
    const { asFragment } = render(
      <SimpleModal
        header='Update Status'
        primary='update'
        secondary='cancel'
        isOpen={isOpen}
        handleClose={onCloseClick}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
        type='alert'
        alert={{
          title: "This change will affect this application's preferences",
          subtitle: 'This application would no longer be eligible for Live Work Preference',
          message:
            'Note, you will have the opportunity to grant another household member this preference',
          invert: false
        }}
      >
        <div>content</div>
      </SimpleModal>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  test('it should call event handlers', () => {
    render(
      <SimpleModal
        header='Update Status'
        primary='update'
        secondary='cancel'
        isOpen={isOpen}
        handleClose={onCloseClick}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
        type='status'
      >
        <div>content</div>
      </SimpleModal>
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /update/i
      })
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /cancel/i
      })
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /close modal/i
      })
    )

    expect(onPrimaryClick.mock.calls).toHaveLength(1)
    expect(onSecondaryClick.mock.calls).toHaveLength(1)
    expect(onCloseClick.mock.calls).toHaveLength(1)
  })
})
