import React from 'react'
import { map } from 'lodash'

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
  reservedAndPriorityFields
} from './fields'

const ProofListItems = ({ file_base_url, files }) => map(files, (file) => {
  return (
    <li key={file.id}>
      <a target='_blank'
        href={`${file_base_url}/servlet/servlet.FileDownload?file=${file.id}`}>
        {file.name}
      </a>
    </li>)
})

const ApplicationDetails = ({ application, fields, file_base_url }) => {
  const ApplicationCard = (props) => (
    <ApplicationDetailsContentCard dataCollection={application} {...props} />
  )

  const Table = (props) => (
    <ApplicationDetailsContentTable data={application} {...props} />
  )

  return (
    <div>
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
      <ApplicationDetailsContentCard
        dataCollection={application.alternate_contact}
        title='Alternate Contact'
        fields={alternateContactFields}
      />
      { application.household_members && (
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
    { application.preferences && (
          <Table
            title='Application Preferences'
            table='preferences'
            fields={applicationPreferencesFields} /> )
      }
      <ApplicationCard
        title='Declared Household Income'
        fields={declareHousholdIncome} />
    { application.flagged_applications && (
          <Table
            title='Flagged Applications'
            table='flagged_applications'
            fields={flaggedApplicationsFields} /> )
      }
      <div className="content-card">
        <h4 className="content-card_title t-serif">Attachments</h4>
        <ul>
          <ProofListItems files={application.proof_files} file_base_url={file_base_url} />
        </ul>
      </div>
    </div>
  )
}

export default ApplicationDetails
