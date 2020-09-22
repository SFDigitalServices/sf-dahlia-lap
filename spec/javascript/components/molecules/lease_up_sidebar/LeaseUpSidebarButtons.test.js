import React from 'react'
import { shallow } from 'enzyme'
import LeaseUpStatusButtons from 'components/molecules/lease_up_sidebar/LeaseUpStatusButtons'
import StatusDropdown from 'components/molecules/StatusDropdown'

const ON_CHANGE_STATUS = jest.fn()

describe('LeaseUpStatusButtons', () => {
  test('should render the status dropdown correctly', () => {
    const wrapper = shallow(<LeaseUpStatusButtons onChangeStatus={ON_CHANGE_STATUS} status={'Approved'} />)
    expect(wrapper.find(StatusDropdown)).toHaveLength(1)
    expect(wrapper.find(StatusDropdown).prop('status')).toEqual('Approved')
  })

  test('should render the status dropdown correctly when no status is passed', () => {
    const wrapper = shallow(<LeaseUpStatusButtons onChangeStatus={ON_CHANGE_STATUS} />)
    expect(wrapper.find(StatusDropdown)).toHaveLength(1)
    expect(wrapper.find(StatusDropdown).prop('status')).toBeNull()
  })

  test('should render a comment button', () => {
    const wrapper = shallow(<LeaseUpStatusButtons onChangeStatus={ON_CHANGE_STATUS} status={'Approved'} />)
    expect(wrapper.find('button#add-status-history-comment')).toHaveLength(1)
    expect(
      wrapper.find('button#add-status-history-comment').prop('disabled')
    ).toBeFalsy()
  })

  test('should disable both buttons when loading', () => {
    const wrapper = shallow(
      <LeaseUpStatusButtons onChangeStatus={ON_CHANGE_STATUS} status={'Approved'} isLoading />
    )

    expect(
      wrapper.find('button#add-status-history-comment').prop('disabled')
    ).toBeTruthy()
    expect(wrapper.find(StatusDropdown).prop('disabled')).toBeTruthy()
  })
})
