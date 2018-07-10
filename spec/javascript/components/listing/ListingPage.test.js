import React from 'react'
import renderer from 'react-test-renderer';

import _ from 'lodash'
import modelsFactory from '../../factories/models'
import sharedHooks from '../../support/sharedHooks'

import ListingPage from 'components/listings/ListingPage'
import ListingDetailsContentCard from 'components/listings/ListingDetailsContentCard'
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
  infoSessionsFields } from 'components/listings/fields'
import { mapListing } from '~/components/mappers/soqlToDomain'

describe('ListingPage', () => {
  sharedHooks.useFakeTimers()
  const listing = modelsFactory.listingDetail()

  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <ListingPage listing={listing}/>,
    )

    expect(wrapper.toJSON()).toMatchSnapshot();
  })

  describe('individual fields', ()=> {
    _.each([
      { title:'Details', fields: detailsFields },
      { title: 'Building Information', fields: buildingInformationFields },
      { title: 'Accessibility, Amenities, Fees', fields: aafFields },
      { title: 'Lottery Information', fields: lotteryInfoFields },
      { title: 'Application Information', fields: appInfoFields },
      { title: 'Leasing Agent and Developer Information', fields: agentDevInfoFields },
      { title: 'Additional Eligibility Rules', fields: eligibilityRulesFields },
      { title: 'Additional Information', fields: additionalInfoFields },
    ],({ title, fields }) => {
      test(`${title} fields`, () => {
        const wrapper = renderer.create(
          <ListingDetailsContentCard
            listing={mapListing(listing)}
            title={title}
            fields={fields} />
        )
        expect(wrapper.toJSON()).toMatchSnapshot();
      })
    })
  })

})
