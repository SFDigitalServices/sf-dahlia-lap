module ForceHelpers
  YELLOW_ACRES_LISTING_ID = 'a0W0U000000MX4vUAG'.freeze

  YELLOW_ACRES_APPLICATION_ID = 'a0o0U000000VVw8'.freeze

  def valid_listing_id
    YELLOW_ACRES_LISTING_ID
  end

  # This listing ID follows the Salesforce ID format conventions
  # (see https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/field_types.htm#i1435616),
  # but is not an actual ID of an actual listing.
  def nonexistent_listing_id
    'a0W0P00000DZfSpXXX'
  end

  def valid_application_id
    YELLOW_ACRES_APPLICATION_ID
  end
end
