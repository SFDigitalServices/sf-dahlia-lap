/* global wait */
/* global mount */
import React from 'react'
import renderer from 'react-test-renderer'
import Context from '~/components/supplemental_application/context'
import RentalAssistance from '~/components/supplemental_application/sections/RentalAssistance'
import { cloneDeep } from 'lodash'

const baseContext = {
  rentalAssistances: [],
  applicationMembers: [],
  addNewRentalAssistance: false,
  handleOpenRentalAssistancePanel: () => { },
  handleCloseRentalAssistancePanel: () => { },
  handleSaveNewRentalAssistance: () => { },
  showAddRentalAssistanceBtn: () => { },
  hideAddRentalAssistanceBtn: () => { }
}

describe('RentalAssistance', () => {
  test('it should not render table if rental assistances is empty', () => {
    const context = cloneDeep(baseContext)
    const component = renderer.create(
      <Context.Provider value={context}>
        <RentalAssistance />
      </Context.Provider>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it should rennder table when rental assistances present', () => {
    const context = cloneDeep(baseContext)

    context.rentalAssistances = [{ type_of_assistance: 'Other' }]

    const component = renderer.create(
      <Context.Provider value={context}>
        <RentalAssistance />
      </Context.Provider>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it should show add rental assistance form and table', () => {
    const context = cloneDeep(baseContext)

    context.rentalAssistances = [{ type_of_assistance: 'Other' }]
    context.addNewRentalAssistance = true

    const component = renderer.create(
      <Context.Provider value={context}>
        <RentalAssistance />
      </Context.Provider>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it should show add rental assistance form and table', () => {
    const context = cloneDeep(baseContext)

    context.rentalAssistances = [{ type_of_assistance: 'Other' }]
    context.addNewRentalAssistance = true

    const component = renderer.create(
      <Context.Provider value={context}>
        <RentalAssistance />
      </Context.Provider>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it should validate that type of assistance is present', () => {
    const context = cloneDeep(baseContext)
    context.addNewRentalAssistance = true

    const wrapper = mount(
      <Context.Provider value={context}>
        <RentalAssistance />
      </Context.Provider>
    )

    wrapper.find('button.primary').simulate('click')
    wait(1000)
    expect(wrapper.find('#type_of_assistance.error').exists()).toBeTruthy()
  })
})
