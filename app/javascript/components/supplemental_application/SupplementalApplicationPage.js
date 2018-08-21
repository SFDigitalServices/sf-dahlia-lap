import React from 'react'

import { isNil, uniqBy, map, cloneDeep } from 'lodash'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
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
  state = {
    amis: {},
    amiCharts: []
  }

  componentDidMount() {
    const { units } = this.props
    const chartsToLoad = getChartsToLoad(units)
    const amiCharts = getAmiCharts(chartsToLoad)

    this.setState({ amiCharts })
    getAmis(chartsToLoad).then(amis => this.setState({ amis }))
  }

  render() {
    const { application, statusHistory, fileBaseUrl, onSubmit } = this.props
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
          onSubmit={onSubmit}
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
    return monthly_income * 12
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
