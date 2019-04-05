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

      # Add the "__c" suffix back onto Salesforce field names
      field_names = salesforce_fields.keys
      field_names.each do |field_name|
        unless %w[Id Name].include?(field_name) || field_name.end_with?('__c')
          salesforce_fields["#{field_name}__c"] = salesforce_fields[field_name]
          salesforce_fields.delete(field_name)
        end
      end

      salesforce_fields
    end

    def to_domain
      domain_fields = super

      if @fields.domain['lease_start_date']
        domain_fields['lease_start_date'] = self.class.date_to_domain(@fields.domain['lease_start_date'])
      end

      domain_fields
    end

    def self.date_to_domain(api_date)
      # Convert string date into array
      return nil if api_date.blank?
      api_date.split('-')
    end

    def self.date_to_salesforce(domain_date)
      return nil unless domain_date&.any?(&:present?)
      lease_date = Date.new(domain_date[0].to_i, domain_date[1].to_i, domain_date[2].to_i)
      lease_date.strftime('%F')
    end
  end
end
