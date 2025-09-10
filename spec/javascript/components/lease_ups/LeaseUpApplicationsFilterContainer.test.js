import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import { useFlag as useFlagUnleash, useFlagsStatus, useVariant } from '@unleash/proxy-client-react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import selectEvent from 'react-select-event'

import LeaseUpApplicationsFilterContainer from 'components/lease_ups/LeaseUpApplicationsFilterContainer'
import Provider from 'context/Provider'
import * as customHooks from 'utils/customHooks'

const mockSubmit = jest.fn()
const mockOnClearSelectedApplications = jest.fn()
const mockOnSelectAllApplications = jest.fn()

jest.mock('@unleash/proxy-client-react')
useFlagUnleash.mockImplementation(() => false)
useFlagsStatus.mockImplementation(() => ({
  flagsError: false,
  flagsReady: true
}))
useVariant.mockImplementation(() => ({
  payload: {
    value: '123'
  }
}))

const getNode = (bulkCheckboxesState = {}) => (
  <BrowserRouter>
    <Provider>
      <LeaseUpApplicationsFilterContainer
        onSubmit={mockSubmit}
        onClearSelectedApplications={mockOnClearSelectedApplications}
        onSelectAllApplications={mockOnSelectAllApplications}
        bulkCheckboxesState={bulkCheckboxesState}
        onBulkLeaseUpStatusChange={() => {}}
        onBulkLeaseUpCommentChange={() => {}}
        preferences={['pref option 1', 'pref option 2']}
      />
    </Provider>
  </BrowserRouter>
)

let mockSearchParam = new URLSearchParams()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => {
    return [
      mockSearchParam,
      (newParams) => {
        mockSearchParam = new URLSearchParams(newParams)
      }
    ]
  }
}))

const getScreen = (bulkCheckboxesState = {}) => render(getNode(bulkCheckboxesState))

