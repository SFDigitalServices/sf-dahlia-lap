import React from 'react'
import { cloneDeep } from 'lodash'

import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication, mapFieldUpdateComment } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
import CardLayout from '../layouts/CardLayout'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

class SupplementalApplicationPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      persistedApplication: cloneDeep(props.application) // salefroce current perssited data, frozen copy. latest saved copy.
    }
  }


  handleSaveApplication = async (application) => {
    const { persistedApplication } = this.state
    const synchedApplication = cloneDeep(application)

    synchedApplication.total_monthly_rent = persistedApplication.total_monthly_rent
    synchedApplication.preferences = cloneDeep(persistedApplication.preferences)

    await updateApplicationAction(synchedApplication)
    this.setState({ persistedApplication: synchedApplication })
  }

  handleSavePreference =  async (preferenceIndex, application) => {
    const { persistedApplication } = this.state
    const synchedApplication = cloneDeep(persistedApplication)

    synchedApplication.total_monthly_rent = application.total_monthly_rent
    synchedApplication.preferences[preferenceIndex] = application.preferences[preferenceIndex]

    await updateApplicationAction(synchedApplication)
    this.setState({ persistedApplication: synchedApplication })
  }

  render() {
    const { statusHistory, fileBaseUrl, application } = this.props

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
        />
      </CardLayout>
    )
  }
}

const mapProperties = ({ application, statusHistory, file_base_url }) => {
  return {
    application: mapApplication(application),
    statusHistory: mapList(mapFieldUpdateComment,statusHistory),
    fileBaseUrl: file_base_url
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
