import React from 'react'
import { map, isEmpty } from 'lodash'

import ApplicationDetailsContentCard from './ApplicationDetailsContentCard'
import ApplicationDetailsContentTable from './ApplicationDetailsContentTable'
import {
  flaggedApplicationsFields,
  declareHousholdIncome,
  applicationDataFields,
  primaryApplicantFields,
  alternateContactFields,
  householdMembersFields,
  applicationPreferencesFields,
  reservedAndPriorityFields,
  applicationEligibilityFields
} from './fields'

const FileDownloadUrl = (fileBaseUrl, file) => {
  switch (file.file_type) {
    case 'Attachment':
      return `${fileBaseUrl}/servlet/servlet.FileDownload?file=${file.id}`
    case 'File':
      return `${fileBaseUrl}/sfc/servlet.shepherd/version/download/${file.id}`
    default:
      return null
  }
}

const ProofListItems = ({ fileBaseUrl, files }) => map(files, (file) => {
  return (
    <li key={file.id}>
      <a target='_blank'
        href={FileDownloadUrl(fileBaseUrl, file)}>
        {file.document_type}
      </a>
    </li>)
})

const ApplicationDetails = ({ application, fields, fileBaseUrl }) => {
  const ApplicationCard = (props) => (
    <ApplicationDetailsContentCard dataCollection={application} {...props} />
  )
  const Table = (props) => (
    <ApplicationDetailsContentTable data={application} {...props} />
  )

  return (
    <div className='application-details'>
      <ApplicationCard
        title='Application Data'
        fields={applicationDataFields}
        labelMapper={fields}
      />
      <ApplicationDetailsContentCard
        dataCollection={application.applicant}
        title='Primary Applicant'
        fields={primaryApplicantFields}
      />
      { application.listing.is_sale && (
        <ApplicationDetailsContentCard
          title='Eligibility'
          dataCollection={application}
          fields={applicationEligibilityFields}
          splitOn={3}
          labelMapper={fields}
        />)
      }
      <ApplicationDetailsContentCard
        dataCollection={application.alternate_contact}
        title='Alternate Contact'
        fields={alternateContactFields}
      />
      { !isEmpty(application.household_members) && (
        <Table
          title='Household Members'
          table='household_members'
          fields={householdMembersFields}
        />)
      }
      <ApplicationCard
        title='Reserved and Priority Qualifying Information'
        fields={reservedAndPriorityFields}
        labelMapper={fields} />
      { !isEmpty(application.preferences) && (
        <Table
          title='Application Preferences'
          table='preferences'
          fields={applicationPreferencesFields} />)
      }
      <ApplicationCard
        title='Declared Household Income'
        fields={declareHousholdIncome} />
      { !isEmpty(application.flagged_applications) && (
        <Table
          title='Flagged Applications'
          table='flagged_applications'
          fields={flaggedApplicationsFields} />)
      }
      <div className='content-card'>
        <h4 className='content-card_title t-serif'>Attachments</h4>
        <ul>
          <ProofListItems files={application.proof_files} fileBaseUrl={fileBaseUrl} />
        </ul>
      </div>
    </div>
  )
}

export default ApplicationDetails
