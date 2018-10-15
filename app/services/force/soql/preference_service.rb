module Force
  module Soql
    # Provide Salesforce SOQL API interactions for preferences
    class PreferenceService < Force::Base
      FIELD_NAME = :preferences
      FIELDS = load_fields(FIELD_NAME).freeze

      def application_preferences(application_id)
        parsed_index_query(%(
          SELECT #{query_fields(:show_preference)}
          FROM Application_Preference__c
          WHERE Application__c = '#{application_id}'
        ), :show_preference)
      end
    end
  end
end
