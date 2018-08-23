import React from 'react'
import { cloneDeep } from 'lodash'

import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication, mapFieldUpdateComment } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
import CardLayout from '../layouts/CardLayout'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import Context from './context'

class SupplementalApplicationPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      // A frozen copy of the application state that is currently persisted to salesforce. This is the latest saved copy.
      persistedApplication: cloneDeep(props.application)
    }
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

  handleSavePreference =  async (preferenceIndex, application) => {
    const { persistedApplication } = this.state

    // We clone the lates saved copy, so we can use the latest saved fields.
    const synchedApplication = cloneDeep(persistedApplication)

    // We use the persisted copy and set only the fields updated in the panel
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

    const context = {
      application:application,
      statusHistory:statusHistory,
      onSubmit:this.handleSaveApplication,
      onSavePreference:this.handleSavePreference,
      fileBaseUrl:fileBaseUrl
    }

    return (
      <Context.Provider value={context}>
        <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
            <SupplementalApplicationContainer/>
        </CardLayout>
      </Context.Provider>
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
