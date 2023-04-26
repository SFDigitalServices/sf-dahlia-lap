import React from 'react'

import Button from 'components/atoms/Button'
import ExpandableTable, { ExpanderButton } from 'components/molecules/ExpandableTable'
import RentalAssistance, {
  RentalAssistanceForm,
  RentalAssistanceTable
} from 'components/supplemental_application/sections/RentalAssistance'
import { NEW_ASSISTANCE_PSEUDO_ID } from 'context/subreducers/SupplementalApplicationSubreducer'
import { InputField, SelectField } from 'utils/form/final_form/Field'

import { withForm, findWithProps } from '../../../testUtils/wrapperUtil'

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
    let wrapper
    beforeEach(() => {
      wrapper = getRentalAssistanceWrapper()
    })

    test('should not render a table', () => {
      expect(wrapper.find(RentalAssistanceTable)).toHaveLength(0)
    })

    test('should render the Add Rental Assistance button', () => {
      expect(findWithProps(wrapper, Button, { text: 'Add Rental Assistance' })).toHaveLength(1)
    })

    test('does not render the create new assistance form', () => {
      expect(wrapper.find(RentalAssistanceForm)).toHaveLength(0)
    })
  })

  describe('with rental assistances', () => {
    let wrapper

    beforeEach(() => {
      wrapper = getRentalAssistanceWrapper(withContext({ rentalAssistances: [rentalAssistance] }))
    })

    test('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    test('should render a table', () => {
      expect(wrapper.find(RentalAssistanceTable)).toHaveLength(1)
    })

    test('should render the Add Rental Assistance button', () => {
      expect(findWithProps(wrapper, Button, { text: 'Add Rental Assistance' })).toHaveLength(1)
    })

    test('does not render the create new assistance form', () => {
      expect(wrapper.find(RentalAssistanceForm)).toHaveLength(0)
    })
  })

  describe('when assistanceRowsOpened contains a new rental assistance id', () => {
    let wrapper

    beforeEach(() => {
      wrapper = getRentalAssistanceWrapper(
        withContext({ assistanceRowsOpened: new Set([NEW_ASSISTANCE_PSEUDO_ID]) })
      )
    })

    test('should render the new rental assistance form after the add rental assistance button is clicked', () => {
      expect(wrapper.find(RentalAssistanceForm)).toHaveLength(1)
    })
  })
})

describe('RentalAssistanceTable', () => {
  const getTableWrapper = ({ disabled = false }) => {
    const context = withContext({ rentalAssistances: [rentalAssistance] })

    return withForm(
      context.application,
      (form) => (
        <RentalAssistanceTable
          form={form}
          rentalAssistances={[rentalAssistance]}
          applicationMembers={[]}
          assistanceRowsOpened={new Set()}
          disabled={disabled}
        />
      ),
      true
    )
  }

  describe('when not disabled', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getTableWrapper({})
    })

    test('renders an expander button', () => {
      expect(wrapper.find(ExpanderButton)).toHaveLength(1)
    })

    test('should render an ExpanderTable', () => {
      expect(wrapper.find(ExpandableTable)).toHaveLength(1)
    })
  })

  describe('when  disabled', () => {
    test('does not render any expander buttons', () => {
      const wrapper = getTableWrapper({ disabled: true })
      expect(wrapper.find(ExpanderButton)).toHaveLength(0)
    })
  })
})

