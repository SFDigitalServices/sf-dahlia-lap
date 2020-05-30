# frozen_string_literal: true

module Force
  class FlaggedApplication < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { domain: 'id', salesforce: 'Id' },
      { domain: 'review_status', salesforce: 'Review_Status' },
      { domain: 'comments', salesforce: 'Comments' },
      { domain: 'primary_application_applicant_name', salesforce: 'Primary_Application_Applicant_Name' },
      { domain: 'application', salesforce: 'Application' },
      { domain: 'flagged_record', salesforce: 'Flagged_Record_Set' },
    ].freeze

    def to_domain
      domain_fields = super

      if domain_fields['application']
        domain_fields['application'] = Force::Application.from_salesforce(domain_fields['application']).to_domain
      end

      if domain_fields['flagged_record']
        domain_fields['flagged_record'] = Force::FlaggedRecordSet.from_salesforce(domain_fields['flagged_record']).to_domain
      end

      domain_fields
    end

    def to_salesforce
      salesforce_fields = super

      if salesforce_fields['Application']
        salesforce_fields['Application'] = Force::Application.from_domain(salesforce_fields['Application']).to_salesforce
      end

      if salesforce_fields['Flagged_Record_Set']
        salesforce_fields['Flagged_Record_Set'] = Force::FlaggedRecordSet.from_domain(salesforce_fields['Flagged_Record_Set']).to_salesforce
      end

      salesforce_fields
    end

    def to_salesforce_with_suffix
      salesforce_fields = to_salesforce()
      add_salesforce_suffix(salesforce_fields)
    end
  end
end