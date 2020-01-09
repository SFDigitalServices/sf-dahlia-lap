# frozen_string_literal: true

module ForceHelpers
  YELLOW_ACRES_LISTING_ID = 'a0W0P00000GbyuQ'
  SALE_LISTING_ID = 'a0W0P00000GlKfBUAV'

  NON_LEASE_UP_APPLICATION_ID = 'a0o0P00000Fv20MQAR'

  NOT_YET_RUN_LISTING_ID = 'a0W0P00000F8YG4UAN'

  LEASE_UP_APPLICATION_ID = 'a0o0P00000GZazOQAT'
  LEASE_UP_PREFERENCE_ID = 'a0w0P00000OUJc3QAH' # preference is associated with application above

  SALE_APPLICATION_ID = 'a0o0P00000IWVdaQAH'

  PAPER_APPLICATION_LOTTERY_COMPLETED_ID = 'a0o0P00000GZawFQAT'

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

  def lease_up_preference_id
    LEASE_UP_PREFERENCE_ID
  end

  def sale_application_id
    SALE_APPLICATION_ID
  end

  def not_yet_run_listing_id
    NOT_YET_RUN_LISTING_ID
  end

  def paper_app_lottery_complete_id
    PAPER_APPLICATION_LOTTERY_COMPLETED_ID
  end
end
