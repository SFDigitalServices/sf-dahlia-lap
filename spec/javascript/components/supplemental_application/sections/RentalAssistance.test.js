import React from 'react'
import { cloneDeep } from 'lodash'
import RentalAssistance, {
  RentalAssistanceForm,
  RentalAssistanceTable
} from 'components/supplemental_application/sections/RentalAssistance'
import { withForm, shallowWithFormAndContext, findWithProps } from '../../../testUtils/wrapperUtil'
import { InputField, SelectField } from 'utils/form/final_form/Field'
import Button from 'components/atoms/Button'
import ExpandableTable from 'components/molecules/ExpandableTable'

const baseContext = {
  application: { rental_assistances: [] },
  applicationMembers: [{ id: '123', first_name: 'Test', last_name: 'Tester' }]
}

const rentalAssistance = {
  type_of_assistance: 'Compass Family',
  recurring_assistance: 'Yes',
  assistance_amount: '100',
  recipient: '123'
}

describe('RentalAssistance', () => {
  const getWrapper = (context) =>
    shallowWithFormAndContext(context, (form) => <RentalAssistance form={form} />)

  test('matches snapshot', () => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [rentalAssistance]
    const wrapper = getWrapper(context)
    expect(wrapper).toMatchSnapshot()
  })

  test('should not render a table if rental assistances is empty', () => {
    const context = cloneDeep(baseContext)
    const wrapper = getWrapper(context)
    expect(wrapper.find(RentalAssistanceTable)).toHaveLength(0)
  })

  test('should render a table if rental assistances are present', () => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [rentalAssistance]
    const wrapper = getWrapper(context)
    expect(wrapper.find(RentalAssistanceTable)).toHaveLength(1)
  })

  test('should render the Add Rental Assistance button by default', () => {
    const context = cloneDeep(baseContext)
    const wrapper = getWrapper(context)
    expect(findWithProps(wrapper, Button, { text: 'Add Rental Assistance' })).toHaveLength(1)
  })

  test('does not render the create new assistance form by default', () => {
    const context = cloneDeep(baseContext)
    const wrapper = getWrapper(context)
    expect(wrapper.find(RentalAssistanceForm)).toHaveLength(0)
  })

  describe('after the rental assistance button is clicked', () => {
    let wrapper

    beforeEach(() => {
      wrapper = getWrapper(cloneDeep(baseContext))
      findWithProps(wrapper, Button, { text: 'Add Rental Assistance' }).simulate('click')
    })

    test('should render the new rental assistance form after the add rental assistance button is clicked', () => {
      expect(wrapper.find(RentalAssistanceForm)).toHaveLength(1)
    })

    test('should hide the new rental assistance form after cancel is clicked', () => {
      wrapper.find(RentalAssistanceForm).prop('onClose')()
      expect(wrapper.find(RentalAssistanceForm)).toHaveLength(0)
      expect(findWithProps(wrapper, Button, { text: 'Add Rental Assistance' })).toHaveLength(1)
    })
  })
})

describe('RentalAssistanceTable', () => {
  const getWrapper = ({ disabled = false }) => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [rentalAssistance]

    return withForm(context, (form) => (
      <RentalAssistanceTable
        form={form}
        rentalAssistances={[rentalAssistance]}
        applicationMembers={[]}
        disabled={disabled}
      />
    ))
  }

  test('should render an ExpanderTable', () => {
    const wrapper = getWrapper({})
    expect(wrapper.find(ExpandableTable)).toHaveLength(1)
  })

  test('should not close all panels if not disabled', () => {
    const wrapper = getWrapper({})
    expect(wrapper.find(ExpandableTable).prop('closeAllRows')).toBeFalsy()
  })

  test('should close all panels when disabled', () => {
    const wrapper = getWrapper({ disabled: true })
    expect(wrapper.find(ExpandableTable).prop('closeAllRows')).toBeTruthy()
  })
})

describe('RentalAssistanceForm', () => {
  const getWrapper = ({
    assistance,
    isNew = false,
    onSave = () => {},
    onClose = () => {},
    onDelete = () => {},
    shouldMount = false,
    loading = false
  }) => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = assistance ? [assistance] : []

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
    const wrapper = getWrapper({ assistance: rentalAssistance })
    expect(wrapper.find(InputField)).toHaveLength(0)
  })

  test('should show the Other Assistance Name when Type of Assistance is Other', () => {
    const wrapper = getWrapper({
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
    const wrapper = getWrapper({ assistance: null, shouldMount: true })

    findWithProps(wrapper, Button, { text: 'Save' }).simulate('click')
    expect(wrapper.find('.rental-assistance-type.error').exists()).toBeTruthy()
  })

  describe('when not loading', () => {
    let wrapper
    let saveButtonWrapper
    let cancelButtonWrapper
    let deleteButtonWrapper

    beforeEach(() => {
      wrapper = getWrapper({
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
      wrapper = getWrapper({
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

      wrapper = getWrapper({
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

      wrapper = getWrapper({
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
