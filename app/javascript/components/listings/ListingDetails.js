import React from 'react'
import ListingDetailsContentCard from './ListingDetailsContentCard'
import ListingDetailsContentTable from './ListingDetailsContentTable'

import {
  detailsFields,
  buildingInformationFields,
  lotteryPreferencesFields,
  aafFields,
  lotteryInfoFields,
  appInfoFields,
  agentDevInfoFields,
  eligibilityRulesFields,
  additionalInfoFields,
  openHousesFields,
  infoSessionsFields
} from './fields'

const ListingDetails = ({ listing }) => {
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
