import React from 'react'

import { isNil, uniqBy } from 'lodash'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
import { getAMIAction } from '~/components/supplemental_application/actions'

class SupplementalApplicationPage extends React.Component {
  state = {
    amis: {},
    amiCharts: []
  }

  componentDidMount() {
    // Display a calculated annual income if applicant only provided monthly income
    const { monthly_income, annual_income } = this.props.formApi.values
    if (isNil(annual_income) && !isNil(monthly_income)) {
      let annualIncome = monthly_income * 12
      this.props.formApi.setValue('annual_income', annualIncome)
    }
  
    // Determine which unique AMI charts are associated with units on the listing
    const chartsToLoad = uniqBy(this.props.units, u => [u.ami_chart_type, u.ami_chart_year].join())

    this.setState({'amiCharts': chartsToLoad.map((chart) => {
      return {"name": chart.ami_chart_type, "year": chart.ami_chart_year}}
      )
    })

    // Load the state with ami values for each chart associated with the listing.
    chartsToLoad.forEach( (chart) =>
      getAMIAction({chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year}).then(response => {
        this.setState({amis: [...this.state.amis, ...response]})
      }
    ))

  }

  render() {
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

const mapProperties = ({application, statusHistory, file_base_url, units}) => {
  return {
    application: mapApplication(application),
    statusHistory: mapList(mapFieldUpdateComment,statusHistory),
    onSubmit:  (values) => updateApplicationAction(values),
    fileBaseUrl: file_base_url,
    units: mapList(mapUnit, units)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
