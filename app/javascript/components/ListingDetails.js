import React from 'react'
import ListingDetailsContentCard from './ListingDetailsContentCard'
import ListingDetailsContentTable from './ListingDetailsContentTable'

const ListingDetails = ({ listing }) => {
  // to do: move fields into own file to import and map
  let detailsFields = [
    'Owner.Name',
    'Name',
    'Account.Name',
    'Application_Due_Date',
    'Number_of_Applications',
    'Status',
    'Building__r.Name',
    'Min_Occupancy',
    'Max_Occupancy',
    'Min_BR',
    'Max_BR',
    'Lottery_Winners',
    'Lottery_Results',
    'Min_Income',
    'Max_Income',
  ]

  let buildingInformationFields = [
    'Building_Name',
    'Project_ID',
    'Building_Street_Address',
    'Building_City',
    'Building_State',
    'Building_Zip_Code',
    'Neighborhood',
    'Developer',
    'Building_URL',
    'Year_Built',
    'Description',
    'Lottery_Preferences'
  ]

  let lotteryPreferencesFields = [
    'Lottery_Preference.Name',
    'Description',
    'PDF_URL',
    'Order',
    'Available_Units'
  ]

  let aafFields = [
    'Accessibility',
    'Fee',
    'Amenities',
    'Deposit_Min',
    'Costs_Not_Included',
    'Deposit_Max'
  ]

  let lotteryInfoFields = [
    'Lottery_Date',
    'Lottery_Results_Date',
    'Lottery_Venue',
    'Lottery_Status',
    'Lottery_Street_Address',
    'Lottery_Summary',
    'Lottery_City',
    'Lottery_URL',
  ]

  let appInfoFields = [
    'Application_Phone',
    'Office_Hours',
    'Application_Organization',
    'Office_Closed',
    'Application_Street_Address',
    'Application_City',
    'Application_State',
    'Application_Postal_Code',
    'Organization_URL',
    'Download_URL'
  ]

  let agentDevInfoFields= [
    'Leasing_Agent_Name',
    'Leasing_Agent_Title',
    'Leasing_Agent_Email',
    'Leasing_Agent_Phone',
    'Preference_Detail',
    'Rental_Assistance',
  ]

  let eligibilityRulesFields = [
    'Building_Selection_Criteria',
    'Eviction_History',
    'Criminal_History',
    'Credit_Rating'
  ]

  let additionalInfoFields = [
    'Required_Documents',
    'Smoking_Policy',
    'Legal_Disclaimers',
    'Pet_Policy'
  ]

  let openHousesFields = [
    'Date',
    'Start_Time',
    'End_Time'
  ]

  let infoSessionsFields = [
    'Date',
    'Start_Time',
    'End_Time',
    'Venue',
    'Street_Address',
    'City'
  ]

  return (
    <div>
      <ListingDetailsContentCard
        listing={listing}
        title='Details'
        fields={detailsFields}
      />
      <ListingDetailsContentCard
        listing={listing}
        title='Building Information'
        fields={buildingInformationFields}
      />
      {(() => {
        if (listing.Listing_Lottery_Preferences) {
          return (
            <ListingDetailsContentTable
              listing={listing}
              title='Listing Preferences'
              table='Listing_Lottery_Preferences'
              fields={lotteryPreferencesFields}
            />
          )
        }
      })()}
      <ListingDetailsContentCard
        listing={listing}
        title='Accessibility, Amenities, Fees'
        fields={aafFields}
      />
      <ListingDetailsContentCard
        listing={listing}
        title='Lottery Information'
        fields={lotteryInfoFields}
      />
      <ListingDetailsContentCard
        listing={listing}
        title='Application Information'
        fields={appInfoFields}
      />
      <ListingDetailsContentCard
        listing={listing}
        title='Leasing Agent and Developer Information'
        fields={agentDevInfoFields}
      />
      <ListingDetailsContentCard
        listing={listing}
        title='Additional Eligibility Rules'
        fields={eligibilityRulesFields}
      />
      <ListingDetailsContentCard
        listing={listing}
        title='Additional Information'
        fields={additionalInfoFields}
      />
      {(() => {
        if (listing.Open_Houses) {
          return (
            <ListingDetailsContentTable
              listing={listing}
              title='Open Houses'
              table='Open_Houses'
              fields={openHousesFields}
            />
          )
        }
      })()}
      {(() => {
        if (listing.Information_Sessions) {
          return (
            <ListingDetailsContentTable
              listing={listing}
              title='Information Sessions'
              table='Information_Sessions'
              fields={infoSessionsFields}
            />
          )
        }
      })()}
    </div>
  )
}

export default ListingDetails
