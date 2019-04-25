# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for preferences
    class PreferenceService < Force::Base
      FIELD_NAME = :preferences
      FIELDS = load_fields(FIELD_NAME).freeze

      def app_preferences_for_application(application_id)
        result = parsed_index_query(%(
          SELECT #{query_fields(:app_preferences_for_application)}
          FROM Application_Preference__c
          WHERE Application__c = '#{application_id}'
        ), :show_preference)

        result.map { |r| Force::Preference.from_salesforce(r).to_domain }
      end

      def app_preferences_for_listing(opts)
        query_scope = app_preferences_for_listing_query(opts)
        query_scope.where_contains('Application__r.Name', opts[:application_number]) if opts[:application_number].present?
        query_scope.where_eq('Application__r.Applicant__r.First_Name__c', "'#{opts[:first_name]}'") if opts[:first_name].present?
        query_scope.where_eq('Application__r.Applicant__r.Last_Name__c', "'#{opts[:last_name]}'") if opts[:last_name].present?
        query_scope.where_eq('Preference_Name__c', "'#{opts[:preference]}'") if opts[:preference].present?
        query_scope = status_query(query_scope, opts)

        query_scope.query
      end

      private

      def status_query(query_scope, opts)
        if opts[:status] == 'No Status'
          query_scope.where_eq('Application__r.Processing_Status__c', 'NULL')
        elsif opts[:status].present?
          query_scope.where_eq('Application__r.Processing_Status__c', "'#{opts[:status]}'")
        end
        query_scope
      end

      def app_preferences_for_listing_query(opts)
        builder.from(:Application_Preference__c)
               .select(query_fields(:app_preferences_for_listing))
               .where("Listing_Preference_ID__c IN (#{listing_subquery(opts[:listing_id])})")
               .where('Preference_Lottery_Rank__c != NULL')
               .where_eq('Receives_Preference__c', true)
               .paginate(opts)
               .order_by('Preference_Order__c', 'Preference_Lottery_Rank__c')
               .transform_results { |results| massage(results) }
      end

      def listing_subquery(listing_id)
        builder.from(:Listing_Lottery_Preference__c)
               .select(:Id)
               .where_eq('Listing__c', "'#{listing_id}'")
      end
    end
  end
end
