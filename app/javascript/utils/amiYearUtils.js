import { concat, forEach, range } from 'lodash'

// Example passing values: 1999, 2020, '0001'
const isFourDigitYear = (value) => /^\d{4}$/.test(value)

// Return true if the string is a valid year string and represents a year within 10 years (in past or future)
const isRecentFourDigitYear = (value, currentYear) =>
  isFourDigitYear(value) && Math.abs(value - currentYear) < 10

/**
 * Given an array of four digit years from unit ami chart options, sort and pad the array
 * to include the current year, incrementing by one.
 * ex: ([2018, 2019]) => [2018, 2019, 2020] if the current year is 2020.
 *
 * @param {*} yearOptions
 * @param {*} currentYear the current, four digit year
 */
const getRangeOfAmiYears = (yearOptions, currentYear) => {
  if (yearOptions.length === 0) return yearOptions

  const minOption = Math.min(currentYear, ...yearOptions)
  const maxOption = Math.max(currentYear, ...yearOptions)
  return range(minOption, maxOption + 1)
}

/**
 * Given a listing's AMI charts, get the list of year options for those charts. Note that the response list
 * may be longer than the input list, as we include additional years incrementally until we reach the current
 * date.
 *
 * Ex: input charts with years [2018, 2019] will return [2018, 2019, 2020] if the current year is 2020.
 *
 * @param {*} listingAmiCharts list of objects with "ami_chart_year" attributes.
 * @param {*} currentYear optional param primarily used for stubbing in tests. You should probably just use the default
 *   value, which is the system's current year.
 */
const getAmiChartYears = (listingAmiCharts, currentYear = new Date().getFullYear()) => {
  const fourDigitYearOptions = []
  const otherYearOptions = []

  forEach(listingAmiCharts, (chart) => {
    const yearOption = chart.ami_chart_year

    if (isRecentFourDigitYear(yearOption, currentYear)) {
      fourDigitYearOptions.push(yearOption)
    } else {
      otherYearOptions.push(yearOption)
    }
  })

  return concat(otherYearOptions, getRangeOfAmiYears(fourDigitYearOptions, currentYear))
}

export default getAmiChartYears
