import React from 'react'
import { isNil, uniqBy, map, cloneDeep, some } from 'lodash'

import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction, updatePreference, updateTotalHouseholdRent } from './actions'
import { mapList } from '~/components/mappers/utils'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import { getAMIAction } from '~/components/supplemental_application/actions'
import Context from './context'

const getChartsToLoad = (units) => {
  return uniqBy(units, u => [u.ami_chart_type, u.ami_chart_year].join())
}

const getAmiCharts = (chartsToLoad) => {
  return chartsToLoad.map(chart => ({ 'name': chart.ami_chart_type, 'year': chart.ami_chart_year }))
}

const getAmis = async (chartsToLoad) => {
  const promises = map(chartsToLoad, chart => {
    return getAMIAction({ chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year })
  })
  const amis = await Promise.all(promises)
  return [].concat.apply([], amis)
}

class SupplementalApplicationPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // A frozen copy of the application state that is currently persisted to salesforce. This is the latest saved copy.
      persistedApplication: cloneDeep(props.application),
      confirmedPreferencesFailed: false,
      amis: {},
      amiCharts: []
    }
  }

  componentDidMount () {
    const { units } = this.props
    const chartsToLoad = getChartsToLoad(units)
    const amiCharts = getAmiCharts(chartsToLoad)

    this.setState({ amiCharts })
    getAmis(chartsToLoad).then(amis => this.setState({ amis }))
  }

  handleSaveApplication = async (application) => {
    const { persistedApplication } = this.state

    // We clone the modified application in the UI since those are the fields we want to update
    const synchedApplication = cloneDeep(application)

    // Monthly rent and preferences are only updated in handleSavePreference below.
    // We set this values so we keep whatever we save in the panels
    synchedApplication.total_monthly_rent = persistedApplication.total_monthly_rent
    synchedApplication.preferences = cloneDeep(persistedApplication.preferences)

    const response = await updateApplicationAction(synchedApplication)
    this.setState({ persistedApplication: synchedApplication })
    if (response !== false) {
      // Reload the page to be pull updated data from SalesForce.
      window.location.reload()
    }
  }

  handleSavePreference = async (preferenceIndex, application) => {
    const { persistedApplication } = this.state
    const synchedApplication = cloneDeep(persistedApplication)

    // We need to set the total_monthly_rent in the global application, so we do not overwrite it.
    synchedApplication.total_monthly_rent = application.total_monthly_rent

    const responses = await Promise.all([
      updateTotalHouseholdRent(application.id, application.total_monthly_rent),
      updatePreference(application.preferences[preferenceIndex])
    ])

    this.setState({
      persistedApplication: synchedApplication,
      confirmedPreferencesFailed: some(responses, response => response === false)
    })
  }

  handleOnDismissError = () => {
    this.setState({ confirmedPreferencesFailed: false })
  }

  render () {
    const { statusHistory, fileBaseUrl, application, availableUnits } = this.props
    const { confirmedPreferencesFailed, amis, amiCharts } = this.state
    const pageHeader = {
      title: `${application.name}: ${application.applicant.name}`,
      breadcrumbs: [
        { title: 'Lease Ups', link: appPaths.toLeaseUps() },
        { title: application.listing.name, link: appPaths.toListingLeaseUps(application.listing.id) },
        { title: application.name, link: '#' }
      ]
    }

    const tabSection = {
      items: [
        { title: 'Short Form Application', url: appPaths.toApplication(application.id) },
        { title: 'Supplemental Information', url: appPaths.toApplicationSupplementals(application.id) }
      ]
    }

    const context = {
      application: application,
      statusHistory: statusHistory,
      onSubmit: this.handleSaveApplication,
      onSavePreference: this.handleSavePreference,
      confirmedPreferencesFailed: confirmedPreferencesFailed,
      onDismissError: this.handleOnDismissError,
      fileBaseUrl: fileBaseUrl,
      amiCharts: amiCharts,
      amis: amis,
      availableUnits: availableUnits
    }

    return (
      <Context.Provider value={context}>
        <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
          <SupplementalApplicationContainer />
        </CardLayout>
      </Context.Provider>
    )
  }
}

const getAnnualIncome = ({ monthlyIncome, annualIncome }) => {
  if (isNil(annualIncome) && !isNil(monthlyIncome)) {
    return (monthlyIncome * 12).toFixed(2)
  } else {
    return annualIncome
  }
}

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)

  applicationWithDefaults.annual_income = getAnnualIncome({monthlyIncome: application.monthly_income, annualIncome: application.annual_income})

  return applicationWithDefaults
}

const mapProperties = ({ application, statusHistory, fileBaseUrl, units, availableUnits }) => {
  return {
    application: setApplicationsDefaults(mapApplication(application)),
    statusHistory: mapList(mapFieldUpdateComment, statusHistory),
    onSubmit: (values) => updateApplicationAction(values),
    fileBaseUrl: fileBaseUrl,
    units: mapList(mapUnit, units),
    availableUnits: mapList(mapUnit, availableUnits)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