describe('RentalAssistanceForm', () => {
  const getFormWrapper = ({
    assistance,
    isNew = false,
    onSave = () => {},
    onClose = () => {},
    onDelete = () => {},
    shouldMount = false,
    loading = false
  }) => {
    const context = withContext({ rentalAssistances: assistance ? [assistance] : [] })

    return withForm(
      context.application,
      (form) => (
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
      ),
      shouldMount
    )
  }

  test('should not show the Other Assistance Name input when Type of Assistance is not Other', () => {
    const wrapper = getFormWrapper({ assistance: rentalAssistance })
    expect(wrapper.find(InputField)).toHaveLength(0)
  })

  test('should show the Other Assistance Name when Type of Assistance is Other', () => {
    const wrapper = getFormWrapper({
      assistance: {
        ...rentalAssistance,
        type_of_assistance: 'Other',
        other_assistance_name: 'Test Other Assistance Name'
      }
    })
    expect(wrapper.find(InputField)).toHaveLength(1)
    expect(wrapper.find(InputField).prop('label')).toEqual('Other Assistance Name')
  })

  test('should validate that type of assistance is present upon save of the form panel', () => {
    // need to mount it to access the error classes
    const wrapper = getFormWrapper({ assistance: null, shouldMount: true })

    findWithProps(wrapper, Button, { text: 'Save' }).simulate('click')
    expect(wrapper.find('.rental-assistance-type.error').exists()).toBeTruthy()
  })

  describe('when not loading', () => {
    let wrapper
    let saveButtonWrapper
    let cancelButtonWrapper
    let deleteButtonWrapper

    beforeEach(() => {
      wrapper = getFormWrapper({
        assistance: rentalAssistance,
        loading: false
      })

      saveButtonWrapper = findWithProps(wrapper, Button, { id: 'rental-assistance-save' })
      cancelButtonWrapper = findWithProps(wrapper, Button, {
        id: 'rental-assistance-cancel'
      })
      deleteButtonWrapper = findWithProps(wrapper, Button, {
        id: 'rental-assistance-delete'
      })
    })

    test('should disable the action buttons', () => {
      expect(saveButtonWrapper.props().disabled).toEqual(false)
      expect(cancelButtonWrapper.props().disabled).toEqual(false)
      expect(deleteButtonWrapper.props().disabled).toEqual(false)
    })

    test('should update the save button to say Saving...', () => {
      expect(saveButtonWrapper.props().text).toEqual('Save')
    })
  })

  describe('when loading', () => {
    let wrapper
    let saveButtonWrapper
    let cancelButtonWrapper
    let deleteButtonWrapper

    beforeEach(() => {
      wrapper = getFormWrapper({
        assistance: rentalAssistance,
        loading: true
      })

      saveButtonWrapper = findWithProps(wrapper, Button, { id: 'rental-assistance-save' })
      cancelButtonWrapper = findWithProps(wrapper, Button, {
        id: 'rental-assistance-cancel'
      })
      deleteButtonWrapper = findWithProps(wrapper, Button, {
        id: 'rental-assistance-delete'
      })
    })

    test('should disable the action buttons', () => {
      expect(saveButtonWrapper.props().disabled).toEqual(true)
      expect(cancelButtonWrapper.props().disabled).toEqual(true)
      expect(deleteButtonWrapper.props().disabled).toEqual(true)
    })

    test('should update the save button to say Saving...', () => {
      expect(saveButtonWrapper.props().text).toEqual('Saving...')
    })
  })

  describe('when it is new', () => {
    let mockSaveCallback
    let mockCloseCallback
    let mockDeleteCallback
    let wrapper

    beforeEach(() => {
      mockSaveCallback = jest.fn()
      mockCloseCallback = jest.fn()
      mockDeleteCallback = jest.fn()

      wrapper = getFormWrapper({
        assistance: rentalAssistance,
        isNew: true,
        onSave: mockSaveCallback,
        onClose: mockCloseCallback,
        onDelete: mockDeleteCallback
      })
    })

    test('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    test('should render the correct modal ID', () => {
      expect(wrapper.find('#rental-assistance-new-form')).toHaveLength(1)
    })

    test('should not render the delete button', () => {
      expect(findWithProps(wrapper, Button, { text: 'Delete' })).toHaveLength(0)
    })

    test('should call the save callback when clicked', () => {
      findWithProps(wrapper, SelectField, { label: 'Type of Assistance' }).simulate('change', {
        target: { value: 'Catholic Charities' }
      })

      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      findWithProps(wrapper, Button, { text: 'Save' }).simulate('click')
      expect(mockSaveCallback.mock.calls).toHaveLength(1)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })

    test('should call the cancel callback when clicked', () => {
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      findWithProps(wrapper, Button, { text: 'Cancel' }).simulate('click')
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(1)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })
  })

  describe('when it already exists on salesforce', () => {
    let mockSaveCallback
    let mockCloseCallback
    let mockDeleteCallback
    let wrapper

    beforeEach(() => {
      mockSaveCallback = jest.fn()
      mockCloseCallback = jest.fn()
      mockDeleteCallback = jest.fn()

      wrapper = getFormWrapper({
        assistance: rentalAssistance,
        onSave: mockSaveCallback,
        onClose: mockCloseCallback,
        onDelete: mockDeleteCallback
      })
    })

    test('matches snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    test('should render the correct modal ID', () => {
      expect(wrapper.find('#rental-assistance-edit-form-0')).toHaveLength(1)
    })

    test('should render the delete button', () => {
      expect(findWithProps(wrapper, Button, { text: 'Delete' })).toHaveLength(1)
    })

    test('should call the save callback when clicked', () => {
      findWithProps(wrapper, SelectField, { label: 'Type of Assistance' }).simulate('change', {
        target: { value: 'Catholic Charities' }
      })

      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      findWithProps(wrapper, Button, { text: 'Save' }).simulate('click')
      expect(mockSaveCallback.mock.calls).toHaveLength(1)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })

    test('should call the delete callback when clicked', () => {
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      findWithProps(wrapper, Button, { text: 'Delete' }).simulate('click')
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(1)
    })

    test('should call the cancel callback when clicked', () => {
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(0)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
      findWithProps(wrapper, Button, { text: 'Cancel' }).simulate('click')
      expect(mockSaveCallback.mock.calls).toHaveLength(0)
      expect(mockCloseCallback.mock.calls).toHaveLength(1)
      expect(mockDeleteCallback.mock.calls).toHaveLength(0)
    })
  })
})
