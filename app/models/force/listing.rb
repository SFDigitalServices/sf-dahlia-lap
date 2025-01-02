# frozen_string_literal: true

module Force
  # Represents a listing object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for listings.
  class Listing < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'open_houses', salesforce: 'Open_Houses' },
      { domain: 'id', salesforce: 'Id' },
      { domain: 'owner_id', salesforce: 'OwnerId' },
      { domain: 'application_due_date', salesforce: 'Application_Due_Date' },
      { domain: 'name', salesforce: 'Name' },
      { domain: 'tenure', salesforce: 'Tenure' },
      { domain: 'status', salesforce: 'Status' },
      { domain: 'min_br', salesforce: 'Min_BR' },
      { domain: 'lottery_winners', salesforce: 'Lottery_Winners' },
      { domain: 'max_br', salesforce: 'Max_BR' },
      { domain: 'lottery_results', salesforce: 'Lottery_Results' },
      { domain: 'min_income', salesforce: 'Min_Income' },
      { domain: 'max_income', salesforce: 'Max_Income' },
      { domain: 'min_occupancy', salesforce: 'Min_Occupancy' },
      { domain: 'max_occupancy', salesforce: 'Max_Occupancy' },
      { domain: 'building_name', salesforce: 'Building_Name' },
      { domain: 'neighborhood', salesforce: 'Neighborhood' },
      { domain: 'building_street_address', salesforce: 'Building_Street_Address' },
      { domain: 'developer', salesforce: 'Developer' },
      { domain: 'building_city', salesforce: 'Building_City' },
      { domain: 'building_url', salesforce: 'Building_URL' },
      { domain: 'building_state', salesforce: 'Building_State' },
      { domain: 'year_built', salesforce: 'Year_Built' },
      { domain: 'building_zip_code', salesforce: 'Building_Zip_Code' },
      { domain: 'description', salesforce: 'Description' },
      { domain: 'lottery_preferences', salesforce: 'Lottery_Preferences' },
      { domain: 'accessibility', salesforce: 'Accessibility' },
      { domain: 'fee', salesforce: 'Fee' },
      { domain: 'amenities', salesforce: 'Amenities' },
      { domain: 'deposit_min', salesforce: 'Deposit_Min' },
      { domain: 'costs_not_included', salesforce: 'Costs_Not_Included' },
      { domain: 'deposit_max', salesforce: 'Deposit_Max' },
      { domain: 'lottery_date', salesforce: 'Lottery_Date' },
      { domain: 'lottery_results_date', salesforce: 'Lottery_Results_Date' },
      { domain: 'lottery_venue', salesforce: 'Lottery_Venue' },
      { domain: 'lottery_summary', salesforce: 'Lottery_Summary' },
      { domain: 'lottery_street_address', salesforce: 'Lottery_Street_Address' },
      { domain: 'lottery_city', salesforce: 'Lottery_City' },
      { domain: 'lottery_url', salesforce: 'Lottery_URL' },
      { domain: 'reserved_community_type', salesforce: 'Reserved_community_type' },
      { domain: 'application_phone', salesforce: 'Application_Phone' },
      { domain: 'application_organization', salesforce: 'Application_Organization' },
      { domain: 'application_street_address', salesforce: 'Application_Street_Address' },
      { domain: 'application_city', salesforce: 'Application_City' },
      { domain: 'download_url', salesforce: 'Download_URL' },
      { domain: 'application_state', salesforce: 'Application_State' },
      { domain: 'application_postal_code', salesforce: 'Application_Postal_Code' },
      { domain: 'in_lottery', salesforce: 'In_Lottery' },
      { domain: 'is_rental' },
      { domain: 'is_sale' },
      { domain: 'leasing_agent_name', salesforce: 'Leasing_Agent_Name' },
      { domain: 'leasing_agent_title', salesforce: 'Leasing_Agent_Title' },
      { domain: 'leasing_agent_email', salesforce: 'Leasing_Agent_Email' },
      { domain: 'leasing_agent_phone', salesforce: 'Leasing_Agent_Phone' },
      { domain: 'legal_disclaimers', salesforce: 'Legal_Disclaimers' },
      { domain: 'building_selection_criteria', salesforce: 'Building_Selection_Criteria' },
      { domain: 'pet_policy', salesforce: 'Pet_Policy' },
      { domain: 'report_id', salesforce: 'Report_id' },
      { domain: 'required_documents', salesforce: 'Required_Documents' },
      { domain: 'smoking_policy', salesforce: 'Smoking_Policy' },
      { domain: 'eviction_history', salesforce: 'Eviction_History' },
      { domain: 'criminal_history', salesforce: 'Criminal_History' },
      { domain: 'credit_rating', salesforce: 'Credit_Rating' },
      { domain: 'lottery_status', salesforce: 'Lottery_Status' },
      { domain: 'office_hours', salesforce: 'Office_Hours' },
      { domain: 'information_sessions', salesforce: 'Information_Sessions' },
      { domain: 'nflagged_applications', salesforce: 'nFlagged_Applications' },
      { domain: 'units_available', salesforce: 'Units_Available' },
      { domain: 'lease_signed_application', salesforce: 'Lease_Signed_Application' },
      { domain: 'last_modified_date', salesforce: 'LastModifiedDate' },
      { domain: 'owner', salesforce: 'Owner' },
      { domain: 'account', salesforce: 'Account' },
      { domain: 'building', salesforce: 'Building' },
      { domain: 'listing_lottery_preferences', salesforce: 'Listing_Lottery_Preferences' },
      { domain: 'units', salesforce: 'Units' },
      { domain: 'listing_type', salesforce: 'Listing_Type' },
      { domain: 'custom_listing_type', salesforce: 'Custom_Listing_Type' },
    ].freeze

    LISTING_TYPE_FIRST_COME_FIRST_SERVED = 'First Come, First Served'

    def map_list_to_domain(domain_fields, listDomainFieldName, forceClass)
      if domain_fields[listDomainFieldName]
        domain_fields[listDomainFieldName] = forceClass.convert_list(domain_fields[listDomainFieldName], :from_salesforce, :to_domain)
      end
    end

    def map_list_to_salesforce(salesforce_fields, listSalesforceFieldName, forceClass)
      if salesforce_fields[listSalesforceFieldName]
        salesforce_fields[listSalesforceFieldName] = forceClass.convert_list(salesforce_fields[listSalesforceFieldName], :from_domain, :to_salesforce)
      end
    end

    def to_domain
      domain_fields = super
      return if domain_fields.blank?

      domain_fields[:is_sale] = Force::Soql::ListingService.sale?(domain_fields)
      domain_fields[:is_rental] = !domain_fields[:is_sale]
      domain_fields.owner = domain_fields.dig(:owner, :Name) if domain_fields[:owner]
      domain_fields.account = domain_fields.dig(:account, :Name) if domain_fields[:account]
      domain_fields.building = domain_fields.dig(:building, :Name) if domain_fields[:building]

      # TODO: These sub-object mappings are so common there should be a way to specify them in
      # FIELD_NAME_MAPPINGS hash so this happens automatically
      map_list_to_domain(domain_fields, :information_sessions, Force::InformationSession)
      map_list_to_domain(domain_fields, :open_houses, Force::OpenHouse)
      map_list_to_domain(domain_fields, :listing_lottery_preferences, Force::LotteryPreference)
      map_list_to_domain(domain_fields, :units, Force::Unit)

      domain_fields
    end

    def to_salesforce
      salesforce_fields = super
      return if salesforce_fields.blank?

      salesforce_fields.Owner = { "Name": salesforce_fields.Owner }
      salesforce_fields.Account = { "Name": salesforce_fields.Account }
      salesforce_fields.Building = { "Name": salesforce_fields.Building }

      # TODO: These sub-object mappings are so common there should be a way to specify them in
      # FIELD_NAME_MAPPINGS hash so this happens automatically
      map_list_to_salesforce(salesforce_fields, :Information_Sessions, Force::InformationSession)
      map_list_to_salesforce(salesforce_fields, :Open_Houses, Force::OpenHouse)
      map_list_to_salesforce(salesforce_fields, :Listing_Lottery_Preferences, Force::LotteryPreference)
      map_list_to_salesforce(salesforce_fields, :Units, Force::Unit)

      salesforce_fields
    end
  end
end
