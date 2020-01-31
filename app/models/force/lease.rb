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
      { domain: 'bmr_parking_space_assigned', salesforce: 'BMR_Parking_Space_Assigned' },
      { domain: 'monthly_tenant_contribution', salesforce: 'Monthly_Tenant_Contribution' },
      { domain: 'no_preference_used', salesforce: 'No_Preference_Used' },
      { domain: 'preference_used', salesforce: 'Preference_Used' },
      { domain: 'primary_applicant_contact', salesforce: 'Tenant' },
      { domain: 'total_monthly_rent_without_parking', salesforce: 'Total_Monthly_Rent_without_Parking' },
      { domain: 'unit', salesforce: 'Unit' },
    ].freeze

    def to_salesforce
      salesforce_fields = super

      # Convert array date into string
      if @fields.domain['lease_start_date']
        salesforce_fields['Lease_Start_Date'] = self.class.date_to_salesforce(@fields.domain['lease_start_date'])
      end

      # Special field conversion case for preference used
      if @fields.domain.present?
        # Salesforce requires true/false for No_Preference_Used__c even if field was untouched
        no_pref_used_value = @fields.domain['no_preference_used']
        salesforce_fields['No_Preference_Used'] = no_pref_used_value.nil? ? false : no_pref_used_value
      end

      add_salesforce_suffix(salesforce_fields)
    end

    def to_domain
      domain_fields = super

      fields_lease_start_date = @fields.domain['lease_start_date']
      domain_fields['lease_start_date'] = self.class.date_to_json(fields_lease_start_date) if fields_lease_start_date

      domain_fields
    end
  end
end
