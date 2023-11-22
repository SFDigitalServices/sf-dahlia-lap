import React from 'react'

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'

import Popover from 'components/molecules/Popover'

const sampleButtonElement = ({ onClick, ref }) => (
  <button ref={ref} onClick={onClick}>
    Sample popover button
  </button>
)

const getScreen = () =>
  render(
    <Popover buttonElement={sampleButtonElement}>
      <p>popover content</p>
    </Popover>
  )

describe('Popover', () => {
  it('should be closed by default', () => {
    getScreen()
    expect(screen.queryByText('popover content')).not.toBeInTheDocument()
  })

  it('should renders the provided button as expected', () => {
    const { asFragment } = getScreen()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should renders the tooltip content as expected', async () => {
    const { asFragment } = getScreen()
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('should open and close the tooltip when button is clicked', () => {
    getScreen()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('popover content')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByText('popover content')).not.toBeInTheDocument()
  })

  describe('useClickOutside effect', () => {
    const map = {}
    document.addEventListener = jest.fn().mockImplementation((event, cb) => {
      map[event] = cb
    })

    const getScreenWithOutsideElement = () =>
      render(
        <div>
          <Popover buttonElement={sampleButtonElement}>
            <p>popover content</p>
          </Popover>
          <a id='something_else'>Click me</a>
        </div>
      )
    it('should close the tooltip with outside elements are clicked', async () => {
      getScreenWithOutsideElement()
      // Open the popover
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByText('popover content')).toBeInTheDocument()
      // Click on something outside of the popover
      act(() => {
        map.click({ target: screen.getByText('Click me') })
      })
      await waitFor(() => {
        expect(screen.queryByText('popover content')).not.toBeInTheDocument()
      })
    })

    it('should not close the tooltip when you click inside the tooltip', async () => {
      getScreenWithOutsideElement()
      // Open the popover
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByText('popover content')).toBeInTheDocument()
      // Click on something inside of the popover
      act(() => {
        map.click({ target: screen.getByText('popover content') })
      })

      await waitFor(() => {
        expect(screen.queryByText('popover content')).toBeInTheDocument()
      })
    })
  })
})
