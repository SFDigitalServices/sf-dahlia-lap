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

  return amis
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

  // OLD__componentDidMount() {
  //   // Display a calculated annual income if applicant only provided monthly income
  //   const { monthly_income, annual_income } = this.props.formApi.values
  //   if (isNil(annual_income) && !isNil(monthly_income)) {
  //     let annualIncome = monthly_income * 12
  //     this.props.formApi.setValue('annual_income', annualIncome)
  //   }
  //
  //   // Determine which unique AMI charts are associated with units on the listing
  //   const chartsToLoad = uniqBy(this.props.units, u => [u.ami_chart_type, u.ami_chart_year].join())
  //
  //   this.setState({'amiCharts': chartsToLoad.map((chart) => {
  //     return {"name": chart.ami_chart_type, "year": chart.ami_chart_year}}
  //     )
  //   })
  //
  //   // Load the state with ami values for each chart associated with the listing.
  //   chartsToLoad.forEach( (chart) =>
  //     getAMIAction({chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year}).then(response => {
  //       this.setState({amis: [...this.state.amis, ...response]})
  //     }
  //   ))
  //
  // }

  render() {
    const { application, statusHistory, fileBaseUrl, units, onSubmit } = this.props
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
          units={units}
        />
      </CardLayout>
    )
  }
}


// OPTIONS 1
const getAnualIncome = ({ monthly_income, annual_income }) => {
  if (isNil(annual_income) && !isNil(monthly_income)) {
    return monthly_income * 12
  } else {
    return annual_income
  }
}

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)

  applicationWithDefaults.annual_income = getAnualIncome(application)

  return applicationWithDefaults
}
//

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
