import React from 'react'
import ApplicationDetailsContentCard from './ApplicationDetailsContentCard'
import ApplicationDetailsContentTable from './ApplicationDetailsContentTable'

const ApplicationDetails = ({ application, fields, file_base_url }) => {

  let proofList = _.map(application.proof_files, (file) => {
    return <li key={file.Id}><a target='_blank' href={`${file_base_url}/servlet/servlet.FileDownload?file=${file.Id}`}>{file.Name}</a></li>
  })

  return (
    <div>
      <ApplicationDetailsContentCard
        dataCollection={application}
        title='Application Data'
        fields={[
          'Lottery_Number',
          'Application_Submission_Type',
          'Application_Submitted_Date',
          'Application_Language',
          'Total_Household_Size',
          'Total_Monthly_Rent',
          'Status',
          'Referral_Source',
          'CreatedBy.Name'
        ]}
        labelMapper={fields}
      />
      <ApplicationDetailsContentCard
        dataCollection={application.Applicant}
        title='Primary Applicant'
        fields={[
          'First_Name',
          'Last_Name',
          'Date_of_Birth',
          'Phone',
          'Second_Phone',
          'Email',
          'Residence_Address',
          'Mailing_Address',
        ]}
      />
      <ApplicationDetailsContentCard
        dataCollection={application.Alternate_Contact}
        title='Alternate Contact'
        fields={[
          'First_Name',
          'Last_Name',
          'Phone',
          'Agency_Name',
          'Email',
          'Alternate_Contact_Type',
          'Alternate_Contact_Type_Other'
        ]}
      />
      {(() => {
        if (application.household_members) {
          return (
            <ApplicationDetailsContentTable
              data={application}
              title='Household Members'
              table='household_members'
              fields={[
                'Name',
                'Relationship_to_Applicant',
                'Date_of_Birth',
                'Street',
                'City',
                'State',
                'Zip_Code'
              ]}
            />
          )
        }
      })()}
      <ApplicationDetailsContentCard
        dataCollection={application}
        title='Reserved and Priority Qualifying Information'
        fields={[
          'Has_Military_Service',
          'Has_DevelopmentalDisability',
          'Has_ADA_Priorities_Selected',
          'Answered_Community_Screening'
        ]}
        labelMapper={fields}
      />
      {(() => {
        if (application.preferences) {
          return (
            <ApplicationDetailsContentTable
              data={application}
              title='Application Preferences'
              table='preferences'
              fields={[
                'Receives_Preference',
                'Preference_Name',
                'Lottery_Status',
                'Person_who_claimed_Name',
                'Type_of_proof',
                'Preference_Lottery_Rank',
                'Opt_Out'
              ]}
            />
          )
        }
      })()}
      <ApplicationDetailsContentCard
        dataCollection={application}
        title='Declared Household Income'
        fields={[
          'Annual_Income',
          'Monthly_Income',
          'Housing_Voucher_or_Subsidy'
        ]}
      />
      {(() => {
        if (application.flagged_applications) {
          return (
            <ApplicationDetailsContentTable
              data={application}
              title='Flagged Applications'
              table='flagged_applications'
              fields={[
                'Flagged_Record_Set.Rule_Name',
                'Flagged_Record_Set.Total_Number_of_Pending_Review',
                'View Record Set'
              ]}
            />
          )
        }
      })()}
      <div className="content-card">
        <h4 className="content-card_title t-serif">Attachments</h4>
        <ul>{proofList}</ul>
      </div>
    </div>
  )
}

export default ApplicationDetails
