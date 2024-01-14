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

        log_var = Force::Preference.convert_list(result, :from_salesforce, :to_domain)

        # TODO
        # 1. loop through log_var
        # 2. if element is veteran
        # 3. create relationship with non veteran
        index = 0
        for preference in log_var
          types_of_proof = []
          if preference.preference_name.include?('Veteran')
            types_of_proof.push(preference.veteran_type_of_proof) if preference.veteran_type_of_proof
            types_of_proof.push(log_var[index + 1].type_of_proof) if log_var[index + 1].type_of_proof
          elsif preference.type_of_proof
            types_of_proof.push(preference.type_of_proof)
          end
          preference['types_of_proof'] = types_of_proof
          index += 1
        end
        # 4. add final_confirmation, types of proofs (array), claimants (array), and vet indexes for update (new field)
        # - what about lw_type_of_proof and others

        log_var
      end

      def app_preferences_for_listing(opts)
        query_scope = app_preferences_for_listing_query(opts)

        query_scope.query
      end

      def buildAppPreferencesFilters(opts)
        # This builds the syntax need for soql to do an
        # OR statement when passing the option of `Vision/Hearing`
        # https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_querying_multiselect_picklists.htm
        if opts[:accessibility].present?
          accessibility_string = opts[:accessibility].map do |accessibility|
            accessibility.split(', ').map { |item| "'#{item}'" }
          end.join(', ')
        end
        filters = ''
        filters += " and Application__r.Has_ADA_Priorities_Selected__c INCLUDES (#{accessibility_string}) " if opts[:accessibility].present?

        if opts[:preference].present?
          preferences = opts[:preference].map { |preference| "Preference_All_Name__c like '%#{preference}'" }.join(' or ')
          filters += " and (#{preferences})"
        end
        if opts[:status].present?
          states = opts[:status].map do |status|
            'Application__r.Processing_Status__c = ' + (status == 'No Status' ? 'NULL' : "'#{status}'")
          end.join(' or ')
          filters += " and (#{states})"
        end

        if opts[:total_household_size].present?
          total_household_size = opts[:total_household_size].map do |size|
            size == '5+' ? 'Application__r.Total_Household_Size__c >= 5' : "Application__r.Total_Household_Size__c = #{size}"
          end.join(' or ')
          filters += " and (#{total_household_size})"
        end

        filters
    end

    def buildAppPreferencesSearch(search_terms_string)
      # Given a comma-separated list of search terms:
      # For each term, we search across name and application number for a match
      # For multiple terms, we expect the record to match each of the terms individually.
      search_terms = search_terms_string.split(',')
      search_fields = [
        "Application__r.Name",
        "Application__r.Applicant__r.First_Name__c",
        "Application__r.Applicant__r.Last_Name__c",
      ]
      search = []
      for search_term in search_terms
        # For each term we join the fields with OR to return a record if it matches
        # across any of these fields.
        search_term_clause = []
        sanitized_term = ActiveRecord::Base.sanitize_sql_like search_term
        for search_field in search_fields
          search_term_clause.push("#{search_field} like '%#{sanitized_term}%'")
        end
        search.push('(' + search_term_clause.join(' OR ') + ')')
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
      filters = buildAppPreferencesFilters(opts)
      search = opts[:search] ? buildAppPreferencesSearch(opts[:search]) : nil
      builder.from(:Application_Preference__c)
             .select(query_fields(:app_preferences_for_listing))
             .where(%(
                Listing_ID__c = '#{opts[:listing_id].length >= 18 ? opts[:listing_id][0...-3] : opts[:listing_id]}'
                #{search ? 'AND (' + search + ')' : ''}
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
