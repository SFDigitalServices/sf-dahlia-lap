import React from 'react'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import Popover from 'components/molecules/Popover'

const sampleButtonElement = ({ onClick, ref }) => (
  <button ref={ref} onClick={onClick}>
    Sample popover button
  </button>
)

const getWrapper = () => shallow(
  <Popover buttonElement={sampleButtonElement}>
    <p>
      popover content
    </p>
  </Popover>)

describe('Popover', () => {
  it('should be closed by default', () => {
    const wrapper = getWrapper()
    expect(wrapper.find('p').exists()).toBeFalsy()
  })
  it('should renders the provided button as expected', () => {
    const wrapper = getWrapper()
    expect(wrapper).toMatchSnapshot()
  })

  it('should renders the tooltip content as expected', () => {
    const wrapper = getWrapper()
    wrapper.find('button').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
  it('should open and close the tooltip when button is clicked', () => {
    const wrapper = getWrapper()
    wrapper.find('button').simulate('click')
    expect(wrapper.find('p').exists()).toBeTruthy()
    wrapper.find('button').simulate('click')
    expect(wrapper.find('p').exists()).toBeFalsy()
  })

  describe('useClickOutside effect', () => {
    const map = {}
    document.addEventListener = jest.fn().mockImplementation((event, cb) => {
      map[event] = cb
    })

    // render component

    const getWrapperWithOutsideElement = () => mount(
      <div>
        <Popover buttonElement={sampleButtonElement}>
          <p>
        popover content
          </p>
        </Popover>
        <a id='something_else' />
      </div>
    )
    it('should close the tooltip with outside elements are clicked', () => {
      const wrapper = getWrapperWithOutsideElement()
      // Open the popover
      wrapper.find('button').simulate('click')
      expect(wrapper.find('p').exists()).toBeTruthy()
      // Click on something outside of the popover
      act(() => { map.click({ target: wrapper.find('#something_else').getDOMNode() }) })
      wrapper.update()
      expect(wrapper.find('p').exists()).toBeFalsy()
    })

    it('should not close the tooltip when you click inside the tooltip', () => {
      const wrapper = getWrapperWithOutsideElement()
      // Open the popover
      wrapper.find('button').simulate('click')
      expect(wrapper.find('p').exists()).toBeTruthy()
      // Click on something inside of the popover
      act(() => { map.click({ target: wrapper.find('p').getDOMNode() }) })
      wrapper.update()
      expect(wrapper.find('p').exists()).toBeTruthy()
    })
  })
})
