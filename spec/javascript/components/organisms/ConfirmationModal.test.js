import React from 'react'
import { shallow } from 'enzyme'

import ConfirmationModal from 'components/organisms/ConfirmationModal'
import Modal from 'components/organisms/Modal'

import { findWithText } from '../../testUtils/wrapperUtil'

const PRIMARY_TEXT = 'Primary Text'
const SECONDARY_TEXT = 'Secondary Text'
const TITLE = 'Title'
const SUBTITLE = 'Subtitle'

const ON_CLOSE = jest.fn()
const ON_PRIMARY_CLICK = jest.fn()
const ON_SECONDARY_CLICK = jest.fn()

const getWrapper = (propOverrides = {}) =>
  shallow(
    <ConfirmationModal
      onPrimaryClick={ON_PRIMARY_CLICK}
      onSecondaryClick={ON_SECONDARY_CLICK}
      onCloseClick={ON_CLOSE}
      primaryText={PRIMARY_TEXT}
      secondaryText={SECONDARY_TEXT}
      subtitle={SUBTITLE}
      title={TITLE}
      {...propOverrides}
    />
  )

describe('ConfirmationModal', () => {
  describe('with default props', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper()
    })

    test('should render the modal as closed', () => {
      expect(wrapper.find(Modal).prop('isOpen')).toBeFalsy()
      expect(wrapper.find(Modal.Body).prop('hidden')).toBeFalsy()
    })

    test('should render the title and subtitle', () => {
      expect(wrapper.find(Modal.Header).prop('title')).toEqual(TITLE)
      expect(wrapper.find(Modal.Content).dive().text()).toEqual(SUBTITLE)
    })

    test('should render with the default header id', () => {
      expect(wrapper.find(Modal.Header).prop('id')).toEqual('confirmation-modal-header')
    })

    test('should render the primary button as a <button />', () => {
      expect(findWithText(wrapper, 'button', PRIMARY_TEXT)).toHaveLength(1)
      expect(findWithText(wrapper, 'a', PRIMARY_TEXT)).toHaveLength(0)
    })

    test('should render the primary button with primary style', () => {
      const primaryWrapper = findWithText(wrapper, 'button', PRIMARY_TEXT)
      expect(primaryWrapper.prop('className').includes('primary')).toBeTruthy()
    })

    test('should render the secondary button', () => {
      expect(findWithText(wrapper, 'button', SECONDARY_TEXT)).toHaveLength(1)
    })

    test('should trigger the onClose listener when close is clicked', () => {
      wrapper.find(Modal).prop('handleClose')()

      expect(ON_CLOSE.mock.calls).toHaveLength(1)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(0)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(0)
    })

    test('should trigger the onPrimaryClick listener when primary button is clicked', () => {
      findWithText(wrapper, 'button', PRIMARY_TEXT).simulate('click')

      expect(ON_CLOSE.mock.calls).toHaveLength(0)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(1)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(0)
    })

    test('should trigger the onSecondaryClick listener when secondary button is clicked', () => {
      findWithText(wrapper, 'button', SECONDARY_TEXT).simulate('click')

      expect(ON_CLOSE.mock.calls).toHaveLength(0)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(0)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(1)
    })
  })

  describe('with custom titleId', () => {
    const CUSTOM_TITLE_ID = 'custom-title-id'
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ titleId: CUSTOM_TITLE_ID })
    })

    test('should render with the custom header id', () => {
      expect(wrapper.find(Modal.Header).prop('id')).toEqual(CUSTOM_TITLE_ID)
    })
  })

  describe('when isOpen is true', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ isOpen: true })
    })

    test('should render the modal as open', () => {
      expect(wrapper.find(Modal).prop('isOpen')).toBeTruthy()
      expect(wrapper.find(Modal.Body).prop('hidden')).toBeTruthy()
    })
  })

  describe('when primaryButtonIsAlert is true', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ primaryButtonIsAlert: true })
    })

    test('should render the primary button with alert styling', () => {
      const primaryWrapper = findWithText(wrapper, 'button', PRIMARY_TEXT)
      expect(primaryWrapper.prop('className').includes('alert')).toBeTruthy()
    })
  })

  describe('when primaryButtonDestination is provided', () => {
    const DESTINATION = '#'
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper({ primaryButtonDestination: DESTINATION })
    })

    test('should render the primary button as an <a /> component', () => {
      expect(findWithText(wrapper, 'a', PRIMARY_TEXT)).toHaveLength(1)
      expect(findWithText(wrapper, 'button', PRIMARY_TEXT)).toHaveLength(0)
    })

    test('should render the primary button with the correct href', () => {
      const primaryWrapper = findWithText(wrapper, 'a', PRIMARY_TEXT)
      expect(primaryWrapper.prop('href')).toEqual(DESTINATION)
    })

    test('should trigger the onPrimaryClick listener when primary button is clicked', () => {
      findWithText(wrapper, 'a', PRIMARY_TEXT).simulate('click')

      expect(ON_CLOSE.mock.calls).toHaveLength(0)
      expect(ON_PRIMARY_CLICK.mock.calls).toHaveLength(1)
      expect(ON_SECONDARY_CLICK.mock.calls).toHaveLength(0)
    })
  })
})
