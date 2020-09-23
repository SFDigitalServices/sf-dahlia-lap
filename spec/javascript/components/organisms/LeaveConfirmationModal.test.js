/* global mount */
import React from 'react'

import appPaths from '~/utils/appPaths'
import LeaveConfirmationModal from 'components/organisms/LeaveConfirmationModal'

describe('LeaveConfirmationModal', () => {
  const isOpen = true
  const handleClose = jest.fn()
  const destination = appPaths.toApplication('asdf1234')

  test('it should render successfully', () => {
    const wrapper = mount(
      <LeaveConfirmationModal
        isOpen={isOpen}
        handleClose={handleClose}
        destination={destination} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('it should close when the appropriate buttons are clicked', () => {
    const wrapper = mount(
      <LeaveConfirmationModal
        isOpen={isOpen}
        handleClose={handleClose}
        destination={destination} />
    )

    wrapper.find('.modal-button_secondary button').simulate('click')
    wrapper.find('.close-reveal-modal').simulate('click')

    expect(handleClose.mock.calls).toHaveLength(2)
  })
})
