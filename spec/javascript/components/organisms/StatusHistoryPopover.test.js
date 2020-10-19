import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { mockManyStatusItems } from '../../mocks/statusItemMock'

import StatusHistoryPopover from '~/components/organisms/StatusHistoryPopover'

const mockGetFieldUpdateComments = jest.fn()

jest.mock('apiService', () => {
  return {
    getFieldUpdateComments: async (applicationId) => {
      mockGetFieldUpdateComments(applicationId)

      return mockManyStatusItems(2)
    }
  }
})

const tick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

const getWrapper = () => mount(<StatusHistoryPopover applicationId={'app_id'} />)

describe('StatusHistoryPopover', () => {
  test('it matches snapshot when open', async () => {
    const wrapper = getWrapper()
    act(() => {
      wrapper.find('button').simulate('click')
    })
    await act(async () => await tick)
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })
  test("it loads status history data when data isn't present", async () => {
    const wrapper = getWrapper()
    act(() => {
      wrapper.find('button').simulate('click')
    })
    await act(async () => await tick)
    wrapper.update()
    expect(mockGetFieldUpdateComments).toHaveBeenCalledTimes(1)
  })
  test('it only fetches status history on first click', async () => {
    const wrapper = getWrapper()
    act(() => {
      wrapper.find('button').simulate('click')
    })
    await act(async () => await tick)
    wrapper.update()
    // Click again and make sure history items aren't fetched again
    act(() => {
      wrapper.find('button').simulate('click')
    })
    await act(async () => await tick)
    wrapper.update()
    expect(mockGetFieldUpdateComments).toHaveBeenCalledTimes(1)
  })
})
