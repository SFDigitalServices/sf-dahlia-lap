import getAmiChartYears from 'utils/amiYearUtils'

const CurrentYear = '2020'

const mockChart = (yearOption) => ({ ami_chart_year: yearOption })

const mockCharts = (yearOptions) => yearOptions.map((chart) => mockChart(chart))

const getYearsWithMockOptions = (...yearOptions) =>
  getAmiChartYears(mockCharts(yearOptions), CurrentYear)

describe('getAmiChartYears', () => {
  test('should return an empty list when passed an empty list', async () => {
    expect(getYearsWithMockOptions()).toEqual([])
  })

  test('should handle non-digit options properly', async () => {
    expect(getYearsWithMockOptions('a')).toEqual(['a'])
    expect(getYearsWithMockOptions('a', 'b', 'c')).toEqual(['a', 'b', 'c'])
  })

  test('should handle non-recent year options properly', async () => {
    expect(getYearsWithMockOptions('2000')).toEqual(['2000'])
    expect(getYearsWithMockOptions(2000)).toEqual([2000])
    expect(getYearsWithMockOptions(9999)).toEqual([9999])
    expect(getYearsWithMockOptions(1)).toEqual([1])
    expect(getYearsWithMockOptions(123456)).toEqual([123456])
    expect(getYearsWithMockOptions(2000, 9999, 1)).toEqual([2000, 9999, 1])
    expect(getYearsWithMockOptions(2030)).toEqual([2030])
    expect(getYearsWithMockOptions(2010)).toEqual([2010])
  })

  test('should handle current year options properly', async () => {
    expect(getYearsWithMockOptions('2020')).toEqual([2020])
    expect(getYearsWithMockOptions('2020', 2020)).toEqual([2020])
    expect(getYearsWithMockOptions('2020', 2020, 2020)).toEqual([2020])
  })

  test('should handle single recent past year options properly', async () => {
    expect(getYearsWithMockOptions('2020')).toEqual([2020])
    expect(getYearsWithMockOptions(2020)).toEqual([2020])
    expect(getYearsWithMockOptions(2019)).toEqual([2019, 2020])
    expect(getYearsWithMockOptions(2018)).toEqual([2018, 2019, 2020])
    expect(getYearsWithMockOptions(2011)).toEqual([
      2011,
      2012,
      2013,
      2014,
      2015,
      2016,
      2017,
      2018,
      2019,
      2020
    ])
  })

  test('should handle multiple recent past year options properly', async () => {
    expect(getYearsWithMockOptions(2019, 2020)).toEqual([2019, 2020])
    expect(getYearsWithMockOptions(2020, 2019)).toEqual([2019, 2020])
    expect(getYearsWithMockOptions(2018, 2020)).toEqual([2018, 2019, 2020])
    expect(getYearsWithMockOptions(2018, 2019)).toEqual([2018, 2019, 2020])
    expect(getYearsWithMockOptions(2019, 2019, 2020)).toEqual([2019, 2020])
    expect(getYearsWithMockOptions(2019, 2020, 2020)).toEqual([2019, 2020])
  })

  test('should handle single close future year options properly', async () => {
    expect(getYearsWithMockOptions(2021)).toEqual([2020, 2021])
    expect(getYearsWithMockOptions(2022)).toEqual([2020, 2021, 2022])
    expect(getYearsWithMockOptions(2029)).toEqual([
      2020,
      2021,
      2022,
      2023,
      2024,
      2025,
      2026,
      2027,
      2028,
      2029
    ])
  })

  test('should handle multiple close future year options properly', async () => {
    expect(getYearsWithMockOptions(2020, 2021)).toEqual([2020, 2021])
    expect(getYearsWithMockOptions(2021, 2021)).toEqual([2020, 2021])
    expect(getYearsWithMockOptions(2021, 2020)).toEqual([2020, 2021])
    expect(getYearsWithMockOptions(2022, 2020)).toEqual([2020, 2021, 2022])
    expect(getYearsWithMockOptions(2023, 2021)).toEqual([2020, 2021, 2022, 2023])
  })

  test('should handle a mix of past and future year options properly', async () => {
    expect(getYearsWithMockOptions(2019, 2021)).toEqual([2019, 2020, 2021])
    expect(getYearsWithMockOptions(2018, 2020, 2021)).toEqual([2018, 2019, 2020, 2021])
    expect(getYearsWithMockOptions(2011, 2029)).toEqual([
      2011,
      2012,
      2013,
      2014,
      2015,
      2016,
      2017,
      2018,
      2019,
      2020,
      2021,
      2022,
      2023,
      2024,
      2025,
      2026,
      2027,
      2028,
      2029
    ])
  })

  test('should sort non-year values before year values', async () => {
    expect(getYearsWithMockOptions('non-year', 2019, 2021)).toEqual(['non-year', 2019, 2020, 2021])
    expect(getYearsWithMockOptions(2019, 2021, 'non-year')).toEqual(['non-year', 2019, 2020, 2021])
    expect(getYearsWithMockOptions(2019, 2021, 9999)).toEqual([9999, 2019, 2020, 2021])
    expect(getYearsWithMockOptions(2019, '2021a', 2021, 9999)).toEqual([
      '2021a',
      9999,
      2019,
      2020,
      2021
    ])
  })

  test('works for future years', async () => {
    const futureYear = 2021
    expect(getAmiChartYears(mockCharts(['non-year', 2019]), futureYear)).toEqual([
      'non-year',
      2019,
      2020,
      2021
    ])
    expect(getAmiChartYears(mockCharts(['non-year', 2023]), futureYear)).toEqual([
      'non-year',
      2021,
      2022,
      2023
    ])
  })
})
