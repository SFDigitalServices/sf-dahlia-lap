import React from 'react'

import { map, isEmpty } from 'lodash'

import InfoAlert from 'components/molecules/InfoAlert'
import appPaths from 'utils/appPaths'

import ApplicationDetailsContentCard from './ApplicationDetailsContentCard'
import ApplicationDetailsContentTable from './ApplicationDetailsContentTable'
import {
  flaggedApplicationsFields,
  declareHouseholdIncome,
  applicationDataFields,
  primaryApplicantFields,
  alternateContactFields,
  householdMembersFields,
  applicationPreferencesFields,
  reservedAndPriorityFields,
  applicationEligibilityFields
} from './fields'

const ProofListItems = ({ fileBaseUrl, files }) =>
  map(files, (file) => {
    return (
      <li key={file.id}>
        <a target='_blank' rel='noreferrer' href={appPaths.toAttachmentDownload(fileBaseUrl, file)}>
          {file.document_type}
        </a>
      </li>
    )
  })

const ApplicationDetails = ({ application, fields, fileBaseUrl, isContactUpdated }) => {
  const ApplicationCard = (props) => (
    <ApplicationDetailsContentCard dataCollection={application} {...props} />
  )
  const Table = (props) => <ApplicationDetailsContentTable data={application} {...props} />
  const contactInfoUpdatedMsg =
    'Applicant changed their contact info. Use updated details for future outreach.'

  return (
    <>
      {isContactUpdated && (
        <InfoAlert
          message={contactInfoUpdatedMsg}
          icon='i-inverted-clock'
          closeType='none'
          classes={['contact-updated']}
        />
      )}
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
          latestDataCollection={isContactUpdated ? application.contact_info : null}
        />
        {application.listing.is_sale && (
          <ApplicationDetailsContentCard
            title='Eligibility'
            dataCollection={application}
            fields={applicationEligibilityFields}
            splitOn={3}
            labelMapper={fields}
          />
        )}
        <ApplicationDetailsContentCard
          dataCollection={application.alternate_contact}
          title='Alternate Contact'
          fields={alternateContactFields}
        />
        {!isEmpty(application.household_members) && (
          <Table
            title='Household Members'
            table='household_members'
            fields={householdMembersFields}
          />
        )}
        <ApplicationCard
          title='Reserved and Priority Qualifying Information'
          fields={reservedAndPriorityFields}
          labelMapper={fields}
        />
        {!isEmpty(application.preferences) && (
          <Table
            title='Application Preferences'
            table='preferences'
            fields={applicationPreferencesFields}
          />
        )}
        <ApplicationCard title='Declared Household Income' fields={declareHouseholdIncome} />
        {!isEmpty(application.flagged_applications) && (
          <Table
            title='Flagged Applications'
            table='flagged_applications'
            fields={flaggedApplicationsFields}
          />
        )}
        <div className='content-card'>
          <h4 className='content-card_title t-serif'>Attachments</h4>
          <ul>
            <ProofListItems files={application.proof_files} fileBaseUrl={fileBaseUrl} />
          </ul>
        </div>
      </div>
    </>
  )
}

export default ApplicationDetails
