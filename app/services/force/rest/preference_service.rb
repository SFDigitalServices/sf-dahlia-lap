# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for preferences
    class PreferenceService < Force::Base
      def update(domain_attrs)
        preference = Force::Preference.from_domain(domain_attrs)
        @client.update!('Application_Preference__c', preference.to_salesforce)
      end
    end
  end
end
