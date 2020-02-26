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

        query_scope.query
      end

      def buildAppPreferencesFilters(opts)
        # This builds the syntax need for soql to do an
        # OR statement when passing the option of `Vision/Hearing`
        # https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_querying_multiselect_picklists.htm
        if opts[:accessibility]
          accessibility_filters = opts[:accessibility].split(', ')
          accessibility_string = accessibility_filters.length == 1 ? "'#{accessibility_filters[0]}'" : "'#{accessibility_filters[0]}', '#{accessibility_filters[1]}'"
        end

        filters = ''
        filters += "and Preference_All_Name__c like '%#{opts[:preference]}' " if opts[:preference].present?
        filters += "and Application__r.Name like '%#{opts[:application_number]}%' " if opts[:application_number].present?
        filters += "and Application__r.Applicant__r.First_Name__c like '%#{opts[:first_name]}%' " if opts[:first_name].present?
        filters += "and Application__r.Applicant__r.Last_Name__c like '%#{opts[:last_name]}%' " if opts[:last_name].present?
        filters += "and Application__r.Processing_Status__c = " + (opts[:status] == 'No Status' ? 'NULL' : "'#{opts[:status]}'") if opts[:status].present?
        filters += "and Application__r.Has_ADA_Priorities_Selected__c INCLUDES (#{accessibility_string}) " if opts[:accessibility].present?

        filters
    end

    private

    def app_preferences_for_listing_query(opts)
      # The query for this was put together to combine the general
      # preferences with all other preferences as general was not
      # originally included as a preference name. Because of the
      # complexity of the query we are dynamically adding filters
      # within the WHERE clause with the helper function above. The
      # Preference_All_Name and Preference_All_Lottery_Rank fields
      # were added to bring all prefernces into the same query.
      filters = buildAppPreferencesFilters(opts)
      builder.from(:Application_Preference__c)
             .select(query_fields(:app_preferences_for_listing))
             .where(%(
                Listing_ID__c = '#{opts[:listing_id].length >= 18 ? opts[:listing_id][0...-3] : opts[:listing_id]}'
                #{filters}
                and \(\(Preference_Lottery_Rank__c != null and Receives_Preference__c = true\)
                or \(Preference_Name__c = 'Live or Work in San Francisco Preference' and Application__r.General_Lottery_Rank__c != null\)\)
                and Application__c IN \(SELECT id FROM Application__c\)
              ))
             .paginate(opts)
             .order_by("Receives_Preference__c desc, Preference_Order__c, Preference_Lottery_Rank__c,  Application__r.General_Lottery_Rank__c asc")
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
