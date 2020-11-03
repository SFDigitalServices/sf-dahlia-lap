import React from 'react'

import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import StatusHistoryPopover from 'components/organisms/StatusHistoryPopover'

import { mockManyStatusItems } from '../../mocks/statusItemMock'

const mockGetFieldUpdateComments = jest.fn()
const APP_ID = 'app_id'
const APP_ID_MANY_ITEMS = 'app_id_many_items'

jest.mock('apiService', () => {
  return {
    getFieldUpdateComments: async (applicationId) => {
      mockGetFieldUpdateComments(applicationId)
      // Can't use const for id here because mock cannot use out of scope variables.
      return applicationId === 'app_id_many_items' ? mockManyStatusItems(5) : mockManyStatusItems(2)
    }
  }
})

const tick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

const getWrapper = (appId) => mount(<StatusHistoryPopover applicationId={appId} />)

let wrapper
describe('StatusHistoryPopover', () => {
  describe('when there are fewer than 4 status items', () => {
    beforeEach(async () => {
      wrapper = getWrapper(APP_ID)
      act(() => {
        wrapper.find('button').simulate('click')
      })
      await act(async () => await tick)
      wrapper.update()
      return wrapper
    })
    test('it matches snapshot when open', async () => {
      expect(wrapper).toMatchSnapshot()
    })
    test("it loads status history data when data isn't present", async () => {
      expect(mockGetFieldUpdateComments).toHaveBeenCalledTimes(1)
    })
    test('it only fetches status history on first click', async () => {
      // Click again and make sure history items aren't fetched again
      act(() => {
        wrapper.find('button').simulate('click')
      })
      await act(async () => await tick)
      wrapper.update()
      expect(mockGetFieldUpdateComments).toHaveBeenCalledTimes(1)
    })

    test('does not render the show/hide status toggler', async () => {
      expect(wrapper.exists('.button-link')).not.toEqual(true)
    })

    test('does not set a fixed height for status items', () => {
      expect(wrapper.find('StatusItems').prop('height')).toBeNull()
    })
  })
  describe('when there are more than 4 status items', () => {
    beforeEach(async () => {
      wrapper = getWrapper(APP_ID_MANY_ITEMS)
      act(() => {
        wrapper.find('button').simulate('click')
      })
      await act(async () => await tick)
      wrapper.update()
      return wrapper
    })
    test('renders a show/hide link that shows and hides status items', async () => {
      expect(wrapper.exists('.button-link')).toEqual(true)
      expect(wrapper.find('.button-link').text()).toEqual('Show all status updates')
      expect(wrapper.find('StatusItem')).toHaveLength(4)
      wrapper.find('.button-link').simulate('click')
      expect(wrapper.find('StatusItem')).toHaveLength(5)
      expect(wrapper.find('.button-link').text()).toEqual('Show only recent status updates')
    })

    test('sets a fixed height for the status items component', async () => {
      expect(wrapper.find('StatusItems').prop('height')).toEqual('20rem')
    })
  })
})
