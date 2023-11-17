import React from 'react'

import { fireEvent, render, screen, act } from '@testing-library/react'

import StatusCell from 'components/lease_ups/application_page/StatusCell'

const mockOnChange = jest.fn()

describe('StatusCell', () => {
  let rtlWrapper
  beforeEach(() => {
    rtlWrapper = render(
      <StatusCell applicationId='applicationId1' status='Waitlisted' onChange={mockOnChange} />
    )
  })

  test('renders an a dropdown and a popover', () => {
    // Find the dropdown
    expect(screen.getByRole('combobox')).toBeInTheDocument()

    // Both the dropdown and popover have buttons, there should be two
    expect(screen.queryAllByRole('button')).toHaveLength(2)
  })

  test('renders with the correct styling', () => {
    expect(rtlWrapper.asFragment()).toMatchSnapshot()
  })

  test.skip('onClick is trigged when the input changes', () => {
    expect(mockOnChange.mock.calls).toHaveLength(0)
    act(() => fireEvent.click(screen.getByRole('combobox')))
    expect(mockOnChange.mock.calls).toHaveLength(1)
  })
})
