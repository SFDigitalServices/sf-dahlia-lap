# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for preferences
    class LotteryResultsService < Force::Base
      FIELD_NAME = :preferences
      FIELDS = load_fields(FIELD_NAME).freeze

      def app_preferences_for_application(application_id, should_order: false)
        result = parsed_index_query(%(
          SELECT #{query_fields(:app_preferences_for_application)}
          FROM Application_Preference__c
          WHERE Application__c = '#{application_id}'
          #{should_order ? 'ORDER BY Preference_Order__c ASC' : ''}
        ), :show_preference)

        Force::Preference.convert_list(result, :from_salesforce, :to_domain)
      end

      def app_preferences_for_listing(listing_id)
        query_scope = app_preferences_for_listing_query(listing_id)

        query_scope.query
      end

      private

      def app_preferences_for_listing_query(listing_id)
        builder.from(:Application_Preference__c)
               .select(query_fields(:app_preferences_for_lottery_results))
               .where(%(
                Listing_ID__c = '#{listing_id.length >= 18 ? listing_id[0...-3] : listing_id}'
                and \(\(Preference_Lottery_Rank__c != null and Receives_Preference__c = true\)
                or \(Preference_Name__c = 'Live or Work in San Francisco Preference' and Application__r.General_Lottery_Rank__c != null\)\)
                and Application__c IN \(SELECT id FROM Application__c\)
              ))
               .order_by('Receives_Preference__c desc, Preference_Order__c, Preference_Lottery_Rank__c,  Application__r.General_Lottery_Rank__c asc')
               .transform_results { |results| massage(results) }
      end
    end
  end
end
