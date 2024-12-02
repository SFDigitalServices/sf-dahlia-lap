# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for applications
    class LeaseUpApplicationService < Force::Base
      FIELD_NAME = :applications
      FIELDS = load_fields(FIELD_NAME).freeze

      def lease_up_applications(opts)
        query_scope = lease_up_applications_query(opts)

        query_scope.query
      end

      def build_applications_search(search_terms_string)
        # Given a comma-separated list of search terms:
        # For each term, we search across name and application number for a match
        # For multiple terms, we expect the record to match each of the terms individually.
        search_terms = search_terms_string.split(',')
        search_fields = [
          'Name',
          'Applicant__r.First_Name__c',
          'Applicant__r.Last_Name__c',
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

      def build_applications_filters(opts)
        # This builds the syntax need for soql to do an
        # OR statement when passing the option of `Vision/Hearing`
        # https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_querying_multiselect_picklists.htm
        filters = ''
        if opts[:accessibility].present?
          accessibility_string = opts[:accessibility].map do |accessibility|
            accessibility.split(', ').map { |item| "'#{item}'" }
          end.join(', ')
          filters += " and Has_ADA_Priorities_Selected__c INCLUDES (#{accessibility_string}) "
        end

        if opts[:status].present?
          states = opts[:status].map do |status|
            "Processing_Status__c = #{status == 'No Status' ? 'NULL' : "'#{status}'"}"
          end.join(' or ')
          filters += " and (#{states})"
        end

        if opts[:total_household_size].present?
          total_household_size = opts[:total_household_size].map do |size|
            size == '5+' ? 'Total_Household_Size__c >= 5' : "Total_Household_Size__c = #{size}"
          end.join(' or ')
          filters += " and (#{total_household_size})"
        end

        filters
      end

      private

      def lease_up_applications_query(opts)
        filters = build_applications_filters(opts)
        search = opts[:search] ? build_applications_search(opts[:search]) : nil

        builder.from(:Application__c)
               .select(query_fields(:show_rental_fcfs), 'Sub_Status__c', 'Processing_Date_Updated__c')
               .where(%(
                  Listing__r.ID = '#{opts[:listing_id].length >= 18 ? opts[:listing_id][0...-3] : opts[:listing_id]}'
                  AND Status__c != 'Removed'
                  #{search ? "AND (#{search})" : ''}
                  #{filters}
                ))
               .order_by('Lottery_Rank__c NULLS LAST, CreatedDate')
               .paginate(opts)
               .transform_results { |results| massage(results) }
      end
    end
  end
end
