import React from 'react'

import { screen, within } from '@testing-library/react'

import ConfirmedHouseholdIncome, {
  getAmiPercent
} from 'components/supplemental_application/sections/ConfirmedHouseholdIncome'

import { withForm } from '../../../testUtils/wrapperUtil'

jest.mock('apiService', () => ({
  getAMI: async (data) => {
    return {
      ami: [
        { chartType: data.chartType, year: data.chartYear, amount: 100, numOfHousehold: 1 },
        { chartType: data.chartType, year: data.chartYear, amount: 200, numOfHousehold: 2 },
        { chartType: data.chartType, year: data.chartYear, amount: 300, numOfHousehold: 3 }
      ]
    }
  }
}))

const getScreen = (application, mockAmiCharts, shouldMount = false) => {
  return withForm(
    application,
    (form) => (
      <ConfirmedHouseholdIncome
        visited={{}}
        listingAmiCharts={mockAmiCharts}
        currentYearOverride={2020}
      />
    ),
    shouldMount
  )
}

describe('ConfirmedHouseholdIncome', () => {
  describe('getAmiPercent', () => {
    test('it returns percentage of ami for given income', () => {
      expect(getAmiPercent({ income: 10000, ami: '100000' })).toBe('10%')
      expect(getAmiPercent({ income: '10000', ami: '100000' })).toBe('10%')
      expect(getAmiPercent({ income: '$10,000', ami: '100000' })).toBe('10%')
      expect(getAmiPercent({ income: '$10,000.00', ami: '100000' })).toBe('10%')
    })
    test('it returns useful messages if params are missing', () => {
      expect(getAmiPercent({ income: null, ami: '100000' })).toBe('Enter HH Income')
      expect(getAmiPercent({ income: '$1,000', ami: null })).toBe('Missing AMI Chart')
    })
    test('it returns error message if income is invalid', () => {
      expect(getAmiPercent({ income: 'zzz', ami: '100000' })).toBe('Fix HH Income')
    })
  })

  test('it matches snapshot when all values are empty', () => {
    const { asFragment } = getScreen({}, [])
    expect(asFragment()).toMatchSnapshot()
  })

  describe('getAmiCharts', () => {
    const mockAmiCharts = [
      {
        ami_chart_type: 'chart1',
        ami_chart_year: 2021
      },
      {
        ami_chart_type: 'chart2',
        ami_chart_year: 2021
      }
    ]

    test('it sets chart options correctly when charts are empty', () => {
      getScreen({}, [], true)
      // Both chart type and year should be empty
      // As a result, there should be no option elements in the screen
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })

    test('it presents all available chart types when provided', () => {
      getScreen({}, mockAmiCharts, true)
      const expectedChartOptions = [
        {
          label: 'Select One...',
          value: ''
        },
        {
          label: 'chart1',
          value: 'chart1'
        },
        {
          label: 'chart2',
          value: 'chart2'
        }
      ]

      const expectedYearOptions = [
        {
          label: 'Select One...',
          value: ''
        },
        { label: '2020', value: '2020' },
        { label: '2021', value: '2021' }
      ]
      expect(
        within(
          screen.getByRole('combobox', {
            name: /ami chart type/i
          })
        )
          .getAllByRole('option')
          .map((option) => {
            return { label: option.textContent, value: option.value }
          })
      ).toEqual(expectedChartOptions)

      expect(
        within(
          screen.getByRole('combobox', {
            name: /ami chart year/i
          })
        )
          .getAllByRole('option')
          .map((option) => {
            return { label: option.textContent, value: option.value }
          })
      ).toEqual(expectedYearOptions)
    })

    test('it fills dates to present year when AMI chart year is in the past', () => {
      const mockOldAmiCharts = [{ ami_chart_type: 'chart', ami_chart_year: 2018 }]
      getScreen({}, mockOldAmiCharts, true)
      const expectedYearOptions = [
        {
          label: 'Select One...',
          value: ''
        },
        { label: '2018', value: '2018' },
        { label: '2019', value: '2019' },
        { label: '2020', value: '2020' }
      ]

      expect(
        within(
          screen.getByRole('combobox', {
            name: /ami chart year/i
          })
        )
          .getAllByRole('option')
          .map((option) => {
            return { label: option.textContent, value: option.value }
          })
      ).toEqual(expectedYearOptions)
    })
  })
})
