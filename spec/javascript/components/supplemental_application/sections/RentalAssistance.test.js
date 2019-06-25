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
  applicationMembers: [{id: '123', first_name: 'Test', last_name: 'Tester'}],
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
  test('should not render a table if rental assistances is empty', () => {
    const context = cloneDeep(baseContext)
    const component = renderer.create(
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

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render a table when rental assistances are present', () => {
    const context = cloneDeep(baseContext)

    context.application.rental_assistances = [rentalAssistance]

    const component = renderer.create(
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

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should be able to show the add rental assistance form along with the table', () => {
    const context = cloneDeep(baseContext)

    context.application.rental_assistances = [rentalAssistance]
    context.showNewRentalAssistancePanel = true

    const component = renderer.create(
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

    const component = renderer.create(
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

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should validate that type of assistance is present upon save of the form panel', () => {
    const context = cloneDeep(baseContext)
    context.showNewRentalAssistancePanel = true

    const wrapper = mount(
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

    wrapper.find('button.primary').simulate('click')
    wait(1000)
    expect(wrapper.find('.rental-assistance-type.error').exists()).toBeTruthy()
  })
})
