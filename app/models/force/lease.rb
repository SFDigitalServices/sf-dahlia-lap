# frozen_string_literal: true

module Force
  # Represent a lease object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for leases.
  class Lease < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'application_id', salesforce: 'Application' },
      { domain: 'id', salesforce: 'Id' },
      { domain: 'lease_status', salesforce: 'Lease_Status' },
      { domain: 'lease_start_date', salesforce: 'Lease_Start_Date' },
      { domain: 'monthly_parking_rent', salesforce: 'Monthly_Parking_Rent' },
      { domain: 'monthly_tenant_contribution', salesforce: 'Monthly_Tenant_Contribution' },
      { domain: 'no_preference_used', salesforce: 'No_Preference_Used' },
      { domain: 'preference_used', salesforce: 'Preference_Used' },
      { domain: 'primary_applicant_contact', salesforce: 'Tenant' },
      { domain: 'total_monthly_rent_without_parking', salesforce: 'Total_Monthly_Rent_without_Parking' },
      { domain: 'unit', salesforce: 'Unit' },
    ].freeze

    def to_salesforce
      salesforce_fields = super

      # Add the "__c" suffix back onto Salesforce field names
      field_names = salesforce_fields.keys
      field_names.each do |field_name|
        unless %w[Id Name].include?(field_name) || field_name.end_with?('__c')
          salesforce_fields["#{field_name}__c"] = salesforce_fields[field_name]
          salesforce_fields.delete(field_name)
        end
      end

      # Special field conversion cases for leases
      if @fields.domain.present?
        # Salesforce requires true/false for No_Preference_Used__c even if field was untouched
        no_pref_used_value = @fields.domain['no_preference_used']
        salesforce_fields['No_Preference_Used__c'] = no_pref_used_value.nil? ? false : no_pref_used_value
      end

      salesforce_fields
    end
  end
end
