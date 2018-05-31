/*global mount*/
import React from 'react'
// import sinon from 'sinon'

import SimpleModal from 'components/organisms/SimpleModal'

describe('SimpleModal', () => {
  const isOpen = true
  const onCloseClick = jest.fn()
  const onPrimaryClick = jest.fn()
  const onSecondaryClick = jest.fn()

  test('it should render status type successfully', () => {
    const wrapper = mount(
        <SimpleModal
          header='Update Status'
          primary='update'
          secondary='cancel'
          isOpen={isOpen}
          handleClose={onCloseClick}
          onPrimaryClick={onPrimaryClick}
          onSecondaryClick={onSecondaryClick}
          type='status'
          alert={{
            title: "This change will affect this application's preferences",
            subtitle: 'This application would no longer be eligible for Live Work Preference',
            message: 'Note, you will have the opportunity to grant another household member this preference',
            invert: false
          }}>
          <div>content</div>
        </SimpleModal>
    )

    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({type: 'alert' })

    expect(wrapper).toMatchSnapshot();
  })

  test('it should call event handlers', () => {
    const wrapper = mount(
        <SimpleModal
          header='Update Status'
          primary='update'
          secondary='cancel'
          isOpen={isOpen}
          handleClose={onCloseClick}
          onPrimaryClick={onPrimaryClick}
          onSecondaryClick={onSecondaryClick}
          type='status'>
          <div>content</div>
        </SimpleModal>
    )

    wrapper.find('.modal-button_primary button').simulate('click')
    wrapper.find('.modal-button_secondary button').simulate('click')
    wrapper.find('.close-reveal-modal').simulate('click')

    expect(onPrimaryClick.mock.calls.length).toBe(1)
    expect(onSecondaryClick.mock.calls.length).toBe(1)
    expect(onCloseClick.mock.calls.length).toBe(1)
  })
})
