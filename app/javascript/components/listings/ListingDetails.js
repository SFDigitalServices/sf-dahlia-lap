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
  const Card = (cardProps) =>  <ListingDetailsContentCard listing={listing} {...cardProps} />
  const Table = (tableProps) => <ListingDetailsContentTable listing={listing} {...tableProps} />

  return (
    <div>
      <Card title='Details' fields={detailsFields} />
      <Card title='Building Information' fields={buildingInformationFields} />
      { listing.Listing_Lottery_Preferences && (
          <Table  title='Listing Preferences'
                  table='Listing_Lottery_Preferences'
                  fields={lotteryPreferencesFields} />
          )
      }
      <Card title='Accessibility, Amenities, Fees' fields={aafFields} />
      <Card title='Lottery Information' fields={lotteryInfoFields} />
      <Card title='Application Information' fields={appInfoFields} />
      <Card title='Leasing Agent and Developer Information' fields={agentDevInfoFields} />
      <Card title='Additional Eligibility Rules' fields={eligibilityRulesFields} />
      <Card title='Additional Information' fields={additionalInfoFields} />
      { listing.Open_Houses && (
          <Table  title='Open Houses'
                  table='Open_Houses'
                  fields={openHousesFields} />
          )
      }
      { listing.Information_Sessions && (
          <Table  title='Information Sessions'
                  table='Information_Sessions'
                  fields={infoSessionsFields} />
        )
      }
    </div>
  )
}

export default ListingDetails
