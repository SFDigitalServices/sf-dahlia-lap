import React from 'react'
import renderer from 'react-test-renderer'
import ListingDetails from 'components/ListingDetails'

test('Should render ListingDetails', () => {
  /* More data is required here */
  const listings = {
    Listing_Lottery_Preferences: [],
    Open_Houses: true,
    Information_Sessions: [],
    'Owner.Name': 'xxx'
  }
  const component = renderer.create(
    <ListingDetails listing = { listings }/ >,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
