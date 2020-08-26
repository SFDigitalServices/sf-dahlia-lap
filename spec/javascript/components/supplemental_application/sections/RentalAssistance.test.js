/* global wait */
/* global mount */
import React from 'react'
import renderer from 'react-test-renderer'
import Context from '~/components/supplemental_application/context'
import RentalAssistance from '~/components/supplemental_application/sections/RentalAssistance'
import { cloneDeep } from 'lodash'
import { Form } from 'react-final-form'

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

const rentalAssistanceInContext = (context) => (
  <Context.Provider value={context}>
    <Form
      onSubmit={() => null}
      initialValues={context.application}
      render={({ form }) => (
        <React.Fragment>
          <form noValidate>
            <RentalAssistance form={form} />
          </form>
        </React.Fragment>
      )} />
  </Context.Provider>
)

describe('RentalAssistance', () => {
  test('should not render a table if rental assistances is empty', () => {
    const context = cloneDeep(baseContext)

    const component = renderer.create(rentalAssistanceInContext(context))

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render a table when rental assistances are present', () => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [rentalAssistance]

    const component = renderer.create(rentalAssistanceInContext(context))

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should be able to show the add rental assistance form along with the table', () => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [rentalAssistance]
    context.showNewRentalAssistancePanel = true

    const component = renderer.create(rentalAssistanceInContext(context))

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should show the Other Assistance Name in the table when Type of Assistance is Other', () => {
    const context = cloneDeep(baseContext)
    context.application.rental_assistances = [
      {
        ...rentalAssistance,
        type_of_assistance: 'Other',
        other_assistance_name: 'Test Other Assistance Name'
      }
    ]

    const component = renderer.create(rentalAssistanceInContext(context))

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should validate that type of assistance is present upon save of the form panel', () => {
    const context = cloneDeep(baseContext)
    context.showNewRentalAssistancePanel = true

    const wrapper = mount(rentalAssistanceInContext(context))

    wrapper.find('button.primary').simulate('click')
    wait(1000)
    expect(wrapper.find('.rental-assistance-type.error').exists()).toBeTruthy()
  })

  test('should call the appropriate callbacks upon panel actions', () => {
    const context = cloneDeep(baseContext)
    const mockSaveCallback = jest.fn()
    const mockDeleteCallback = jest.fn()
    context.handleSaveRentalAssistance = mockSaveCallback
    context.handleDeleteRentalAssistance = mockDeleteCallback
    context.application.rental_assistances = [rentalAssistance]
    context.showNewRentalAssistancePanel = true

    const wrapper = mount(rentalAssistanceInContext(context))

    // Check the call of the save callback upon new rental assistance panel save
    wrapper
      .find('.rental-assistance-new-form select.rental-assistance-type')
      .simulate('change', { target: { value: 'Catholic Charities' } })
    wrapper.find('.rental-assistance-new-form button.primary').simulate('click')
    wait(1000)
    expect(mockSaveCallback.mock.calls.length).toEqual(1)
    expect(mockSaveCallback.mock.calls[0][2]).toEqual('create')

    // Check the call of the save callback upon existing rental assistance panel save
    wrapper.find('button.button-link').first().simulate('click')
    wrapper.find('.rental-assistance-edit-form button.primary').simulate('click')
    wait(1000)
    expect(mockSaveCallback.mock.calls.length).toEqual(2)
    expect(mockSaveCallback.mock.calls[1][2]).toEqual('update')

    // Check the call of the delete callback upon existing rental assistance panel delete
    wrapper.find('.rental-assistance-edit-form button.alert-fill').simulate('click')
    wait(1000)
    expect(mockDeleteCallback.mock.calls.length).toEqual(1)
  })
})
