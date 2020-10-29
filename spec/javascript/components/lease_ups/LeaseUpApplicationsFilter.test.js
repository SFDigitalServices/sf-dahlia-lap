import React from 'react'
import { mount, shallow } from 'enzyme'

import LeaseUpApplicationsFilter from '~/components/lease_ups/LeaseUpApplicationsFilter'
import SearchField from '~/utils/form/final_form/SearchField'
import Button from '~/components/atoms/Button'

const mockSubmit = jest.fn()

const getShallowWrapper = () =>
  shallow(
    <LeaseUpApplicationsFilter
      onSubmit={mockSubmit}
      preferences={['pref option 1', 'pref option 2']}
    />
  )

const getWrapper = () =>
  mount(
    <LeaseUpApplicationsFilter
      onSubmit={mockSubmit}
      preferences={['pref option 1', 'pref option 2']}
    />
  )

describe('LeaseUpApplicationsFilter', () => {
  test('it matches the expected snapshot with default preferences', () => {
    const wrapper = getShallowWrapper()
    expect(wrapper.find('ReactFinalForm').dive()).toMatchSnapshot()
  })

  describe('search field', () => {
    describe('when there is no text in the field', () => {
      test('it does not show the clear button', () => {
        const wrapper = getWrapper()
        expect(wrapper.exists('.search-icon')).toBe(false)
      })
      test('the search button is disabled', () => {
        const wrapper = getShallowWrapper().find('ReactFinalForm').dive()
        const searchButton = wrapper.find(Button).find({ text: 'Search' })
        expect(searchButton.props().disabled).toBe(true)
      })
    })
    describe('with text in the field', () => {
      test('it renders a clear input icon when there is text in the search input', () => {
        const wrapper = getWrapper()
        wrapper.find('.search')
        wrapper
          .find('.search')
          .find('input')
          .simulate('change', { target: { value: 'my search query' } })
        wrapper.update()
        expect(wrapper.exists('.search-icon')).toBe(true)
      })
      test('the search button is not disabled', () => {
        const wrapper = getWrapper()
        wrapper.find('.search')
        wrapper
          .find('.search')
          .find('input')
          .simulate('change', { target: { value: 'my search query' } })
        wrapper.update()
        expect(wrapper.find(Button).find({ text: 'Search' }).find('button').props().disabled).toBe(
          false
        )
      })
    })
    test('the clear input button clears the input', () => {
      const wrapper = getWrapper()
      wrapper.find('.search')
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(wrapper.find(SearchField).find('input').props().value).toEqual('my search query')

      wrapper.find('.search-icon').simulate('click')
      expect(wrapper.find(SearchField).find('input').props().value).toEqual('')
    })
  })
})