describe('LeaseUpApplicationsFilterContainer', () => {
  describe('status checkbox', () => {
    describe('when the list of applications is empty', () => {
      beforeEach(() => {
        getScreen({})
      })

      test('should render the checkbox as unchecked', () => {
        expect(screen.getByRole('checkbox')).not.toBeChecked()
      })

      test('should call select all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        fireEvent.click(screen.getByRole('checkbox'))
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(1)
      })
    })

    describe('when the list of applications is all unchecked', () => {
      beforeEach(() => {
        getScreen({ appId1: false, appId2: false })
      })

      test('should render the checkbox as unchecked', () => {
        expect(screen.getByRole('checkbox')).not.toBeChecked()
      })

      test('should call select all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        fireEvent.click(screen.getByRole('checkbox'))
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(1)
      })
    })
    describe('when the list of applications has some checked and some unchecked', () => {
      beforeEach(() => {
        getScreen({ appId1: false, appId2: true })
      })

      test('should render the checkbox with indeterminate=true', () => {
        expect(screen.getByRole('checkbox')).toBePartiallyChecked()
      })

      test('should call clear all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        fireEvent.click(screen.getByRole('checkbox'))
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(1)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
      })
    })
    describe('when the list of applications is all checked', () => {
      beforeEach(() => {
        getScreen({ appId1: true, appId2: true })
      })

      test('should render the checkbox as checked', () => {
        expect(screen.getByRole('checkbox')).toBeChecked()
      })

      test('should call clear all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        fireEvent.click(screen.getByRole('checkbox'))
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(1)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
      })
    })
  })

  describe('search field', () => {
    test('it does not show the clear button when there is no text in the field', () => {
      getScreen()
      expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument()
    })
    test('it renders a clear input icon when there is text in the search input', () => {
      getScreen()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'my search query' } })
      expect(screen.queryByTestId('search-icon')).toBeInTheDocument()
    })
    test('the clear input button clears the input', () => {
      getScreen()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'my search query' } })
      expect(screen.getByDisplayValue('my search query')).toBeInTheDocument()
      fireEvent.click(screen.queryByTestId('search-icon'))
      expect(screen.getByPlaceholderText(/application, first name, last name\.\.\./i)).toHaveValue(
        ''
      )
    })
    test('the search field is tertiary-inverse unless the field has been modified', () => {
      getScreen()

      // search button is disabled on first render
      // button isn't actually disabled but has disabled styling
      expect(
        screen.getByRole('button', {
          name: /search/i
        })
      ).toHaveClass('tertiary-inverse')

      // search button should be enabled after we modify the field
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'my search query' } })
      expect(
        screen.getByRole('button', {
          name: /search/i
        })
      ).not.toHaveClass('tertiary-inverse')

      // search button should be disabled after we submit
      fireEvent.click(screen.getByRole('button', { name: /search/i }))
      expect(
        screen.getByRole('button', {
          name: /search/i
        })
      ).toHaveClass('tertiary-inverse')

      // search button should be re-enabled if we modify after submit
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'my other search query' } })
      expect(
        screen.getByRole('button', {
          name: /search/i
        })
      ).not.toHaveClass('tertiary-inverse')
    })

    describe('filters button and panel', () => {
      test('should default to hiding the filters', () => {
        getScreen()
        expect(screen.getByText('Show Filters')).toBeInTheDocument()
        expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument()
      })

      describe('previously applied filters', () => {
        let spy

        beforeEach(() => {
          spy = jest.spyOn(customHooks, 'useAppContext')
        })

        afterEach(() => {
          spy.mockRestore()
        })

        test('should show the filters panel when there are extra applied filters present', () => {
          spy.mockImplementation(() => [
            {
              applicationsListData: { appliedFilters: { total_household_size: ['1'] } }
            }
          ])

          getScreen()

          expect(screen.getByText('Hide Filters')).toBeInTheDocument()
          expect(screen.queryByText('Show Filters')).not.toBeInTheDocument()
        })

        test('should not show the filters panel when there is only previously applied search fields', () => {
          spy.mockImplementation(() => [
            {
              applicationsListData: { appliedFilters: { search: 'test' } }
            }
          ])

          getScreen()

          expect(screen.queryByText('Hide Filters')).not.toBeInTheDocument()
          expect(screen.getByText('Show Filters')).toBeInTheDocument()
        })
      })

      describe('when the show/hide filters button is clicked', () => {
        beforeEach(async () => {
          getScreen()
          await act(async () => fireEvent.click(screen.getByText(/show filters/i)))
        })

        test('should show the filters panel', () => {
          expect(
            screen.getByRole('button', {
              name: /apply filters/i
            })
          ).toBeInTheDocument()
          expect(screen.getAllByRole('combobox')).toHaveLength(5)
        })

        test('should should set hasChangedFilters = false', () => {
          expect(
            screen.getByRole('button', {
              name: /apply filters/i
            })
          ).toHaveClass('tertiary-inverse')
        })

        describe('when filters are cleared', () => {
          beforeEach(async () => {
            await act(async () => fireEvent.click(screen.getByText(/clear all/i)))
          })

          test('should not should set hasChangedFilters = true if filters were already cleared', () => {
            expect(
              screen.getByRole('button', {
                name: /apply filters/i
              })
            ).toHaveClass('tertiary-inverse')
          })
        })

        describe('when a filter is changed', () => {
          beforeEach(async () => {
            selectEvent.openMenu(screen.getAllByRole('combobox').pop())
            await act(async () => {
              fireEvent.click(screen.getByText(/processing/i))
            })
          })

          test('should should set hasChangedFilters = true', () => {
            expect(
              screen.getByRole('button', {
                name: /apply filters/i
              })
            ).toHaveClass('primary')
          })

          test('should contain the filters after apply filters is clicked', async () => {
            await act(async () => fireEvent.click(screen.getByText(/apply filters/i)))
            expect(screen.getByText(/processing/i)).toBeInTheDocument()
          })

          describe('when filters are cleared', () => {
            beforeEach(async () => {
              await act(async () => fireEvent.click(screen.getByText(/clear all/i)))
            })

            test('should have hasChangedFilters = false', () => {
              // when hasChangedFilters = true, the button should have a primary class
              expect(
                screen.getByRole('button', {
                  name: /apply filters/i
                })
              ).not.toHaveClass('primary')
            })

            test('applying filters with no filters actually applied should result in blank url search params', async () => {
              await act(async () =>
                fireEvent.click(
                  screen.getByRole('button', {
                    name: /apply filters/i
                  })
                )
              )
              expect(mockSearchParam).toEqual(new URLSearchParams())
            })
          })
        })
      })
    })
  })
})
