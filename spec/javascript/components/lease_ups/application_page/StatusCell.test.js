import React from 'react'

import { shallow } from 'enzyme'

import StatusCell from 'components/lease_ups/application_page/StatusCell'
import StatusDropdown from 'components/molecules/StatusDropdown'
import StatusHistoryPopover from 'components/organisms/StatusHistoryPopover'

const mockOnChange = jest.fn()

describe('StatusCell', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <StatusCell applicationId='applicationId1' status='Waitlisted' onChange={mockOnChange} />
    )
  })

  test('renders an a dropdown and a popover', () => {
    expect(wrapper.find(StatusDropdown)).toHaveLength(1)
    expect(wrapper.find(StatusHistoryPopover)).toHaveLength(1)
  })

  test('renders the popover button with left margin', () => {
    expect(wrapper.find(StatusHistoryPopover).props().customButtonClasses).toEqual('margin-left')
  })

  test('onClick is trigged when the input changes', () => {
    expect(mockOnChange.mock.calls).toHaveLength(0)
    wrapper.find(StatusDropdown).simulate('change')
    expect(mockOnChange.mock.calls).toHaveLength(1)
  })
})
