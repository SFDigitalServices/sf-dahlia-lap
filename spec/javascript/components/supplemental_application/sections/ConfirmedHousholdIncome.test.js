import React from 'react'
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

const getWrapper = (application, mockAmiCharts, shouldMount = false) => {
  return withForm(
    application,
    (form) => <ConfirmedHouseholdIncome visited={{}} listingAmiCharts={mockAmiCharts} />,
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
    const wrapper = getWrapper({}, [])
    expect(wrapper).toMatchSnapshot()
  })

  describe('getAmiCharts', () => {
    const mockAmiCharts = [
      {
        ami_chart_type: 'chart1',
        ami_chart_year: 2020
      },
      {
        ami_chart_type: 'chart2',
        ami_chart_year: 2020
      }
    ]
    test('it sets chart options correctly when charts are empty', () => {
      const wrapper = getWrapper({}, [], true)
      expect(wrapper.find('SelectField#ami_chart_type').props().options).toEqual([])
      expect(wrapper.find('SelectField#ami_chart_year').props().options).toEqual([])
    })
    test('it presents all available chart types when provided', () => {
      const wrapper = getWrapper({}, mockAmiCharts, true)
      const expectedChartOptions = [
        {
          label: 'chart1',
          value: 'chart1'
        },
        {
          label: 'chart2',
          value: 'chart2'
        }
      ]
      const expectedYearOptions = [{ label: 2020, value: 2020 }]
      expect(wrapper.find('SelectField#ami_chart_type').props().options).toEqual(
        expectedChartOptions
      )
      expect(wrapper.find('SelectField#ami_chart_year').props().options).toEqual(
        expectedYearOptions
      )
    })

    test('it fills dates to present year when AMI chart year is in the past', () => {
      const mockOldAmiCharts = [{ ami_chart_type: 'chart', ami_chart_year: 2018 }]
      const wrapper = getWrapper({}, mockOldAmiCharts, true)
      const expectedYearOptions = [
        { label: 2018, value: 2018 },
        { label: 2019, value: 2019 },
        { label: 2020, value: 2020 }
      ]
      expect(wrapper.find('SelectField#ami_chart_year').props().options).toEqual(
        expectedYearOptions
      )
    })
  })
})
