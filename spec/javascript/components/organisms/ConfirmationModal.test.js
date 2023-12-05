import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import ConfirmationModal from 'components/organisms/ConfirmationModal'

const PRIMARY_TEXT = 'Primary Text'
const SECONDARY_TEXT = 'Secondary Text'
const TITLE = 'Title'
const SUBTITLE = 'Subtitle'

const ON_CLOSE = jest.fn()
const ON_PRIMARY_CLICK = jest.fn()
const ON_SECONDARY_CLICK = jest.fn()

const getScreen = (propOverrides = {}) =>
  render(
    <ConfirmationModal
      onPrimaryClick={ON_PRIMARY_CLICK}
      onSecondaryClick={ON_SECONDARY_CLICK}
      onCloseClick={ON_CLOSE}
      primaryText={PRIMARY_TEXT}
      secondaryText={SECONDARY_TEXT}
      subtitle={SUBTITLE}
      title={TITLE}
      {...propOverrides}
    />
  )

describe('ConfirmationModal', () => {
  test('should render the modal as closed', () => {
    const { asFragment } = getScreen()
    expect(asFragment()).toMatchSnapshot()
  })

  describe('with default props', () => {
    beforeEach(() => {
      getScreen({ isOpen: true })
    })

    test('should render the title and subtitle', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument()
      expect(screen.getByText(SUBTITLE)).toBeInTheDocument()
    })

    test('should render with the default header id', () => {
      expect(screen.getByText(TITLE).parentNode).toHaveAttribute('id', 'confirmation-modal-header')
    })

    test('should render the primary button as a <button />', () => {
      expect(
        screen.getByRole('button', {
          name: PRIMARY_TEXT,
          hidden: true
        })
      ).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /primary text/i })).not.toBeInTheDocument()
    })

    test('should render the primary button with primary style', () => {
      expect(
        screen.getByRole('button', {
          name: PRIMARY_TEXT,
          hidden: true
        })
      ).toHaveClass('primary')
    })

    test('should render the secondary button', () => {
      expect(
        screen.getByRole('button', {
          name: SECONDARY_TEXT,
          hidden: true
        })
      ).toBeInTheDocument()
    })

    test('should trigger the onClose listener when close is clicked', () => {
      fireEvent.click(screen.getByLabelText('Close modal'))

      expect(ON_CLOSE.mock.calls).toHaveLength(1)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(0)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(0)
    })

    test('should trigger the onPrimaryClick listener when primary button is clicked', () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: PRIMARY_TEXT,
          hidden: true
        })
      )

      expect(ON_CLOSE.mock.calls).toHaveLength(0)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(1)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(0)
    })

    test('should trigger the onSecondaryClick listener when secondary button is clicked', () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: SECONDARY_TEXT,
          hidden: true
        })
      )

      expect(ON_CLOSE.mock.calls).toHaveLength(0)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(0)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(1)
    })
  })

  describe('with custom titleId', () => {
    const CUSTOM_TITLE_ID = 'custom-title-id'
    beforeEach(() => {
      getScreen({ titleId: CUSTOM_TITLE_ID, isOpen: true })
    })

    test('should render with the custom header id', () => {
      expect(screen.getByText(TITLE).parentNode).toHaveAttribute('id', CUSTOM_TITLE_ID)
    })
  })

  describe('when isOpen is true', () => {
    beforeEach(() => {
      getScreen({ isOpen: true })
    })

    test('should render the modal as open', () => {
      expect(screen.getByRole('dialog').firstChild).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('when primaryButtonIsAlert is true', () => {
    beforeEach(() => {
      getScreen({ primaryButtonIsAlert: true, isOpen: true })
    })

    test('should render the primary button with alert styling', () => {
      expect(screen.getByRole('button', { name: PRIMARY_TEXT, hidden: true })).toHaveClass('alert')
    })
  })

  describe('when primaryButtonDestination is provided', () => {
    const DESTINATION = '#'
    beforeEach(() => {
      getScreen({ primaryButtonDestination: DESTINATION, isOpen: true })
    })

    test('should render the primary button as an <a /> component', () => {
      expect(
        screen.queryByRole('button', {
          name: PRIMARY_TEXT,
          hidden: true
        })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: /primary text/i, hidden: true })
      ).toBeInTheDocument()
    })

    test('should render the primary button with the correct href', () => {
      expect(screen.queryByRole('link', { name: /primary text/i, hidden: true })).toHaveAttribute(
        'href',
        DESTINATION
      )
    })

    test('should trigger the onPrimaryClick listener when primary button is clicked', () => {
      fireEvent.click(screen.queryByRole('link', { name: /primary text/i, hidden: true }))
      // findWithText(wrapper, 'a', PRIMARY_TEXT).simulate('click')

      expect(ON_CLOSE.mock.calls).toHaveLength(0)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(1)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(0)
    })
  })
})
