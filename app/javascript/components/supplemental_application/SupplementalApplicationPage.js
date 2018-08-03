import React from 'react'
import { findIndex, cloneDeep, map } from 'lodash'

import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication, mapFieldUpdateComment } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
import CardLayout from '../layouts/CardLayout'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'


const setApplicationPreference = (application, applicationPreference) => {
  const prefIdx = findIndex(application.preferences, { id: applicationPreference.id })
  application.preferences[prefIdx] = applicationPreference
}

class SupplementalApplicationPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      persistedApplication: cloneDeep(props.application),
      application: props.application,
      persistedPrefrences: map(props.application.preferences, cloneDeep),
      preferences: map(props.application.preferences, cloneDeep),
    }
  }

  handleSaveApplication = async (application) => {
    const { persistedPrefrences } = this.state

    // We set the persisted preferences that we might have updated in the preference panel
    application.preferences = persistedPrefrences

    // We update
    await updateApplicationAction(application)

    // We set the new persistedApplication to be used in handleSavePreference
    this.setState({ persistedApplication: application })
  }

  handleSavePreference =  async (preference) => {
    const { persistedApplication, persistedPrefrences } = this.state

    // We make a copy of the persisted application, so we do not modfy it
    const application = cloneDeep(persistedApplication)

    // We copy the current persisted preferences. We make a copy, so we do not modfy it
    application.preferences = cloneDeep(persistedPrefrences)

    // We merge the preference to update with the persisted preferences in the new application
    setApplicationPreference(application, preference)

    // We update
    await updateApplicationAction(application)

    // We set the new persisted preference that so it can be used by this method and handleSaveApplication
    this.setState({ persistedPrefrences: application.preferences, preferences: cloneDeep(application.preferences) })
  }

  render() {
    const { preferences, statusHistory, formFields, fileBaseUrl } = this.props
    const { application } = this.state

    const pageHeader = {
      title: `${application.name}: ${application.applicant.name}`,
      breadcrumbs: [
        { title: 'Lease Ups', link: '/lease_ups' },
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
          preferences={preferences}
          statusHistory={statusHistory}
          formFields={formFields}
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
    fileBaseUrl: file_base_url,
    // onSubmit:  (values) => updateApplicationAction(values),
    // onSavePreference: updateApplicationPreferenceAction
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
