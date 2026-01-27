import React from 'react'

import { render, screen, fireEvent, within } from '@testing-library/react'
import { useFlag as useFlagUnleash, useFlagsStatus, useVariant } from '@unleash/proxy-client-react'
import selectEvent from 'react-select-event'

import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { LEASE_UP_SUBSTATUS_OPTIONS, LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

jest.mock('@unleash/proxy-client-react')
useFlagUnleash.mockImplementation(() => true)
useFlagsStatus.mockImplementation(() => ({
  flagsError: false,
  flagsReady: true
}))
useVariant.mockImplementation(() => ({
  payload: {
    value: 'listingId'
  }
}))

// We need to import statusUtils with require so we can use jest.spyOn
const statusUtils = require('utils/statusUtils')
const ON_SUBMIT = jest.fn()
const ON_ALERT_CLOSE_CLICK = jest.fn()
const HEADER = 'Heading'

const getScreen = (propOverrides = {}) =>
  render(
    <StatusModalWrapper
      header={HEADER}
      onSubmit={ON_SUBMIT}
      onAlertCloseClick={ON_ALERT_CLOSE_CLICK}
      loading={false}
      submitButton='Update'
      statusOptions={LEASE_UP_STATUS_OPTIONS}
      substatusOptions={LEASE_UP_SUBSTATUS_OPTIONS}
      {...propOverrides}
    />
  )

describe('StatusModalWrapper', () => {
  test('should render the FormModal as closed if isOpen is false', () => {
    getScreen({ isOpen: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('when isBulkUpdate is true', () => {
    test('should display a subtitle if numApplicationsToUpdate=0', () => {
      getScreen({ isBulkUpdate: true, numApplicationsToUpdate: 0, isOpen: true })
      expect(screen.getByText('Update the status for 0 selected items')).toBeInTheDocument()
    })

    test('should display a subtitle if numApplicationsToUpdate=1', () => {
      getScreen({ isBulkUpdate: true, numApplicationsToUpdate: 1, isOpen: true })
      expect(screen.getByText('Update the status for 1 selected item')).toBeInTheDocument()
    })

    test('should display a subtitle if numApplicationsToUpdate=2', () => {
      getScreen({ isBulkUpdate: true, numApplicationsToUpdate: 2, isOpen: true })
      expect(screen.getByText('Update the status for 2 selected items')).toBeInTheDocument()
    })
  })

  describe('when isBulkUpdate is false', () => {
    test('should not display a subtitle if numApplicationsToUpdate=0', () => {
      getScreen({ isBulkUpdate: false, numApplicationsToUpdate: 0 })
      expect(screen.queryByText('Update the status for 0 selected items')).not.toBeInTheDocument()
    })

    test('should not display a subtitle if numApplicationsToUpdate=1', () => {
      getScreen({ isBulkUpdate: false, numApplicationsToUpdate: 1, isOpen: true })
      expect(screen.queryByText('Update the status for 1 selected item')).not.toBeInTheDocument()
    })

    test('should not display a subtitle if numApplicationsToUpdate=2', () => {
      getScreen({ isBulkUpdate: false, numApplicationsToUpdate: 2 })
      expect(screen.queryByText('Update the status for 2 selected items')).not.toBeInTheDocument()
    })
  })

  test('should display a subtitle if numApplicationsToUpdate == 1', () => {
    getScreen({ numApplicationsToUpdate: 1 })
    expect(screen.queryByText('Update the status for 1 selected item')).not.toBeInTheDocument()
  })

  test('should open a closeable alert modal when showAlert is true', () => {
    const alertMessage = 'test alert message'
    getScreen({ showAlert: true, alertMsg: alertMessage, isOpen: true })
    expect(screen.getByText(alertMessage)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0])
    expect(ON_ALERT_CLOSE_CLICK).toHaveBeenCalled()
  })

  test('should validate the form and call onSubmit function on submit', () => {
    const validateSpy = jest.spyOn(statusUtils, 'validateStatusForm')
    getScreen({ status: 'Lease Signed', isOpen: true })

    fireEvent.click(
      screen.getByRole('button', {
        name: /update/i
      })
    )
    expect(ON_SUBMIT).toHaveBeenCalled()
    expect(validateSpy).toHaveBeenCalled()
  })
  test('should display the status dropdown with the status provided', () => {
    getScreen({ status: 'Appealed', isOpen: true })

    expect(screen.getByText('Appealed')).toBeInTheDocument()
  })

  test('should display correct substatus options if substatuses are available', () => {
    getScreen({ status: 'Appealed', isOpen: true })
    selectEvent.openMenu(
      within(
        screen.getByRole('button', {
          name: /select one\.\.\./i
        })
      ).getByRole('combobox')
    )
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(
      LEASE_UP_SUBSTATUS_OPTIONS.Appealed.map((option) => option.label)
    )
  })

  test('should not require comment if status does not require comment', () => {
    getScreen({ status: 'Lease Signed', isOpen: true })

    fireEvent.click(
      screen.getByRole('button', {
        name: /update/i
      })
    )
    expect(screen.queryByTestId('field-error')).not.toBeInTheDocument()
    expect(ON_SUBMIT).toHaveBeenCalled()
  })

  describe('when required fields are missing', () => {
    test('should not show error state before fields are touched', () => {
      getScreen({ status: 'Appealed', isOpen: true })

      expect(screen.queryByTestId('field-error')).not.toBeInTheDocument()
    })

    test('should show error state for substatus and comment on submit if required', () => {
      getScreen({ status: 'Appealed', isOpen: true })
      fireEvent.click(
        screen.getByRole('button', {
          name: /update/i
        })
      )

      expect(screen.getAllByTestId('field-error')).toHaveLength(2)
      expect(screen.getByText(/please provide a comment\./i)).toBeInTheDocument()
      expect(screen.getByText(/please provide status details\./i)).toBeInTheDocument()

      expect(ON_SUBMIT).not.toHaveBeenCalled()
    })

    test('should stop showing error state and allow submission when required fields are filled out', () => {
      getScreen({ status: 'Appealed', isOpen: true })
      fireEvent.click(
        screen.getByRole('button', {
          name: /update/i
        })
      )

      // Verify there are errors initially
      expect(screen.getAllByTestId('field-error')).toHaveLength(2)
      expect(ON_SUBMIT).not.toHaveBeenCalled()
      selectEvent.openMenu(
        within(
          screen.getByRole('button', {
            name: /select one\.\.\./i
          })
        ).getByRole('combobox')
      )
      fireEvent.click(screen.getByText(/pending documentation from applicant to support request/i))

      // Fill out the fields and verify that the errors go away
      expect(screen.queryByText(/please provide status details\./i)).not.toBeInTheDocument()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Sample comment value' } })
      fireEvent.click(
        screen.getByRole('button', {
          name: /update/i
        })
      )
      expect(ON_SUBMIT).toHaveBeenCalled()
    })
  })
  describe('when isCommentModal is true', () => {
    test('should display a subtitle if numApplicationsToUpdate=1', () => {
      getScreen({
        isCommentModal: true,
        numApplicationsToUpdate: 1,
        isBulkUpdate: true,
        isOpen: true
      })
      expect(screen.getByText('Add a comment to 1 selected item')).toBeInTheDocument()
    })

    test('should hide status field', () => {
      getScreen({
        isCommentModal: true,
        numApplicationsToUpdate: 1,
        isBulkUpdate: true,
        isOpen: true
      })
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })
  })
})
