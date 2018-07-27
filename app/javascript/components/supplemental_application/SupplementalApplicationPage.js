import React from 'react'
import { findIndex, cloneDeep } from 'lodash'

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
    this.state = { application: props.application }
  }

  handleOnSubmit = async (application) => {
    await updateApplicationAction(application)
  }

  handleSavePreference =  async (preference) => {
    console.log('handleSavePreference')
    const { application } = this.state

    // await updateApplicationPreferenceAction(preference)

    const prefIdx = findIndex(application.preferences, { id: preference.id })
    const updatedApplication = cloneDeep(application)

    updatedApplication.preferences[prefIdx] = preference
    this.setState({ application: updatedApplication })
  }

  render() {
    const { statusHistory, formFields, fileBaseUrl } = this.props
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
          statusHistory={statusHistory}
          formFields={formFields}
          onSubmit={this.handleOnSubmit}
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
