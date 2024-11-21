# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for preferences
    class PreferencePaginationService < Force::Base
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

      def app_preferences_for_listing(opts)
        query_scope = app_preferences_for_listing_query(opts)

        query_scope.query
      end

      def accessibility_string(opts)
        opts[:accessibility].map do |accessibility|
          accessibility.split(', ').map { |item| "'#{item}'" }
        end.join(', ')
      end

      def preferences(opts)
        opts[:preference].map { |preference| "Preference_All_Name__c like '%#{preference}'" }.join(' or ')
      end

      def states(opts)
        opts[:status].map do |status|
          "Application__r.Processing_Status__c = #{status == 'No Status' ? 'NULL' : "'#{status}'"}"
        end.join(' or ')
      end

      def total_household_size(opts)
        opts[:total_household_size].map do |size|
          size == '5+' ? 'Application__r.Total_Household_Size__c >= 5' : "Application__r.Total_Household_Size__c = #{size}"
        end.join(' or ')
      end

      def build_app_preferences_filters(opts)
        # This builds the syntax need for soql to do an
        # OR statement when passing the option of `Vision/Hearing`
        # https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_querying_multiselect_picklists.htm
        filters = ''
        if opts[:accessibility].present?
          filters += " and Application__r.Has_ADA_Priorities_Selected__c INCLUDES (#{accessibility_string(opts)}) "
        end
        filters += " and (#{preferences(opts)})" if opts[:preference].present?
        filters += " and (#{states(opts)})" if opts[:status].present?
        filters += " and (#{total_household_size(opts)})" if opts[:total_household_size].present?
        filters
      end

      def build_app_preferences_search(search_terms_string)
        # Given a comma-separated list of search terms:
        # For each term, we search across name and application number for a match
        # For multiple terms, we expect the record to match each of the terms individually.
        search_terms = search_terms_string.split(',')
        search_fields = [
          'Application__r.Name',
          'Application__r.Applicant__r.First_Name__c',
          'Application__r.Applicant__r.Last_Name__c',
        ]
        search = []
        search_terms.each do |search_term|
          # For each term we join the fields with OR to return a record if it matches
          # across any of these fields.
          search_term_clause = []
          sanitized_term = ActiveRecord::Base.sanitize_sql_like search_term
          search_fields.each do |search_field|
            search_term_clause.push("#{search_field} like '%#{sanitized_term}%'")
          end
          search.push("(#{search_term_clause.join(' OR ')})")
        end
        # If there are multiple terms, join the clauses with "AND" because we expect each term to find a match.
        search.join(' AND ')
      end

      private

      def app_preferences_for_listing_query(opts)
        # The query for this was put together to combine the general
        # preferences with all other preferences as general was not
        # originally included as a preference name. Because of the
        # complexity of the query we are dynamically adding filters
        # within the WHERE clause with the helper function above. The
        # Preference_All_Name and Preference_All_Lottery_Rank fields
        # were added to bring all preferences into the same query.
        filters = build_app_preferences_filters(opts)
        search = opts[:search] ? build_app_preferences_search(opts[:search]) : nil
        builder.from(:Application_Preference__c)
               .select(query_fields(:app_preferences_for_listing))
               .where(%(
                Listing_ID__c = '#{opts[:listing_id].length >= 18 ? opts[:listing_id][0...-3] : opts[:listing_id]}'
                #{search ? "AND (#{search})" : ''}
                #{filters}
                and \(\(Preference_Lottery_Rank__c != null and Receives_Preference__c = true\)
                or \(Preference_Name__c = 'Live or Work in San Francisco Preference' and Application__r.General_Lottery_Rank__c != null\)\)
                and Application__c IN \(SELECT id FROM Application__c\)
              ))
               .paginate(opts)
               .order_by('Receives_Preference__c desc, Preference_Order__c, Preference_Lottery_Rank__c,  Application__r.General_Lottery_Rank__c asc')
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
