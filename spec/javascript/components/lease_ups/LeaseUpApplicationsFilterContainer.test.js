import React from 'react'

import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

import Button from 'components/atoms/Button'
import LeaseUpApplicationsFilterContainer from 'components/lease_ups/LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'
import ShowHideFiltersButton from 'components/molecules/ShowHideFiltersButton'
import { SelectField } from 'utils/form/final_form/Field'
import SearchField from 'utils/form/final_form/SearchField'

const mockSubmit = jest.fn()

const getShallowWrapper = () =>
  shallow(
    <LeaseUpApplicationsFilterContainer
      onSubmit={mockSubmit}
      preferences={['pref option 1', 'pref option 2']}
    />
  )

const getWrapper = () =>
  mount(
    <LeaseUpApplicationsFilterContainer
      onSubmit={mockSubmit}
      preferences={['pref option 1', 'pref option 2']}
    />
  )

describe('LeaseUpApplicationsFilterContainer', () => {
  test('it matches the expected snapshot with default preferences', () => {
    const wrapper = getShallowWrapper()
    expect(wrapper.find('ReactFinalForm').dive()).toMatchSnapshot()
  })

  describe('search field', () => {
    test('it does not show the clear button when there is no text in the field', () => {
      const wrapper = getWrapper()
      expect(wrapper.exists('.search-icon')).toBe(false)
    })
    test('it renders a clear input icon when there is text in the search input', () => {
      const wrapper = getWrapper()
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(wrapper.exists('.search-icon')).toBe(true)
    })
    test('the clear input button clears the input', () => {
      const wrapper = getWrapper()
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(wrapper.find(SearchField).find('input').props().value).toEqual('my search query')

      wrapper.find('.search-icon').simulate('click')
      expect(wrapper.find(SearchField).find('input').props().value).toEqual('')
    })
    test('the search field is disabled unless the field has been modified', () => {
      const wrapper = getWrapper()
      const searchButtonIsDisabled = (wrapper) =>
        wrapper.find(Button).find({ text: 'Search' }).find('button').props().disabled
      // search button is disabled on first render
      expect(searchButtonIsDisabled(wrapper)).toBe(true)

      // search button should be enabled after we modify the field
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(searchButtonIsDisabled(wrapper)).toBe(false)

      // search button should be disabled after we submit
      wrapper.find(Button).find({ text: 'Search' }).find('button').simulate('submit')
      expect(searchButtonIsDisabled(wrapper)).toBe(true)

      // search button should be re-enabled if we modify after submit
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my other search query' } })
      wrapper.update()
      expect(searchButtonIsDisabled(wrapper)).toBe(false)
    })

    describe('filters button and panel', () => {
      let wrapper
      beforeEach(() => {
        wrapper = getWrapper()
      })

      test('should default to hiding the filters', () => {
        expect(wrapper.find(ShowHideFiltersButton).props().isShowingFilters).toBeFalsy()
        expect(wrapper.find(LeaseUpApplicationsFilters)).toHaveLength(0)
      })

      describe('when the show/hide filters button is clicked', () => {
        beforeEach(async () => {
          await act(async () => wrapper.find(ShowHideFiltersButton).simulate('click'))
          wrapper.update()
        })

        test('should show the filters panel', () => {
          expect(wrapper.find(ShowHideFiltersButton).props().isShowingFilters).toBeTruthy()
          expect(wrapper.find(LeaseUpApplicationsFilters)).toHaveLength(1)
        })

        test('should should set hasChangedFilters = false', () => {
          expect(wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters).toBeFalsy()
        })

        describe('when filters are cleared', () => {
          beforeEach(async () => {
            await act(async () => wrapper.find(LeaseUpApplicationsFilters).props().onClearFilters())
            wrapper.update()
          })

          test('should not should set hasChangedFilters = true if filters were already cleared', () => {
            expect(wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters).toBeFalsy()
          })
        })

        describe('when a filter is changed', () => {
          beforeEach(async () => {
            await act(async () =>
              wrapper.find(SelectField).at(0).find('select').simulate('change', 'general')
            )
            wrapper.update()
          })

          test('should should set hasChangedFilters = true', () => {
            expect(wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters).toBeTruthy()
          })

          describe('when filters are cleared', () => {
            beforeEach(async () => {
              await act(async () =>
                wrapper.find(LeaseUpApplicationsFilters).props().onClearFilters()
              )
              wrapper.update()
            })

            test('should keep hasChangedFilters = true', () => {
              expect(
                wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters
              ).toBeTruthy()
            })
          })
        })
      })
    })
  })
})
