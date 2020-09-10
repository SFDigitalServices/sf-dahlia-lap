import React from 'react'
import { cloneDeep } from 'lodash'
import RentalAssistance, {
  RentalAssistanceForm,
  RentalAssistanceTable
} from '~/components/supplemental_application/sections/RentalAssistance'
import {
  withForm,
  shallowWithFormAndContext,
  findByNameAndProps
} from '../../../testUtils/wrapperUtil'
import {
  InputField
} from '~/utils/form/final_form/Field'

const baseContext = {
  application: { rental_assistances: [] },
  applicationMembers: [{ id: '123', first_name: 'Test', last_name: 'Tester' }],
  showNewRentalAssistancePanel: false,
  handleOpenRentalAssistancePanel: () => { },
  handleCloseRentalAssistancePanel: () => { },
  handleSaveRentalAssistance: () => { },
  showAddRentalAssistanceBtn: () => { },
  hideAddRentalAssistanceBtn: () => { }
}

const rentalAssistance = {
  type_of_assistance: 'Compass Family',
  recurring_assistance: 'Yes',
  assistance_amount: '100',
  recipient: '123'
}

describe('RentalAssistance', () => {
  const getWrapper = (context) => shallowWithFormAndContext(
    context,
    (form) => <RentalAssistance form={form} />
  )

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

  test('should be able to show the add rental assistance form along with the table', () => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [rentalAssistance]
    context.showNewRentalAssistancePanel = true
    const wrapper = getWrapper(context)
    expect(wrapper.find(RentalAssistanceTable)).toHaveLength(1)
    expect(wrapper.find(RentalAssistanceForm)).toHaveLength(1)
  })
})

describe('RentalAssistanceForm', () => {
  const getWrapper = ({
    assistance,
    isNew = false,
    onSave = () => {},
    onClose = () => {},
    onDelete = () => {},
    shouldMount = false
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

    findByNameAndProps(wrapper, 'Button', { text: 'Save' }).simulate('click')
    expect(wrapper.find('.rental-assistance-type.error').exists()).toBeTruthy()
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
      expect(findByNameAndProps(wrapper, 'Button', { text: 'Delete' })).toHaveLength(0)
    })

    test('should call the save callback when clicked', () => {
      findByNameAndProps(wrapper, 'SelectField', { label: 'Type of Assistance' })
        .simulate('change', { target: { value: 'Catholic Charities' } })

      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
      findByNameAndProps(wrapper, 'Button', { text: 'Save' }).simulate('click')
      expect(mockSaveCallback.mock.calls.length).toEqual(1)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
    })

    test('should call the cancel callback when clicked', () => {
      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
      findByNameAndProps(wrapper, 'Button', { text: 'Cancel' }).simulate('click')
      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(1)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
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
        isNew: false,
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
      expect(findByNameAndProps(wrapper, 'Button', { text: 'Delete' })).toHaveLength(1)
    })

    test('should call the save callback when clicked', () => {
      findByNameAndProps(wrapper, 'SelectField', { label: 'Type of Assistance' })
        .simulate('change', { target: { value: 'Catholic Charities' } })

      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
      findByNameAndProps(wrapper, 'Button', { text: 'Save' }).simulate('click')
      expect(mockSaveCallback.mock.calls.length).toEqual(1)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
    })

    test('should call the delete callback when clicked', () => {
      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
      findByNameAndProps(wrapper, 'Button', { text: 'Delete' }).simulate('click')
      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(1)
    })

    test('should call the cancel callback when clicked', () => {
      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(0)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
      findByNameAndProps(wrapper, 'Button', { text: 'Cancel' }).simulate('click')
      expect(mockSaveCallback.mock.calls.length).toEqual(0)
      expect(mockCloseCallback.mock.calls.length).toEqual(1)
      expect(mockDeleteCallback.mock.calls.length).toEqual(0)
    })
  })
})
