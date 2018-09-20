module ForceHelpers
  YELLOW_ACRES_LISTING_ID = 'a0W0U000000MX4vUAG'.freeze

  YELLOW_ACRES_APPLICATION_ID = 'a0o0U000000VVw8'.freeze

  def valid_listing_id
    YELLOW_ACRES_LISTING_ID
  end

  def invalid_listing_id
    'a0W0P00000DZfSpXXX'
  end

  def valid_application_id
    YELLOW_ACRES_APPLICATION_ID
  end

  def invalid_application_id
    'abcdertcoYYYYYXXX'
  end
end
