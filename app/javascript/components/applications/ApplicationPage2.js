import React from 'react'

import PropTypes from 'prop-types'

import ApplicationDetails from './application_details/ApplicationDetails'
import labelMapperFields from './application_details/applicationDetailsFieldsDesc'

const ApplicationPage2 = ({ application = null, fileBaseUrl }) => {
  return (
    application && (
      <ApplicationDetails
        application={application}
        fileBaseUrl={fileBaseUrl}
        fields={labelMapperFields}
      />
    )
  )
}

ApplicationPage2.propTypes = {
  isLeaseUp: PropTypes.bool
}

export default ApplicationPage2
