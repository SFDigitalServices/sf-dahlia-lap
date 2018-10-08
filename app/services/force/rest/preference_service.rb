module Force
  module Rest
    # Provide Salesforce standard REST API interactions for preferences
    class PreferenceService < Force::Base
      def update(attrs)
        preference = Force::Preference.new(attrs, :domain)
        @client.update('Application_Preference__c', preference.to_soql)
      end
    end
  end
end
