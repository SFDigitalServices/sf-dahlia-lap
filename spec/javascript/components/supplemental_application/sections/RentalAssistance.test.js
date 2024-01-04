import React from 'react'

import { screen, within, fireEvent } from '@testing-library/react'

import RentalAssistance, {
  RentalAssistanceForm,
  RentalAssistanceTable
} from 'components/supplemental_application/sections/RentalAssistance'
import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'

import { withForm } from '../../../testUtils/wrapperUtil'

const withContext = ({ rentalAssistances = [], assistanceRowsOpened = new Set() } = {}) => ({
  application: { id: 'applicationid', rental_assistances: rentalAssistances },
  applicationMembers: [{ id: '123', first_name: 'Test', last_name: 'Tester' }],
  assistanceRowsOpened
})

const rentalAssistance = {
  type_of_assistance: 'Compass Family',
  recurring_assistance: 'Yes',
  assistance_amount: '100',
  recipient: '123'
}

describe('RentalAssistance', () => {
  const getRentalAssistanceWrapper = (context = withContext()) =>
    withForm(context.application, (form) => (
      <RentalAssistance
        form={form}
        disabled={false}
        loading={false}
        applicationMembers={context.applicationMembers}
        assistanceRowsOpened={context.assistanceRowsOpened}
        rentalAssistances={context.application.rental_assistances}
        applicationId={context.application.id}
      />
    ))

  describe('without rental assistances', () => {
    beforeEach(() => {
      getRentalAssistanceWrapper()
    })

    test('should not render a table', () => {
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    test('should render the Add Rental Assistance button', () => {
      expect(screen.getByRole('button', { name: 'Add Rental Assistance' })).toBeInTheDocument()
    })

    test('does not render the create new assistance form', () => {
      expect(screen.queryByTestId('rental-assistance-form')).not.toBeInTheDocument()
    })
  })

  describe('with rental assistances', () => {
    let rtlWrapper
    beforeEach(() => {
      rtlWrapper = getRentalAssistanceWrapper(
        withContext({ rentalAssistances: [rentalAssistance] })
      )
    })

    test('matches snapshot', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })

    test('should render a table', () => {
      // The table has role "grid"
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('should render the Add Rental Assistance button', () => {
      expect(screen.getByRole('button', { name: 'Add Rental Assistance' })).toBeInTheDocument()
    })

    test('does not render the create new assistance form', () => {
      // The Form is rendered, but it's parent hides it stylistically
      expect(screen.getByTestId('expandable-table-row-button')).toHaveAttribute(
        'aria-hidden',
        'true'
      )
      expect(
        within(screen.getByTestId('expandable-table-row-button')).getByTestId(
          'rental-assistance-form'
        )
      ).toBeInTheDocument()
    })
  })

  describe('when assistanceRowsOpened contains a new rental assistance id', () => {
    beforeEach(() => {
      getRentalAssistanceWrapper(
        withContext({ assistanceRowsOpened: new Set([NEW_ASSISTANCE_PSEUDO_ID]) })
      )
    })

    test('should render the new rental assistance form after the add rental assistance button is clicked', () => {
      expect(screen.getByTestId('rental-assistance-form')).toBeInTheDocument()
    })
  })
})

describe('RentalAssistanceTable', () => {
  const getTableWrapper = ({ disabled = false }) => {
    const context = withContext({ rentalAssistances: [rentalAssistance] })

    return withForm(context.application, (form) => (
      <RentalAssistanceTable
        form={form}
        rentalAssistances={[rentalAssistance]}
        applicationMembers={[]}
        assistanceRowsOpened={new Set()}
        disabled={disabled}
      />
    ))
  }

  describe('when not disabled', () => {
    beforeEach(() => {
      getTableWrapper({})
    })

    test('renders an expander button', () => {
      expect(
        screen.getByRole('button', {
          name: /edit/i
        })
      ).toBeInTheDocument()
    })

    test('should render an ExpanderTable', () => {
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
  })

  describe('when  disabled', () => {
    test('does not render any expander buttons', () => {
      getTableWrapper({ disabled: true })
      expect(
        screen.queryByRole('button', {
          name: /edit/i
        })
      ).not.toBeInTheDocument()
    })
  })
})

describe('RentalAssistanceForm', () => {
  const getFormScreen = ({
    assistance,
    isNew = false,
    onSave = () => {},
    onClose = () => {},
    onDelete = () => {},
    loading = false
  }) => {
    const context = withContext({ rentalAssistances: assistance ? [assistance] : [] })

    return withForm(context.application, (form) => (
      <RentalAssistanceForm
        values={assistance}
        index={0}
        applicationMembers={context.applicationMembers}
        form={form}
        isNew={isNew}
        onSave={onSave}
        onClose={onClose}
        onDelete={onDelete}
        loading={loading}
      />
    ))
  }

  test('should not show the Other Assistance Name input when Type of Assistance is not Other', () => {
    getFormScreen({ assistance: rentalAssistance })
    expect(screen.queryByTestId('Other Assistance Name')).not.toBeInTheDocument()
  })

  test('should show the Other Assistance Name when Type of Assistance is Other', () => {
    getFormScreen({
      assistance: {
        ...rentalAssistance,
        type_of_assistance: 'Other',
        other_assistance_name: 'Test Other Assistance Name'
      }
    })
    expect(screen.queryByTestId('Other Assistance Name')).not.toBeInTheDocument()
  })

  test('should validate that type of assistance is present upon save of the form panel', () => {
    getFormScreen({ assistance: null })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByText(/please select a type of assistance\./i)).toBeInTheDocument()
  })

  describe('when not loading', () => {
    let saveButton
    let cancelButton
    let deleteButton

    beforeEach(() => {
      getFormScreen({
        assistance: rentalAssistance,
        loading: false
      })

      saveButton = screen.getByRole('button', {
        name: /save/i
      })
      cancelButton = screen.getByRole('button', {
        name: /cancel/i
      })
      deleteButton = screen.getByRole('button', {
        name: /delete/i
      })
    })

    test('should not disable the action buttons', () => {
      expect(saveButton).toBeEnabled()
      expect(cancelButton).toBeEnabled()
      expect(deleteButton).toBeEnabled()
    })

    test('should update the save button to say Saving...', () => {
      expect(saveButton).toBeInTheDocument()
    })
  })

  describe('when loading', () => {
    let saveButton
    let cancelButton
    let deleteButton

    beforeEach(() => {
      getFormScreen({
        assistance: rentalAssistance,
        loading: true
      })

      saveButton = screen.getByRole('button', {
        name: /saving.../i
      })
      cancelButton = screen.getByRole('button', {
        name: /cancel/i
      })
      deleteButton = screen.getByRole('button', {
        name: /delete/i
      })
    })

    test('should disable the action buttons', () => {
      expect(saveButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
      expect(deleteButton).toBeDisabled()
    })

    test('should update the save button to say Saving...', () => {
      expect(saveButton).toBeInTheDocument()
    })
  })

  describe('when it is new', () => {
    let mockSaveCallback
    let mockCloseCallback
    let mockDeleteCallback
    let rtlWrapper

    beforeEach(() => {
      mockSaveCallback = jest.fn()
      mockCloseCallback = jest.fn()
      mockDeleteCallback = jest.fn()

      rtlWrapper = getFormScreen({
        assistance: rentalAssistance,
        isNew: true,
        onSave: mockSaveCallback,
        onClose: mockCloseCallback,
        onDelete: mockDeleteCallback
      })
    })

    test('matches snapshot', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })

    test('should render the correct modal ID', () => {
      expect(screen.getByTestId('rental-assistance-form')).toBeInTheDocument()
    })

    test('should not render the delete button', () => {
      expect(
        screen.queryByRole('button', {
          name: /delete/i
        })
      ).not.toBeInTheDocument()
    })

    test('should call the save callback when clicked', () => {
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /type of assistance/i
        }),
        {
          target: { value: 'Catholic Charities' }
        }
      )

      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
      expect(mockSaveCallback.mock.calls).toHaveLength(1)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })

    test('should call the cancel callback when clicked', () => {
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      fireEvent.click(
        screen.getByRole('button', {
          name: /cancel/i
        })
      )
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(1)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })
  })

  describe('when it already exists on salesforce', () => {
    let mockSaveCallback
    let mockCloseCallback
    let mockDeleteCallback
    let rtlWrapper

    beforeEach(() => {
      mockSaveCallback = jest.fn()
      mockCloseCallback = jest.fn()
      mockDeleteCallback = jest.fn()

      rtlWrapper = getFormScreen({
        assistance: rentalAssistance,
        onSave: mockSaveCallback,
        onClose: mockCloseCallback,
        onDelete: mockDeleteCallback
      })
    })

    test('matches snapshot', () => {
      expect(rtlWrapper.asFragment()).toMatchSnapshot()
    })

    test('should render the correct modal ID', () => {
      expect(screen.getByTestId('rental-assistance-form')).toHaveAttribute(
        'id',
        'rental-assistance-edit-form-0'
      )
    })

    test('should render the delete button', () => {
      expect(
        screen.queryByRole('button', {
          name: /delete/i
        })
      ).toBeInTheDocument()
    })

    test('should call the save callback when clicked', () => {
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /type of assistance/i
        }),
        {
          target: { value: 'Catholic Charities' }
        }
      )

      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
      expect(mockSaveCallback.mock.calls).toHaveLength(1)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })

    test('should call the delete callback when clicked', () => {
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      fireEvent.click(
        screen.getByRole('button', {
          name: /delete/i
        })
      )
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(1)
    })

    test('should call the cancel callback when clicked', () => {
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      fireEvent.click(
        screen.getByRole('button', {
          name: /cancel/i
        })
      )
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(1)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })
  })
})
