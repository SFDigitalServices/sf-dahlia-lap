# frozen_string_literal: true

module ForceHelpers
  YELLOW_ACRES_LISTING_ID = 'a0W0P00000GbyuQ'
  SALE_LISTING_ID = 'a0W0P00000GlKfBUAV'

  NON_LEASE_UP_APPLICATION_ID = 'a0o0P00000Fv20MQAR'

  LEASE_UP_APPLICATION_ID = 'a0o0P00000GZazOQAT'

  SALE_APPLICATION_ID = 'a0o0t000000lkg8AAA'

  def valid_listing_id
    YELLOW_ACRES_LISTING_ID
  end

  def sale_listing_id
    SALE_LISTING_ID
  end

  # This listing ID follows the Salesforce ID format conventions
  # (see https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/field_types.htm#i1435616),
  # but is not an actual ID of an actual listing.
  def nonexistent_listing_id
    'a0W0P00000DZfSpXXX'
  end

  def non_lease_up_application_id
    NON_LEASE_UP_APPLICATION_ID
  end

  def lease_up_application_id
    LEASE_UP_APPLICATION_ID
  end

  def sale_application_id
    SALE_APPLICATION_ID
  end
end
