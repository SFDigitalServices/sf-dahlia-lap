import React from 'react'

import { isEmpty } from 'lodash'

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
import ListingDetailsContentCard from './ListingDetailsContentCard'
import ListingDetailsContentTable from './ListingDetailsContentTable'

const ListingDetails = ({ listing }) => {
  const Card = (cardProps) => <ListingDetailsContentCard listing={listing} {...cardProps} />
  const Table = (tableProps) => <ListingDetailsContentTable listing={listing} {...tableProps} />

  return (
    <div>
      <Card title='Details' fields={detailsFields} />
      <Card title='Building Information' fields={buildingInformationFields} />
      {!isEmpty(listing.listing_lottery_preferences) && (
        <Table
          title='Listing Preferences'
          table='listing_lottery_preferences'
          fields={lotteryPreferencesFields}
        />
      )}
      <Card title='Accessibility, Amenities, Fees' fields={aafFields} />
      <Card title='Lottery Information' fields={lotteryInfoFields} />
      <Card title='Application Information' fields={appInfoFields} />
      <Card title='Leasing Agent and Developer Information' fields={agentDevInfoFields} />
      <Card title='Additional Eligibility Rules' fields={eligibilityRulesFields} />
      <Card title='Additional Information' fields={additionalInfoFields} />
      {!isEmpty(listing.open_houses) && (
        <Table title='Open Houses' table='open_houses' fields={openHousesFields} />
      )}
      {!isEmpty(listing.information_sessions) && (
        <Table
          title='Information Sessions'
          table='information_sessions'
          fields={infoSessionsFields}
        />
      )}
    </div>
  )
}

export default ListingDetails
