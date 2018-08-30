import React from 'react'
import { isNil, uniqBy, map, cloneDeep } from 'lodash'

import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
import CardLayout from '../layouts/CardLayout'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import { getAMIAction } from '~/components/supplemental_application/actions'

const getChartsToLoad = (units) => {
  return uniqBy(units, u => [u.ami_chart_type, u.ami_chart_year].join())
}

const getAmiCharts = (chartsToLoad) => {
  return chartsToLoad.map(chart => ({ "name": chart.ami_chart_type, "year": chart.ami_chart_year }))
}

const getAmis = async (chartsToLoad) => {
  const promises = map(chartsToLoad, chart => {
    return getAMIAction({ chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year })
  })
  const amis = await Promise.all(promises)
  return [].concat.apply([], amis)
}

class SupplementalApplicationPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      // A frozen copy of the application state that is currently persisted to salesforce. This is the latest saved copy.
      persistedApplication: cloneDeep(props.application),
      amis: {},
      amiCharts: []
    }
  }

  componentDidMount() {
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
    // We set this values so we keep whaterver we save in the panels
    synchedApplication.total_monthly_rent = persistedApplication.total_monthly_rent
    synchedApplication.preferences = cloneDeep(persistedApplication.preferences)

    await updateApplicationAction(synchedApplication)
    this.setState({ persistedApplication: synchedApplication })
  }

  handleSavePreference =  async (preferenceIndex, preferencesPanelApplication) => {
    const { persistedApplication } = this.state

    // We clone the latest saved copy, so we can use the latest saved fields.
    const synchedApplication = cloneDeep(persistedApplication)

    // We use the persisted copy and set only the fields updated in the panel
    synchedApplication.total_monthly_rent = preferencesPanelApplication.total_monthly_rent
    synchedApplication.preferences[preferenceIndex] = preferencesPanelApplication.preferences[preferenceIndex]

    await updateApplicationAction(synchedApplication)
    this.setState({ persistedApplication: synchedApplication })
  }

  render() {
    const { statusHistory, fileBaseUrl, application } = this.props
    const { amis, amiCharts } = this.state

    const pageHeader = {
      title: `${application.name}: ${application.applicant.name}`,
      breadcrumbs: [
        { title: 'Lease Ups', link: '/lease-ups' },
        { title: application.listing.name, link: appPaths.toListingLeaseUps(application.listing.id) },
        { title: application.name, link: '#' }
      ]
    }

    const tabSection = {
      items: [
        { title: 'Short Form Application',    url: appPaths.toApplication(application.id) },
        { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.id) }
      ]
    }

    return (
      <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
        <SupplementalApplicationContainer
          application={application}
          statusHistory={statusHistory}
          onSubmit={this.handleSaveApplication}
          onSavePreference={this.handleSavePreference}
          fileBaseUrl={fileBaseUrl}
          amiCharts={amiCharts}
          amis={amis}
        />
      </CardLayout>
    )
  }
}

const getAnnualIncome = ({ monthly_income, annual_income }) => {
  if (isNil(annual_income) && !isNil(monthly_income)) {
    return (monthly_income * 12).toFixed(2)
  } else {
    return annual_income
  }
}

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)

  applicationWithDefaults.annual_income = getAnnualIncome(application)

  return applicationWithDefaults
}

const mapProperties = ({ application, statusHistory, file_base_url, units }) => {
  return {
    application: setApplicationsDefaults(mapApplication(application)),
    statusHistory: mapList(mapFieldUpdateComment,statusHistory),
    onSubmit:  (values) => updateApplicationAction(values),
    fileBaseUrl: file_base_url,
    units: mapList(mapUnit, units)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
