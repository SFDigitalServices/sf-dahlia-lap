import React from 'react'

import { render, screen } from '@testing-library/react'

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

const testCases = [
  { title: 'Details', fields: detailsFields },
  { title: 'Building Information', fields: buildingInformationFields },
  { title: 'Accessibility, Amenities, Fees', fields: aafFields },
  { title: 'Lottery Information', fields: lotteryInfoFields },
  { title: 'Application Information', fields: appInfoFields },
  { title: 'Leasing Agent and Developer Information', fields: agentDevInfoFields },
  { title: 'Additional Eligibility Rules', fields: eligibilityRulesFields },
  { title: 'Additional Information', fields: additionalInfoFields }
]

describe('ListingPage', () => {
  const listing = modelsFactory.listingDetail()

  test('should render succesfully', () => {
    const { asFragment } = render(<ListingPage listing={listing} user_is_admin />)

    expect(asFragment()).toMatchSnapshot()
  })

  test('hides lottery results tab for non-admin users', () => {
    render(<ListingPage listing={listing} user_is_admin={false} />)

    expect(screen.queryByText('Lottery Results')).not.toBeInTheDocument()
  })

  describe('individual fields', () => {
    test.each(testCases)('%s fields', ({ title, fields }) => {
      const { asFragment } = render(
        <ListingDetailsContentCard listing={listing} title={title} fields={fields} />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
