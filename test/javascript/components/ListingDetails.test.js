import React from 'react'
import renderer from 'react-test-renderer'
import ListingDetails from 'components/ListingDetails'

test('1 + 1 equals 2', () => {
  expect(1 + 1).toBe(2)
})

test('Should render ListingDetails just fine', () => {
  const listings = {
    Listing_Lottery_Preferences: [],
    Open_Houses: true,
    Information_Sessions: []
  }
  const component = renderer.create(
    <ListingDetails listing = { listings }/ >,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  console.log(tree)
})
