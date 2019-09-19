# frozen_string_literal: true

module Force
  # Represents a single unit object. Provide mapping between
  # Salesforce object field names and LAP domain field names for listings.
  class Unit < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'id', salesforce: 'Id' },
      { domain: 'unit_type', salesforce: 'Unit_Type' },
      { domain: 'unit_number', salesforce: 'Unit_Number' },
      { domain: 'bmr_rent_monthly', salesforce: 'BMR_Rent_Monthly' },
      { domain: 'bmr_rental_minimum_monthly_income_needed', salesforce: 'BMR_Rental_Minimum_Monthly_Income_Needed' },
      { domain: 'status', salesforce: 'Status' },
      { domain: 'property_type', salesforce: 'Property_Type' },
      { domain: 'ami_chart_type', salesforce: 'AMI_chart_type' },
      { domain: 'ami_chart_year', salesforce: 'AMI_chart_year' },
      { domain: 'of_ami_for_pricing_unit', salesforce: 'of_AMI_for_Pricing_Unit' },
      { domain: 'reserved_type', salesforce: 'Reserved_Type' },
    ].freeze
  end
end
