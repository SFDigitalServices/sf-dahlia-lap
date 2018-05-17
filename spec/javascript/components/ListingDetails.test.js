import React from 'react'
import renderer from 'react-test-renderer'
import ListingDetails from 'components/ListingDetails'
import sinon from 'sinon'

describe('ListingDetails', () => {
  let clock = null;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(2018, 3, 23).getTime());
  });

  afterEach(() => {
    clock.restore();
  })

  test('Should render ListingDetails', () => {
    /* More data is required here to be a real test*/
    const listings = {
      Listing_Lottery_Preferences: [],
      Open_Houses: true,
      Information_Sessions: [],
      'Owner.Name': 'xxx'
    }
    const component = renderer.create(
      <ListingDetails listing = { listings } />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
