import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import selectEvent from 'react-select-event'

import LeaseUpApplicationsFilterContainer from 'components/lease_ups/LeaseUpApplicationsFilterContainer'
import Provider from 'context/Provider'

const mockSubmit = jest.fn()
const mockOnClearSelectedApplications = jest.fn()
const mockOnSelectAllApplications = jest.fn()

const getNode = (bulkCheckboxesState = {}) => (
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
)

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
          })
        })
      })
    })
  })
})
