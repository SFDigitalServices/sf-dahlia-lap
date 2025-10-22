# frozen_string_literal: true

module ForceHelpers
  YELLOW_ACRES_LISTING_ID = 'a0W0P00000GbyuQUAR'
  SALE_LISTING_ID = 'a0W0P00000GlKfBUAV'

  NON_LEASE_UP_APPLICATION_ID = 'a0o0P00000Fv02dQAB'

  NOT_YET_RUN_LISTING_ID = 'a0W0P00000F8YG4UAN'

  LEASE_UP_LISTING_ID = 'a0W4U00000SWsXLUA1'
  LEASE_UP_APPLICATION_ID = 'a0o0P00000GZazOQAT'
  LEASE_UP_PREFERENCE_ID = 'a0w0P00000OUJc3QAH' # preference is associated with application above

  FIELD_UPDATE_COMMENTS_APPLICATION_ID = 'a0o0P00000GZaz9QAD'
  SALE_APPLICATION_ID = 'a0o0P00000IWVdaQAH'

  PAPER_APPLICATION_LOTTERY_COMPLETED_ID = 'a0o0P00000GZawFQAT'

  FLAGGED_RECORD_SET_ID = ENV['E2E_FLAGGED_RECORD_SET_ID']

  FIELD_UPDATE_COMMENTS_FLAGGED_APPLICATION_ID = 'a0q0P00000MZz5TQAT'

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

  def lease_up_listing_id
    LEASE_UP_LISTING_ID
  end

  def field_update_comments_application_id
    FIELD_UPDATE_COMMENTS_APPLICATION_ID
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

  def flagged_record_set_id
    FLAGGED_RECORD_SET_ID
  end

  def field_update_comments_flagged_application_id
    FIELD_UPDATE_COMMENTS_FLAGGED_APPLICATION_ID
  end
end
