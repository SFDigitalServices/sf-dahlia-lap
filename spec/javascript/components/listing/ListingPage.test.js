import React from 'react'

import _ from 'lodash'
import renderer from 'react-test-renderer'

import {
  detailsFields,
  buildingInformationFields,
  aafFields,
  lotteryInfoFields,
  appInfoFields,
  agentDevInfoFields,
  eligibilityRulesFields,
  additionalInfoFields
} from 'components/listings/fields'
import ListingDetailsContentCard from 'components/listings/ListingDetailsContentCard'
import ListingPage from 'components/listings/ListingPage'

import modelsFactory from '../../factories/models'

describe('ListingPage', () => {
  const listing = modelsFactory.listingDetail()

  test('should render succesfully', () => {
    const wrapper = renderer.create(<ListingPage listing={listing} />)

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  describe('individual fields', () => {
    _.each(
      [
        { title: 'Details', fields: detailsFields },
        { title: 'Building Information', fields: buildingInformationFields },
        { title: 'Accessibility, Amenities, Fees', fields: aafFields },
        { title: 'Lottery Information', fields: lotteryInfoFields },
        { title: 'Application Information', fields: appInfoFields },
        { title: 'Leasing Agent and Developer Information', fields: agentDevInfoFields },
        { title: 'Additional Eligibility Rules', fields: eligibilityRulesFields },
        { title: 'Additional Information', fields: additionalInfoFields }
      ],
      ({ title, fields }) => {
        test(`${title} fields`, () => {
          const wrapper = renderer.create(
            <ListingDetailsContentCard listing={listing} title={title} fields={fields} />
          )
          expect(wrapper.toJSON()).toMatchSnapshot()
        })
      }
    )
  })
})
