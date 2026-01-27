import React from 'react'

import { render, screen, within } from '@testing-library/react'

import LeaseUpSidebar from 'components/molecules/lease_up_sidebar/LeaseUpSidebar'
import { LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

import { mockStatusItem, mockStatusItems, mockManyStatusItems } from '../../../mocks/statusItemMock'

const getScreen = (items, isLoading = false) =>
  render(
    <LeaseUpSidebar
      statusItems={items}
      isLoading={isLoading}
      onChangeStatus={jest.fn()}
      statusOptions={LEASE_UP_STATUS_OPTIONS}
    />
  )

jest.mock('react-select', () => (props) => {
  const handleChange = (event) => {
    const option = props.options.find((option) => option.value === event.currentTarget.value)
    props.onChange(option)
  }
  return (
    <select
      data-testid={props['data-testid'] || 'select'}
      value={props.defaultValue?.value}
      onChange={handleChange}
      multiple={props.isMulti}
      data-disabled={props.isDisabled}
      className={props.className}
    >
      <option value=''>Select an option</option>
      {props.options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
})

describe('LeaseUpSidebar', () => {
  describe('when not loading', () => {
    test('should render with empty status items correctly', () => {
      getScreen([])
      // two sidebar buttons components, one for mobile, one for desktop
      expect(screen.getAllByTestId('lease-up-status-buttons')).toHaveLength(2)
      expect(
        within(screen.getAllByTestId('lease-up-status-buttons')[0]).getByRole('combobox')
      ).toHaveValue('')
      expect(screen.queryByText('Status History')).not.toBeInTheDocument()
    })

    test('should render with a single status item correctly', () => {
      getScreen([mockStatusItem()])
      expect(screen.getAllByTestId('lease-up-status-buttons')).toHaveLength(2)
      expect(
        within(screen.getAllByTestId('lease-up-status-buttons')[0]).getByRole('combobox')
      ).toHaveValue('Approved')
      expect(screen.getByRole('heading', { name: /status history/i, level: 2 })).toBeInTheDocument()
    })

    test('should render with multiple status items correctly', () => {
      getScreen(mockStatusItems())
      expect(screen.getAllByTestId('lease-up-status-buttons')).toHaveLength(2)
      expect(
        within(screen.getAllByTestId('lease-up-status-buttons')[0]).getByRole('combobox')
      ).toHaveValue('Approved')
      // StatusHistoryContainer caps the amount of statuses able to be shown at 4, even though there are 6 mocks
      expect(screen.getAllByTestId('status-item')).toHaveLength(4)
    })

    test('should render with more than 4 status items correctly', () => {
      getScreen(mockManyStatusItems(5))
      expect(screen.getAllByTestId('lease-up-status-buttons')).toHaveLength(2)
      expect(
        within(screen.getAllByTestId('lease-up-status-buttons')[0]).getByRole('combobox')
      ).toHaveValue('Approved')
      // StatusHistoryContainer caps the amount of statuses able to be shown at 4, even though there are 6 mocks
      expect(screen.getAllByTestId('status-item')).toHaveLength(4)
    })

    test('should render with lease signed status', () => {
      getScreen([
        mockStatusItem({
          status: 'Lease Signed',
          substatus: null
        }),
        mockStatusItem()
      ])
      expect(screen.getAllByTestId('lease-up-status-buttons')).toHaveLength(2)
      expect(
        within(screen.getAllByTestId('lease-up-status-buttons')[0]).getByRole('combobox')
      ).toHaveValue('Lease Signed')
    })
  })

  describe('when loading', () => {
    test('should set the buttons to be loading/disabled', () => {
      getScreen([mockStatusItem()], true)

      // When the buttons are loading, the data-disabled attribute is set to true
      expect(
        within(screen.getAllByTestId('lease-up-status-buttons')[0]).getByRole('combobox')
      ).toHaveAttribute('data-disabled', 'true')
      expect(screen.getAllByRole('button', { name: /saving…/i })[0]).toBeDisabled()
    })
  })

  describe('snapshot tests', () => {
    test('should match snapshot with 5 status items', () => {
      const { asFragment } = getScreen(mockManyStatusItems(5))
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
