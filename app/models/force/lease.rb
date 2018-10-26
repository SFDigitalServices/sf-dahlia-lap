# frozen_string_literal: true

module Force
  # Represent a lease object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for leases.
  class Lease < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'application_id', salesforce: 'Application__c' },
      { domain: 'id', salesforce: 'Id' },
      { domain: 'lease_status', salesforce: 'Lease_Status__c' },
      { domain: 'leaseStartDate', salesforce: 'Lease_Start_Date__c' },
      { domain: 'monthlyParkingRent', salesforce: 'Monthly_Parking_Rent__c' },
      { domain: 'monthlyTenantContribution', salesforce: 'Monthly_Tenant_Contribution__c' },
      { domain: 'noPreferenceUsed', salesforce: 'No_Preference_Used__c' },
      { domain: 'preferenceUsed', salesforce: 'Preference_Used__c' },
      { domain: 'primary_contact_id', salesforce: 'Tenant__c' },
      { domain: 'totalMonthlyRentWithoutParking', salesforce: 'Total_Monthly_Rent_without_Parking__c' },
      { domain: 'unit', salesforce: 'Unit__c' },
    ].freeze

    def to_salesforce
      salesforce_fields = super

      # Special field conversion cases for leases
      if @fields.domain.present?
        # Salesforce requires true/false for No_Preference_Used__c even if field was untouched
        no_pref_used_value = @fields.domain['noPreferenceUsed']
        salesforce_fields['No_Preference_Used__c'] = no_pref_used_value.nil? ? false : no_pref_used_value
      end

      salesforce_fields
    end
  end
end
